import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import database from "../db/db";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("current-settings")
        .setDescription("Shows the current server configuration for the automod.")
        .setDMPermission(false),
    async execute(interaction: CommandInteraction) {
        const guildid = interaction.guildId as string;
        const guild = await database.getGuild(guildid);
        console.log(guild);
        await interaction.reply({
            embeds: [
                {
                    title: "Server Configuration",
                    fields: [
                        {
                            name: "Anti-Invite",
                            value: guild.toggle_invites ? "Enabled" : "Disabled",
                            inline: true
                        
                        },
                        {
                            name: "Anti-Link",
                            value: guild.toggle_links ? "Enabled" : "Disabled",
                            inline: true
                        },
                        {
                            name: "Anti-Mention",
                            value: guild.toggle_mentions ? "Enabled" : "Disabled",
                            inline: true
                        },
                        {
                            name: "Max Mentions",
                            value: guild.mass_mentions_count ? guild.mass_mentions_count : "Disabled",
                            inline: true
                        },
                        {
                            name: "AI Enabled",
                            value: guild.toggle_ai ? "Enabled" : "Disabled",
                            inline: true
                        },
                    ],
                    "thumbnail": {
                        "url": "https://cdn.discordapp.com/emojis/875461307254603817.webp"
                    },
                }
            ],
            ephemeral: true
        });
    }
}