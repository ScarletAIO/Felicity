import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

module.exports = {
    beta: true,
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Sets your AFK status.')
        .setDMPermission(true)
        .addStringOption(option => option.setName('reason').setDescription('The reason for your AFK status.')),
    async execute(interaction: CommandInteraction) {
        let reason = interaction.options.get('reason')?.value as string;
        if (!reason) {
            reason = 'No reason provided.';
        }
        await interaction.reply({ content: `Set your AFK status to: ${reason}`, ephemeral: true });
    }
}