// module for the guildCreate event

import { Client, Guild, TextChannel } from "discord.js";

module.exports = {
    name: "guildCreate",
    once: false,
    execute: async (guild: Guild, client:Client) => {
        console.log(`Joined guild: ${guild.name} (${guild.id})`);
        const logchannel = client?.guilds?.cache?.get("973788333169856542")?.channels?.fetch("1015836371937665135") as unknown as TextChannel;
        logchannel.send({
            content: `Joined guild: ${guild.name} (${guild.id})`,
            embeds: [
                {
                    title: "Guild Info",
                    description: `Name: ${guild.name}\nID: ${guild.id}\nOwner: ${guild.fetchOwner()} (${guild.ownerId})\nMembers: ${guild.memberCount}\nChannels: ${guild.channels.cache.size}\nRoles: ${guild.roles.cache.size}`,
                    color: 0x00ff00,
                    timestamp: new Date().toString(),
                    footer: {
                        text: "Guild Create"
                    },
                    thumbnail: {
                        url: guild.iconURL() as string
                    },
                    fields: [
                        {
                            name: "Shard ID",
                            value: guild?.shardId as any as string,
                            inline: true
                        },
                        {
                            name: "Verification Level",
                            value: guild.verificationLevel as any as string,
                            inline: true
                        },
                        {
                            name: "Created At",
                            value: guild.createdAt as any as string,
                            inline: true
                        }
                    ]
                }
            ]
        });
    }
}