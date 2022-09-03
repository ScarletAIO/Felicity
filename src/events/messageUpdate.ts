import axios from "axios";
import { Message, EmbedBuilder, time } from "discord.js";
import db from "../db/db";
import MassHandler from "../handlers/MassItemChecks";
import blacklist from "../../blacklist.json";

module.exports = {
    name: "messageUpdate",
    once: false,
    execute: async (oldMessage: Message, newMessage: Message) => {
        try 
        {
            if (!oldMessage.guild) { return; }

            await MassHandler(newMessage);

            const guild = await db.getGuild(oldMessage.guildId as string);
            const user = await db.getUser(newMessage.author.id as string);
            const bl: {
                users: [string]
            } = JSON.parse(JSON.stringify(blacklist));
            if (!user && !bl.users.includes(newMessage.author.id)) {
                db.createUser(
                    newMessage.author.id, 
                    newMessage.author.username, 
                    newMessage.author.discriminator, 
                    newMessage.author.avatarURL() as string, 
                    newMessage.author.bot
                );
            }
            if (guild === undefined) { 
                db.createGuild(
                    newMessage.guildId as string, 
                    newMessage.guild?.name as string, 
                    newMessage.guild?.iconURL() as string,
                    newMessage.guild?.ownerId as string
                )
            }
            let logId = guild.log_channel as string;   

            if (oldMessage.content === newMessage.content) { return; }
            if (oldMessage.author.bot) { return; }
            
            const response = (await axios.post("https://api.scarletai.xyz/v3/analyze/msg", {
                text: newMessage.content,
            }))?.data.analyze.score;

            const threshold = guild.tolerance as number;

            if ((response <= threshold) && guild.toggle_ai == true) {
                const message = newMessage; // for readability
                return (
                    message.delete(),
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
                            })
                        }
                    })
                );
            }


            const LogEmbed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle("Message Updated")
                .setDescription(`Message Before: ${oldMessage.content}\nMessage After: ${newMessage.content}`)
                .addFields([
                    {
                        name: "Author: ",
                        value: `${oldMessage.author.tag} (${oldMessage.author.id})`,
                        inline: true
                    },
                    {
                        name: "Channel: ",
                        value: `${oldMessage.channel} (${oldMessage.channel.id})`,
                        inline: true
                    },
                    {
                        name: "Edited At: ",
                        value: time(new Date(), 'R'),
                        inline: true
                    }
                ])
                .setFooter({
                    "iconURL": oldMessage.guild.iconURL({ "forceStatic": false }) as string,
                    "text": `${oldMessage.guild.name} (${oldMessage.guild.id})`
                });

            const LogChannel = oldMessage.guild.channels.cache.find((c: any) => c.id === logId);
            if (!LogChannel) { return; }
            LogChannel.fetch().then((c) => {
                // @ts-ignore
                c.send({embeds: [LogEmbed]});
            })
        }
        catch(e)
        {
            console.error(`[!] Error`, e);
        }
    }
}