import { EmbedBuilder, Message } from "discord.js";

export function messageMod(msg: Message, guild: any) {
    msg.delete();
    msg.author.send({
        content: `Hey ${msg.author}, your message* was deleted because it was too toxic!\n\n*\`\`\`\n${msg.content}\`\`\``
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

export function messageMod_mentions(msg: Message, guild: any) {
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

export function messageMod_links(msg: Message, guild: any) {
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