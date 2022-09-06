import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, time } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help with the bot."),
    async execute(interaction: CommandInteraction) {
        const thumbnail = interaction.client.user?.avatarURL() as string ?? interaction.guild?.iconURL() as string;
        // @ts-ignore - It doesn't exist explicitly in the typings, but it does exist.
        const commands = interaction.client?.commands;
        const embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription("Here are all of the commands you can use with the bot.")
            .setColor("Blue")
            .setAuthor({
                "name": interaction.user?.tag as string,
                "iconURL": interaction.user?.avatarURL() as string
            })
            .setThumbnail(thumbnail)
            .setFooter({
                "text": `Ran by ${interaction.user?.tag as string}`,
                "iconURL": thumbnail
            })
            .setTimestamp();
        commands?.forEach((command: {
            data: {
                name: string;
                description: string;
            },
            beta: boolean;
        }) => {
            if (command.beta) {
                // skip it
                return;
            } else {
                embed.addFields({
                    "name": command.data.name,
                    "value": command.data.description,
                    "inline": true
                });
            }
        });

        return await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}