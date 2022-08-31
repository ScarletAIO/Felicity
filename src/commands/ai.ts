// The AI configuration Command
import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

module.exports = {
    beta: true,
    data: new SlashCommandBuilder()
        .setName("scarlet-aiconfig")
        .setDescription("Sets the AI configuration for the Scarlet API.")
        .setDMPermission(false),
    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has("Administrator")) {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            return;
        };
        await interaction.reply({
            embeds: [Embeds()],
            components: [{ 
                type: 1, 
                components: [{ 
                    type: 3, 
                    custom_id: "ai-config",
                    options: [
                        {
                            label: "Enable AI",
                            value: "enable",
                            description: "Enables the AI for the Scarlet API.",
                        },
                        {
                            label: "Disable AI",
                            value: "disable",
                            description: "Disables the AI for the Scarlet API.",
                        },
                    ]},
                ]},
            ],
        });
    }
}

function Embeds() {
    return new EmbedBuilder()
        .setTitle("AI Configuration")
        .setDescription("Select an option from the dropdown menu below.")
        .setColor("#FF0000");
}