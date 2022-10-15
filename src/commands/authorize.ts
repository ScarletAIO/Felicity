import db from "../db/db";
// @ts-ignore
import blacklist from "../../../blacklist.json";
import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import fs from "node:fs";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('authorize')
        .setDescription('Authorizes you to use the bot.')
        .setDMPermission(true),
    async execute(interaction: CommandInteraction) {
        const bl: {
            users: [string]
        } = JSON.parse(JSON.stringify(blacklist));
        if (bl.users.includes(interaction.user.id)) {
            db.createUser(
                interaction.user.id, 
                interaction.user.username, 
                interaction.user.discriminator, 
                interaction.user.avatarURL() as string, 
                interaction.user.bot
            );
            const oldBlacklist = fs.readFileSync("blacklist.json", "utf8");
            const newBlacklist = JSON.parse(oldBlacklist);
            // get the index of the user
            const index = newBlacklist.users.indexOf(interaction.user.id);
            // remove the user from the blacklist
            newBlacklist.users.splice(index, 1);
            // write the new blacklist to the file
            fs.writeFileSync("blacklist.json", JSON.stringify(newBlacklist));
            return await interaction.reply({ content: `You have been authorized!`, ephemeral: true });
        } else {
            return await interaction.reply({ content: `It seems that you're already authorized! \nNo need to use this :D`, ephemeral: true });
        };
    }
};