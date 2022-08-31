// Handle the messageCreate event

import { EmbedBuilder, Message } from "discord.js";
import scarletai from "scarletai.js";
import database from "../db/db";

module.exports = {
    name: "messageCreate",
    once: false,
    execute: async (message: Message) => {
        if (message.author.bot) { return; }

        // Get the guild from the DB
        const guild = await database.getGuild(message.guildId as string);
        const threshold = guild.tolerance as number;

        const ai = scarletai;

        const response = await ai.analyzer(escape(message.content)).then((res:any) => {
            if (res.status === "success") {
                return res.analyze.score;
            }
        });

        if (response <= threshold) {
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
            )
        }
    }
};