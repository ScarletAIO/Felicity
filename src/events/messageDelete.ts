import { Message, EmbedBuilder, time, AuditLogEvent } from "discord.js";
import db from "../db/db";

module.exports = {
    name: "messageDelete",
    once: false,
    execute: async (message: Message) => {
        try 
        {
            if (!message.guild) { return; }
            const FetchLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MessageDelete
            });
            
            const guild = await db.getGuild(message.guildId as string);
            let logId = guild.log_channel as string;  

            const DeleteLog = FetchLogs.entries.first();
            if (!DeleteLog) { return; }

            const { executor } = DeleteLog;
            const LogEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Message Deleted")
                .setDescription(`Message: \n> ${message.content}\ \n- By: ${message.author}`)
                .addFields([
                    {
                        name: "Deleted By",
                        value: `${executor} (${executor?.id})`,
                        inline: false
                    },
                    {
                        name: "Channel",
                        value: `${message.channel}`,
                        inline: false
                    },
                    {
                        name: "Deleted At",
                        value: `${time(new Date, 'R')}`,
                    }
                ])
                .setFooter({
                    "iconURL": message.guild.iconURL() as string,
                    "text": `${message.guild.name} (${message.guild.id})`
                });

            const LogChannel = message.guild.channels.cache.find((c: any) => c.id === logId);
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