import { Channel } from "diagnostics_channel";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purge")
        .setDescription("Purges a specified amount of messages.")
        .setDMPermission(false)
        .addIntegerOption(option => option.setName("amount").setDescription("The amount of messages to purge").setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("The channel to purge messages from")),
    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has("ManageMessages")) {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            return;
        }

        let amount = interaction.options.get("amount")?.value as number;
        let channel = interaction.options.get("channel")?.value as any || interaction.channel;
        if (!amount) {
            await interaction.reply({ content: "You must specify an amount of messages to purge!", ephemeral: true });
            return;
        } else if (amount > 99) {
            await interaction.reply({ content: "You can only purge a maximum of 100 messages!", ephemeral: true });
            return;
        } else if (amount < 1) {
            await interaction.reply({ content: "You must purge at least 1 message!", ephemeral: true });
            return;
        }

        await channel.bulkDelete(amount + 1);
        await interaction.reply({ content: `Purged ${amount} messages from ${channel.name}`, ephemeral: true });
    }
}