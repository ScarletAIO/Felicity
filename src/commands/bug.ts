import { SlashCommandBuilder, EmbedBuilder, TextChannel, roleMention } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bug")
        .setDescription("Report a bug to the Scarlet API developers.")
        .addStringOption(option => option.setName("bug").setDescription("The bug you want to report.").setRequired(true)),
        // @ts-ignore
    async execute(interaction) {
        const bug = interaction.options.get("bug")?.value as string;
        if (!bug) {
            return await interaction.reply({ content: "You did not provide a bug.", ephemeral: true });
        };
        const embed = new EmbedBuilder()
            .setTitle("Bug Report")
            .setDescription(`**Bug:** ${bug}`)
            .setTimestamp(new Date)
            .setAuthor({
                "name": interaction.user.tag, 
                "iconURL": interaction.user.avatarURL() as string
            })
            .setColor("#FF0000");
        const channel = interaction.client.channels.get("1013425824147460116") as TextChannel;
        await channel.send({ content: `Hey ${roleMention("1013439266916946010")}! There's a bug report!`, embeds: [embed] });
        return await interaction.reply({ content: "Successfully reported the bug!", ephemeral: true });
    }
}