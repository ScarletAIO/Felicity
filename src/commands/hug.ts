import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, userMention } from "discord.js";
import axios from "axios";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("hug")
        .setDescription("Hugs a user.")
        .addUserOption(option => option.setName("user").setDescription("The user to hug.").setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const user = interaction.options.get("user")?.value as string;
        if (!user) {
            return await interaction.reply({ content: "You did not provide a user.", ephemeral: true });
        };
        // get an image from nekos.life
        const image = (await axios.get("https://nekos.life/api/v2/img/hug")).data;
        // create an embed
        const embed = new EmbedBuilder()
            .setTitle("Hug")
            .setDescription(`${interaction.user.tag} hugged ${userMention(user)}!`)
            .setImage(image.url)
            .setColor("#FF0000");
        return await interaction.reply({ content: "Nawwww", embeds: [embed] });
    }
}