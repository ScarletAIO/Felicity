import { AuditLogEvent, EmbedBuilder, Message, time } from "discord.js";
import db from "../db/db";

module.exports = {
    name: "messageBulkDelete",
    once: false,
    execute: async (messages: Message[]) => {
        try 
        {
            const guild = await db.getGuild(messages[0].guildId as string);
            const logId = guild.log_channel as string;
            let auditLogs = await messages[0].guild?.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MessageBulkDelete });
            let log = auditLogs?.entries.first();
            if (!log) { return; }
            let { executor } = log;
            const LogEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Messages Deleted")
                .setDescription(`Message Count: ${messages.length}`)
                .addFields([
                    {
                        name: "Deleted By: ",
                        value: `${executor?.tag} (${executor?.id})`,
                        inline: true
                    },
                    {
                        name: "Channel: ",
                        value: `${messages[0].channel}`,
                        inline: true
                    },
                    {
                        name: "Deleted At: ",
                        value: `${time(Date.now(), 'R')}`,
                        inline: true
                    },
                    {
                        name: "Messages: ",
                        value: `\`\`\`\n${messages.reverse().map((m: any) => `${m.content}`).join("\n")}\n\`\`\` `,
                        inline: false
                    }
                ])
                .setFooter({
                    "iconURL": messages[0].guild?.iconURL() as string,
                    "text": `${messages[0].guild?.name} (${messages[0].guild?.id})`
                });

            const LogChannel = messages[0].guild?.channels.cache.find((c) => c.id === logId);
            if (!LogChannel) { return; }
            LogChannel.fetch().then((c) => {
                // @ts-ignore
c.send({embeds: [LogEmbed]});
            }).catch(console.error);
        }
        catch(e)
        {
            console.error(`[!] Error`, e);
        }
    }
}