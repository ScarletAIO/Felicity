import { CommandInteraction, EmbedBuilder, inlineCode, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setDMPermission(true)
        .setName("ping")
        .setDescription("Replies with pong!"),
    async execute(interaction: CommandInteraction) {
        let msg = await interaction.reply({ content: "Pinging...", fetchReply: true, ephemeral: true });
        let localPing:any = msg.createdTimestamp - interaction.createdTimestamp;
        let apiPing:any = interaction.client.ws.ping;
        if (localPing > 1000) {
            localPing = localPing / 1000;
            localPing = Math.round(localPing * 100) / 100;
            localPing = localPing + "s";
        } else {
            localPing = localPing + "ms";
        }

        if (apiPing > 1000) {
            apiPing = apiPing / 1000;
            apiPing = Math.round(apiPing * 100) / 100;
            apiPing = apiPing + "s";
        } else {
            apiPing = apiPing + "ms";
        }

        let embed = new EmbedBuilder()
            .setAuthor({
                "name": interaction.user.tag,
                "iconURL": interaction.user.avatarURL() as string
            })
            .setColor("Blue")
            .addFields([
                {
                    "name": "Local Ping",
                    "value": inlineCode(localPing),
                    "inline": true
                },
                {
                    "name": "API Ping",
                    "value": inlineCode(apiPing),
                    "inline": true
                }
            ])
            .setTimestamp()
            .setImage("http://i.imgur.com/XkW90cy.gif");

        await interaction.editReply({embeds: [embed]});
    }
}