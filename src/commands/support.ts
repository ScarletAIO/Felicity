// The support command
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDescription("Sends the support server invite link."),
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("Support Server")
            .setDescription("Join the support server for the Scarlet API!")
            .setColor("#FF0000")
            .setURL("https://discord.gg/crittersden");
        return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}