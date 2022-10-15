import axios from "axios";
import { Colors, CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("waifu")
        .setDescription("Get a random waifu"),
    async execute(interaction: CommandInteraction) {
        let cat = [
            "blush",
            "smile",
            "wave",
            "happy",
            "wink",
            "dance"
        ];

        let randomCat = cat[Math.floor(Math.random() * cat.length)];
        let url = axios.get(`https://api.waifu.pics/sfw/${randomCat}`, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {return res.data.url;});

        return await interaction.reply({ embeds: [
            {
                title: "Waifu",
                image: {
                    url: await url
                },
                color: RandomColor()
            }
        ] });
    }
}

function RandomColor() {
    // Choose a random color from Colors
    let colors = Object.keys(Colors);
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    // @ts-ignore
    return Colors[randomColor];
}