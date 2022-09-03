import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("server-config")
        .setDescription("Sets the server configuration for the automod.")
        .addIntegerOption(option => option.setName("max-mentions").setDescription("The maximum amount of mentions allowed in a message.").setRequired(true))
        .addBooleanOption(option => option.setName("invite-filter").setDescription("Whether or not to filter invites.").setRequired(true))
        .addBooleanOption(option => option.setName("link-filter").setDescription("Whether or not to filter links.").setRequired(true))
        .addBooleanOption(option => option.setName("mention-filter").setDescription("Whether or not to filter mentions.").setRequired(true))
        .setDMPermission(false),
    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has("ManageGuild")) {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            return;
        };
        const maxMentions = interaction.options.get("max-mentions")?.value as number;
        const inviteFilter = interaction.options.get("invite-filter")?.value as boolean;
        const linkFilter = interaction.options.get("link-filter")?.value as boolean;
        const mentionFilter = interaction.options.get("mention-filter")?.value as boolean;

        // write the values to a temp object
        const temp = {
            mass_mentions_count: maxMentions,
            toggle_invites: inviteFilter,
            toggle_links: linkFilter,
            toggle_mentions: mentionFilter
        };

        // send the temp object to a JSON file
        const fs = require("fs");
        fs.writeFile("./config.json", JSON.stringify(temp), (err: any) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("Config file has been created.");
        });

        await interaction.reply({
            embeds: [
                {
                    title: "Server Configuration",
                    description: `Max Mentions: ${maxMentions}\nInvite Filter: ${inviteFilter}\nLink Filter: ${linkFilter}\nMention Filter: ${mentionFilter}`,
                    "thumbnail": {
                        "url": "https://cdn.discordapp.com/emojis/875461307254603817.webp"
                    },
                }
            ],
            components: [{ 
                type: 1, 
                components: [
                    // Add two buttons: Yes and No
                    {
                        type: 2,
                        style: 3,
                        label: "Yes, save these settings.",
                        custom_id: "s-config-yes",
                        emoji: {
                            name: "✅",
                        }
                    },
                    {
                        type: 2,
                        style: 4,
                        label: "No, cancel.",
                        custom_id: "s-config-no",
                        emoji: {
                            name: "❌",
                        }
                    }
                ],
            }],
        });

    }
}
