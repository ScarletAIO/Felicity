import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import db from "../db/db";

module.exports = {
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
        const user = await db.getUser(interaction.user.id);
        if (!user) {
            db.createUser(
                interaction.user.id, 
                interaction.user.username, 
                interaction.user.discriminator, 
                interaction.user.avatarURL() as string, 
                interaction.user.bot
            );
            
            db.setAFK(interaction.user.id, true, reason);
            await interaction.reply({ content: `You are now AFK! Reason: ${reason}`, ephemeral: true });
        }
        if (user.afk) {
            await interaction.reply({ content: `You are already AFK! Reason: ${user.afkReason}`, ephemeral: true });
        } else {
            db.setAFK(interaction.user.id, true, reason);
            await interaction.reply({ content: `You are now AFK! Reason: ${reason}`, ephemeral: true });
        }
    }
}