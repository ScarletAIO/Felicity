import { Interaction } from "discord.js";
import db from "../db/db";
import SelectHandler from "../handlers/SelectHandler";

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction: Interaction | any) => {
        // @ts-ignore
        const command = interaction.client.commands.get(interaction.commandName);
        if (interaction.isSelectMenu()) {
            console.info("Select menu interaction detected.");
            await SelectHandler(interaction);
        }
        else if (interaction.isButton()) {
            console.info("Button interaction detected.");
            console.log(interaction.customId);
            // get the button that was pressed
            const button = interaction.customId;
            // get the guild
            const guild = interaction.guild;
            if (button === 's-config-yes') {
                // get the config file
                const config = require("../../config.json");
                // update the database
                console.log(JSON.stringify(config));
                db.updateAutomod(guild.id);
                // edit the message
                await interaction.deferUpdate().then(() => {
                    interaction.editReply({
                        content: "Ok! Confirming the options and saving them to the database...",
                        embeds: [],
                        components: [],
                    });
                });
            }
            else if (button === 's-config-no') {
                // edit the message
                await interaction.update({
                    content: "Ok! Cancelling the options and not saving them to the database...",
                    components: [],
                });
            }
            else if (button === 'delete-yes') {
                // delete the user
                db.deleteUser(interaction.user.id);
                // edit the message
                await interaction.deferUpdate().then(() => {
                    interaction.editReply({
                        content: "Ok! I've removed you from the database.",
                        components: [],
                    });
                });
            } else if (button === 'delete-no') {
                // edit the message
                await interaction.update({
                    content: "Ok! I won't remove you from the database.",
                    components: [],
                });
            }
        }
        else {
            if (!command) {
                return;
            }
            try {
                await command.execute(interaction);
            }
            catch (e:any) {
                if (e.code === 50013) {
                    return await interaction.reply({
                        content: "Oh no! Either you or me don't have permission to do that! Please make sure that the correct permissions are set!",
                        ephemeral: true
                    });
                }
                console.error(e);
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
        }
    }
};
