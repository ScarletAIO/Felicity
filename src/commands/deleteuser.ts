import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import db from "../db/db";
import fs from "fs";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleteuser')
        .setDescription('Removes you from the database.')
        .setDMPermission(true),
    async execute(interaction: CommandInteraction) {
        const buttons = {
            type: 1,
            components: [
                {
                    type: 2,
                    style: 3,
                    label: "Yes",
                    custom_id: "delete-yes"
                },
                {
                    type: 2,
                    style: 4,
                    label: "No",
                    custom_id: "delete-no"
                }
            ]
        };
        
        await interaction.reply({ content: 'Are you sure you want to delete your user from the database? This action cannot be undone.\n\nNote: This may cause issues with some commands!',
        components: [buttons],
        ephemeral: true });
        
    }
}