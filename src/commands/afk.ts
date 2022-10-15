import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import db from "../db/db";
// @ts-ignore
import blacklist from "../../../blacklist.json";
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
        const bl: {
            users: [string]
        } = JSON.parse(JSON.stringify(blacklist));
        if (!user && !bl.users.includes(interaction.user.id)) {
            db.createUser(
                interaction.user.id, 
                interaction.user.username, 
                interaction.user.discriminator, 
                interaction.user.avatarURL() as string, 
                interaction.user.bot
            );
            
            db.setAFK(interaction.user.id, true, reason);
            await interaction.reply({ content: `You are now AFK! Reason: ${reason}`, ephemeral: true });
        } else if (bl.users.includes(interaction.user.id)) {
            await interaction.reply({ content: `It seems that you have blacklisted yourself from my database!\nPlease use </authorize:1019585594579505204> to re-enable this command`, ephemeral: true });
        }
        else if (user.afk) {
            await interaction.reply({ content: `You are already AFK! Reason: ${user.afkReason}`, ephemeral: true });
        } else {
            db.setAFK(interaction.user.id, true, reason);
            await interaction.reply({ content: `You are now AFK! Reason: ${reason}`, ephemeral: true });
        };
    }
}