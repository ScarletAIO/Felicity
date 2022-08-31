import { Interaction } from "discord.js";

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) { return; }

        // @ts-ignore
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) { return; }

        try {
            await command.execute(interaction);
        } catch (e: { message: string, code: number | string, stack: string } | any) {
            if (e?.code === 50013) {
                return await interaction.reply({
                    content: "Oh no! Either you or me don't have permission to do that! Please make sure that the correct permissions are set!",
                    ephemeral: true
                })
            }
            console.error(e);
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        }
    }
}