// Handle the messageCreate event

import axios from "axios";
import {  EmbedBuilder, Message } from "discord.js";
import database from "../db/db";
import MassHandler from "../handlers/MassItemChecks";
import blacklist from "../../blacklist.json";

module.exports = {
    name: "messageCreate",
    once: false,
    execute: async (message: Message) => {
        if (message.author.bot) { return; }
        if (!message.guild) { return; }

        // Handle the Mass Item Checks
        await MassHandler(message);
        
        // Get the guild from the DB
        const guild = await database.getGuild(message.guildId as string);
        const user = await database.getUser(message.author.id as string);
        const bl: {
            users: [string]
        } = JSON.parse(JSON.stringify(blacklist));
        if (!user) {
            database.createUser(
                message.author.id, 
                message.author.username, 
                message.author.discriminator, 
                message.author.avatarURL() as string, 
                message.author.bot
            );
        }
        if (user && user.afk == 1) {
            database.setAFK(message.author.id, false, '');
            message.reply(`Welcome back! I removed your AFK status.`);
        } else {
            return;
        }
        if (guild === undefined) { 
            database.createGuild(
                message.guildId as string, 
                message.guild?.name as string, 
                message.guild?.iconURL() as string,
                message.guild?.ownerId as string
            )
        }
        try {
            const threshold = guild.tolerance as number;

            const response = (await axios.post("https://api.scarletai.xyz/v3/analyze/msg", {
                text: message.content,
            }))?.data.analyze.score;

            if (message.mentions.members?.size) {
                // get the user mentioned
                const mentioned = message.mentions.members.first();
                // get the user from the DB
                const mentionedUser = await database.getUser(mentioned?.id as string);
                console.log(mentionedUser);
                // check if the user is AFK
                if (mentionedUser.afk === 1) {
                    // if they are, send the embed
                    const embed = new EmbedBuilder()
                        .setTitle(`${mentioned?.user.username} is AFK!`)
                        .setDescription(mentionedUser.afkReason as string)
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({
                            text: `Scarlet AI | ${message.author.username}`, 
                            iconURL: message.author.avatarURL() as string
                        });
                    message.reply({ embeds: [embed] });
                    message.delete();
                }
            }

            if ((response <= threshold) && guild.toggle_ai == true) {
                message.delete();
                message.author.send({
                    content: `Hey ${message.author}, your message* was deleted because it was too toxic!\n\n*\`\`\`\n${message.content}\`\`\``
                }).catch(() => {
                    return; // ignore if we can't DM the user
                }).finally(() => {
                    // Send a message to the modlog channel
                    const channel = message.guild?.channels.cache.get(guild.log_channel as string);
                    if (channel) {
                        channel.fetch().then((c) => {
                            // Create an embed and send it to the channel
                            const embed = new EmbedBuilder()
                                .setTitle("Message Deleted")
                                .setDescription(`A message was deleted in ${message.channel} by ${message.author}`)
                                .addFields([
                                    {
                                        name: "Message",
                                        value: `\`\`\`\n${message.content}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: "Reason",
                                        value: "Toxicity",
                                        inline: false
                                    }
                                ])
                                .setColor("Red")
                                .setTimestamp();
                            // @ts-ignore
                            c.send({ embeds: [embed] });
                        }).catch(console.error);
                    }
                })
            }
        } catch (err) {
            console.error(err);
        }
    }
};