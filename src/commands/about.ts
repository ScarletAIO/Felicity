import { SlashCommandBuilder, EmbedBuilder, CommandInteraction } from "discord.js";

module.exports =  {
    data: new SlashCommandBuilder()
        .setName("about-me")
        .setDMPermission(true)
        .setDescription("Replies with information about the bot."),
    async execute(interaction: CommandInteraction) {
        const embed = new EmbedBuilder()
            .setAuthor({
                "name": interaction.client.user?.tag as string,
                "iconURL": interaction.client.user?.avatarURL() as string
            })
            .setColor("Blue")
            .setTitle("About Me (click here for the invite link)")
            .setDescription("I'm a support bot for handling automated moderation and more!")
            .addFields([
                {
                    "name": "Developer",
                    "value": "Undead Kaz#0734",
                    "inline": true
                },
                {
                    "name": "Library",
                    "value": "Discord.js",
                    "inline": true
                },
                {
                    "name": "Language",
                    "value": "TypeScript",
                    "inline": true
                },
                {
                    "name": "Version",
                    "value": "1.0.0",
                    "inline": true
                },
                {
                    "name": "Other APIs",
                    "value": "[ScarletAI](https://scarletai.xyz) | [Discord](https://discord.com)",
                    "inline": true
                }
            ])
            // Set the invite URL
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1011934656662339645&permissions=8&scope=bot%20applications.commands")
            .setTimestamp();
        await interaction.reply({embeds: [embed], ephemeral: true});
    }
}