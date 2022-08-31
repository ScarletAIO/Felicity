import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a member from the server.')
        .setDMPermission(false)
        .addUserOption(option => option.setName('user').setDescription('The user to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the kick')),
    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has('KickMembers')) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }
        let user = interaction.options.getUser('user');
        if (!user) {
            await interaction.reply({ content: 'You must specify a user to kick!', ephemeral: true });
            return;
        }

        if (interaction.user === user) {
            await interaction.reply({ content: 'You cannot kick yourself!', ephemeral: true });
            return;
        } else if (interaction.client?.user === user) {
            return await interaction.reply({ content: 'Huh? Me? If there\'s an issue, could you message: `Undead Kaz#0734` about my failure?', ephemeral: true });
        }

        let reason = interaction.options.get('reason')?.value as string;
        if (!reason) {
            reason = 'No reason provided.';
        }

        await interaction.guild?.members.kick(user, reason);
        await interaction.reply({ content: `Kicked ${user.tag} for ${reason}`, ephemeral: true });
    }
}