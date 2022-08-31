import { SlashCommandBuilder, CommandInteraction, channelMention } from "discord.js";
import db from "../db/db";

module.exports = {
    beta: true,
    data: new SlashCommandBuilder()
        .setName("setlogs")
        .setDescription("Sets the logs channel for the Scarlet API.")
        .setDMPermission(false)
        .addChannelOption(option => option.setName("channel").setDescription("The channel to set the logs to.")),
    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has("Administrator")) {
            return await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
        };
        const channel = interaction.options.get("channel")?.value as string;
        if (!channel) {
            return await interaction.reply({ content: "You did not provide a channel.", ephemeral: true });
        };
        db.updateGuild(interaction?.guildId as string, "log_channel", channel);
        return await interaction.reply({ content: `Set the logs channel to: ${channelMention(channel)}`, ephemeral: true }); 
    }
}