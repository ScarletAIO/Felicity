import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fs from "node:fs";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Get information about a user.")
        .addUserOption(option => option.setName("user").setDescription("The user to get information about.").setRequired(true)),
    async execute(interaction: CommandInteraction) {
        let user = interaction.options.getUser("user");
        if (!user) {
            user = interaction.user;
        }
        const embed = new EmbedBuilder()
            .setTitle("<:success:999546710764294224> User Info")
            .setAuthor({
                "name": user.tag,
                "iconURL": user.avatarURL() as string
            })
            .setColor("Blue")
            .setDescription(`<:info:999546705517232238> Information about ${user.tag}`)
            .addFields({
                "name": "<:id_tag:1019554098929991680> ID",
                "value": user.id.toString(),
                "inline": true
            },
            {
                "name": "<:bot:1019551361878212618> Bot?",
                "value": `${user.bot}`,
                "inline": true
            },
            {
                "name": ":pencil: Created At",
                "value": user.createdAt.toString(),
                "inline": false
            },
            {
                "name": "<:link:1019554548609732638> Avatar URL",
                "value": user.avatarURL() as string,
                "inline": true
            })
            .setTimestamp()
            .setThumbnail(user.avatarURL() as string);

        // write the getUser to a config file
        fs.writeFileSync("config/user.json", JSON.stringify(user), {
            "flag": "w+"
        });
        await interaction.reply({ embeds: [embed],
            components: [{
                type: 1,
                components: [
                    {
                        type: 2,
                        style: 3,
                        label: "Extra Info",
                        custom_id: "user-info-extra",
                        emoji: {
                            name: "info",
                            id: "999546705517232238"
                        }
                    },
                    {
                        type: 2,
                        style: 3,
                        label: "Guild Info",
                        custom_id: "user-info-guild",
                        emoji: {
                            name: "info",
                            id: "999546705517232238"
                        }
                    }
                ]
            }]
        });
    }
}