import { SlashCommandBuilder, EmbedBuilder, TextChannel, roleMention, CommandInteraction, time } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bug")
        .setDescription("Report a bug to the Scarlet API developers.")
        .addStringOption(option => option.setName("bug").setDescription("The bug you want to report.").setRequired(true)),
        // @ts-ignore
    async execute(interaction: CommandInteraction) {
        const bug = interaction.options.get("bug")?.value as string;
        if (!bug) {
            return await interaction.reply({ content: "You did not provide a bug.", ephemeral: true });
        };
        const embed = new EmbedBuilder()
            .setTitle("Bug Report")
            .setDescription(`**Bug:** ${bug}`)
            .addFields({
                name: `Reporter:`,
                value: `${interaction.user.tag} (${interaction.user.id})`,
                inline: true
            },
            {
                name: "Bug:",
                value: bug.toString() ?? "No bug provided.",
                inline: true
            },
            {
                name: "Time:",
                value: time(new Date(), 'R'),
                inline: true
            })
            .setTimestamp(new Date)
            .setAuthor({
                "name": interaction.user.tag, 
                "iconURL": interaction.user.avatarURL() as string
            })
            .setColor("#FF0000");
        const channel = interaction.client.channels.cache.get("1016628057978699776");
        if (!channel) {
            return await interaction.reply({ content: "The Scarlet API developers could not be found.", ephemeral: true });
        }
        return await (channel as TextChannel).send({ content: `Hey ${roleMention("973792807036796969")}! There's a bug report!`, embeds: [embed] }).then(() => {
            return interaction.reply({ content: "Bug report sent!", ephemeral: true });
        });
    }
}