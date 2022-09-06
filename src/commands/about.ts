import { SlashCommandBuilder, EmbedBuilder, CommandInteraction } from "discord.js";
import os from "node:os";

module.exports =  {
    data: new SlashCommandBuilder()
        .setName("about-me")
        .setDMPermission(true)
        .setDescription("Replies with information about the bot."),
    async execute(interaction: CommandInteraction) {
        let totalUsers = 0;
        interaction.client.guilds.cache.forEach((guild) => {
            return totalUsers += guild.memberCount;
        });
        const embed = new EmbedBuilder()
            .setAuthor({
                "name": interaction.client.user?.tag as string,
                "iconURL": interaction.client.user?.avatarURL() as string
            })
            .setColor("Blue")
            .setTitle("About Me")
            .setDescription("I'm a [support](https://discord.gg/crittersden) bot for handling automated moderation and more!")
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
                    //? We go an extra layer out to get the version from the package.json file.
                    //? This is because I screwed up the tsconfig.json file and it doesn't work properly.
                    "value": `${require("../../../package.json").version}`,
                    "inline": true
                },
                {
                    "name": "Other APIs",
                    "value": "[ScarletAI](https://scarletai.xyz) | [Discord](https://discord.com)",
                    "inline": true
                },
                {
                    "name": "Hardware Usage",
                    "value": `CPU: \`${getHardwareUsage().cpu}\`%\nMemory: \`${getHardwareUsage().memory}\`%`,
                    "inline": true
                },
                {
                    "name": "Invite Link",
                    "value": "[Click here](https://discord.com/api/oauth2/authorize?client_id=1016628057978699776&permissions=8&scope=bot%20applications.commands)",
                    "inline": true
                },
                {
                    name: "Server Count",
                    value: `\`${
                        await interaction.client.guilds.fetch()
                        .then((guilds) => {return guilds.size})
                    }\` servers`,
                    inline: true
                },
                {
                    name: "User Count",
                    value: `\`${
                        totalUsers
                    }\` users`,
                    inline: true
                }
            ])
            .setTimestamp()
            .setFooter({
                "text": "Click the word \"support\" to join the support server.",
                "iconURL": await interaction.client.guilds.fetch("973788333169856542").then((g) => { return g?.iconURL()}) as unknown as string
            });
        await interaction.reply({embeds: [embed], ephemeral: true});
    }
}

function getHardwareUsage() {
    const cpu = Math.round((os.loadavg()[0] / os.cpus().length) * 100);
    const memory = os.totalmem() - os.freemem();
    const memoryPercentage = Math.round(memory / os.totalmem() * 100);
    return {
        "cpu": cpu,
        "memory": memoryPercentage
    };
}