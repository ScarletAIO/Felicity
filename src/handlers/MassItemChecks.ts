import { EmbedBuilder, Message, TextChannel } from "discord.js";
import database from "../db/db";

export default async function MassHandler(msg: Message) {
    const content = msg.content;
    if (!content || !msg.guild) { return; }
    const guild = database.getGuild(msg?.guild?.id as string);
    if (!guild) { return; }
    const { 
        mass_mentions: mentionSize, // Global for Channels, Roles, Users
        toggle_links: noLinks,
        toggle_invites: noInvites, 
        toggle_nsfw: noNSFW,
        toggle_mentions: noMentions,
    } = guild;

    switch(true) {
        case noMentions:
            if (msg.mentions.channels.size > mentionSize) {
                msg.delete();
                msg.author.send({
                    content: `Hey ${msg.author}, your message* was deleted because it had too many mentions!\n\n*\`\`\`\n${msg.content}\`\`\``
                }).catch(() => {
                    return; // ignore if we can't DM the user
                }).finally(() => {
                    // Send a message to the modlog channel
                    const channel = msg.guild?.channels.cache.get(guild.log_channel as string);
                    if (channel) {
                        channel.fetch().then((c) => {
                            // Create an embed and send it to the channel
                            const embed = new EmbedBuilder()
                                .setTitle("Message Deleted")
                                .setDescription(`A message was deleted in ${msg.channel} by ${msg.author}`)
                                .addFields([
                                    {
                                        name: "Message",
                                        value: `\`\`\`\n${msg.content}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: "Reason",
                                        value: "Too many mentions",
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
            if (msg.mentions.roles.size > mentionSize) {
                msg.delete();
                msg.author.send({
                    content: `Hey ${msg.author}, your message* was deleted because it had too many mentions!\n\n*\`\`\`\n${msg.content}\`\`\``
                }).catch(() => {
                    return; // ignore if we can't DM the user
                }).finally(() => {
                    // Send a message to the modlog channel
                    const channel = msg.guild?.channels.cache.get(guild.log_channel as string);
                    if (channel) {
                        channel.fetch().then((c) => {
                            // Create an embed and send it to the channel
                            const embed = new EmbedBuilder()
                                .setTitle("Message Deleted")
                                .setDescription(`A message was deleted in ${msg.channel} by ${msg.author}`)
                                .addFields([
                                    {
                                        name: "Message",
                                        value: `\`\`\`\n${msg.content}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: "Reason",
                                        value: "Too many mentions",
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
            if (msg.mentions.users.size > mentionSize) {
                msg.delete();
                msg.author.send({
                    content: `Hey ${msg.author}, your message* was deleted because it had too many mentions!\n\n*\`\`\`\n${msg.content}\`\`\``
                }).catch(() => {
                    return; // ignore if we can't DM the user
                }).finally(() => {
                    // Send a message to the modlog channel
                    const channel = msg.guild?.channels.cache.get(guild.log_channel as string);
                    if (channel) {
                        channel.fetch().then((c) => {
                            // Create an embed and send it to the channel
                            const embed = new EmbedBuilder()
                                .setTitle("Message Deleted")
                                .setDescription(`A message was deleted in ${msg.channel} by ${msg.author}`)
                                .addFields([
                                    {
                                        name: "Message",
                                        value: `\`\`\`\n${msg.content}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: "Reason",
                                        value: "Too many mentions",
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
        case noLinks:
            if (msg.content.includes("https://") || msg.content.includes("http://")) {
                msg.delete();
                msg.author.send({
                    content: `Hey ${msg.author}, your message* was deleted because it had a link!\n\n*\`\`\`\n${msg.content}\`\`\``
                }).catch(() => {
                    return; // ignore if we can't DM the user
                }).finally(() => {
                    // Send a message to the modlog channel
                    const channel = msg.guild?.channels.cache.get(guild.log_channel as string);
                    if (channel) {
                        channel.fetch().then((c) => {
                            // Create an embed and send it to the channel
                            const embed = new EmbedBuilder()
                                .setTitle("Message Deleted")
                                .setDescription(`A message was deleted in ${msg.channel} by ${msg.author}`)
                                .addFields([
                                    {
                                        name: "Message",
                                        value: `\`\`\`\n${msg.content}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: "Reason",
                                        value: "Link",
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
        case noInvites:
            if (msg.content.includes("discord.gg/")) {
                return msg.delete();
            }
        case noNSFW:
            if (!(msg.channel as TextChannel)?.nsfw) {
                //TODO: rebuild Scarlet's NSFW API
                // REF: https://github.com/KazutoKashima/ScarletNSFW
                return;
            }
        default: return;
    }
}