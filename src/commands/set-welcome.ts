import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import db from "../db/db";
import { SettingsHandler } from "../handlers/WelcomeHandler";

module.exports = {
    beta: true,
    data: new SlashCommandBuilder()
        .setName("set-welcome")
        .setDescription("Set the welcome message for this server.")
        .addStringOption(option => option.setName("message").setDescription("The welcome message.").setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("The channel to send the welcome message in.").setRequired(true))
        .addBooleanOption(option => option.setName("enabled").setDescription("Whether or not the welcome message is enabled."))
        .addBooleanOption(option => option.setName("dm").setDescription("Whether or not the welcome message is sent in a DM."))
        .addBooleanOption(option => option.setName("embed").setDescription("Whether or not the welcome message is an embed.")),
    async execute(interaction: CommandInteraction) {
        const message = interaction.options.get("message")?.value as string;
        if (!message) {
            return await interaction.reply({ content: "You did not provide a message.", ephemeral: true });
        };

        try {
            SettingsHandler(interaction.options, interaction.guild?.id as string, "welcome");

            await interaction.reply({ content: "Welcome message set!", ephemeral: true });
        } catch (err) {
            console.error(err);
            return await interaction.reply({ content: "An error occurred, while settings the message.", ephemeral: true });
        }
    }
}