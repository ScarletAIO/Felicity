// module for the guildCreate event

import { Client, EmbedBuilder, Guild, TextChannel } from "discord.js";

module.exports = {
    name: "guildCreate",
    once: false,
    execute: async (guild: Guild, client:Client) => {
        console.log(`Joined guild: ${guild.name} (${guild.id})`);
        const logchannel = client.channels.cache.find((c) => c.id === "1015836371937665135") as TextChannel;
        
        // get the guild invites:
        const invites = await guild.invites.fetch()
            .then((invites) => {
                return invites.map((invite) => {
                    return `, ${invite.code} (${invite.uses ?? 0} uses)`;
                });
            })
        
        logchannel.send({
            content: `Joined guild: ${guild.name} (${guild.id})`,
            embeds: [
                new EmbedBuilder()
                .setTitle("Guild Joined")
                .setDescription(`**Guild Name:** ${guild.name}\n**Guild ID:** ${guild.id}\n**Guild Member Count:** ${guild.memberCount}`)
                .setTimestamp()
                .setColor(0x00ff00)
                .addFields(
                    {
                        name: "Shard ID",
                        value: `${guild?.shardId as any as string}`,
                        inline: true
                    },
                    {
                        name: "Verification Level",
                        value: `${guild.verificationLevel as any as string}`,
                        inline: true
                    },
                    {
                        name: "Created At",
                        value: `${guild.createdAt as any as string}`,
                        inline: true
                    },
                    {
                        name: "Guild Invite",
                        value: `https://discord.gg/${guild.vanityURLCode ?? invites as any as string}`,
                    }
                )
            ]
        });
    }
}