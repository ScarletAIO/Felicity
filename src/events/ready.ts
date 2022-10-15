import * as console from "fancy-log";
require("dotenv").config();
import { ActivityType, Client, Collection, EmbedBuilder, TextChannel } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import path from "node:path";
import fs from "node:fs";
import db from "../db/db";
import axios from "axios";
import os from "node:os";
import pm2 from "pm2";

const { TOKEN: token, BOTID: clientId, DISCORDSTOKEN: discordToken } = process.env;

module.exports = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {
        console.info(`Logged in as: ${client.user?.tag} (${client.user?.id})`);

        setInterval(() => {
            let totalUsers = 0;
            client.guilds.cache.forEach((guild) => {
                totalUsers += guild.memberCount;
            });
            let statuses = [
                `over ${totalUsers} users`,
                `over ${client.guilds.cache.size} servers`,
                `over ${client.channels.cache.size} channels`,
                `over ${client.emojis.cache.size} emojis`,
                `over ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)} members`,
                `over ${client.guilds.cache.reduce((a, b) => a + b.channels.cache.size, 0)} channels`,
                `over ${client.guilds.cache.reduce((a, b) => a + b.emojis.cache.size, 0)} emojis`,
                `over ${client.guilds.cache.reduce((a, b) => a + b.roles.cache.size, 0)} roles`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.premiumSubscriptionCount ?? 0), 0)} boosts`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.premiumTier ?? 0), 0)} boost levels`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.verificationLevel ?? 0), 0)} verification levels`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.explicitContentFilter ?? 0), 0)} explicit content filters`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.mfaLevel ?? 0), 0)} mfa levels`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.defaultMessageNotifications ?? 0), 0)} default message notifications`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.afkTimeout ?? 0), 0)} afk timeouts`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.afkChannelId), "")} afk channels`,
                `over ${client.guilds.cache.reduce((a, b) => a + (b.systemChannelId), "0")} system channels`,
            ]

            client.user?.setPresence({
                activities: [
                    {
                        name: statuses[Math.floor(Math.random() * statuses.length)],
                        type: ActivityType.Watching
                    }
                ],
                status: "online"
            });
        }, 
        // 5 mins
        300000);
        db.connect(); 

        axios.post("https://discords.com/bots/api/bot/" + clientId, {
            "server_count": client.guilds.cache.size
        }, {
                headers: {
                    "Authorization": discordToken as string
                }
            }
        );


            // get the process uptime
            const uptime = process.uptime();
            // get the system uptime
            const sysUptime = os.uptime();
            console.info(`System uptime: ${sysUptime}`);
            console.default.info(`Uptime: ${uptime}ms`);
            // convert to days from ms
            const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
            // convert to hours from ms
            const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            // convert to minutes from ms
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            // convert to seconds from ms
            const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
            const totalUptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

            const sysDays = Math.floor(sysUptime / 86400);
            const sysHours = Math.floor((sysUptime % 86400) / (1000 * 60 * 60));
            const sysMinutes = Math.floor((sysUptime % (86400 / 60)) / 60);
            const totalSysUptime = `${sysDays}d ${sysHours}h ${sysMinutes}m`;

            (client.channels.cache.get("1015836371937665135") as TextChannel).send({
                content: "Reboot Successful!",
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Reboot Successful!")
                    .setDescription(`HostName: ${os.hostname()}`)
                    .addFields({
                        name: "Uptime",
                        // make the uptime human readable
                        value: `Process: **${totalUptime}**\nSystem: **${totalSysUptime}**`,
                        inline: true
                    },
                    {
                        name: "CPU status",
                        value: `CPU Usage: \`${Math.round((os.loadavg()[0] / os.cpus().length) * 100)}\`%\nCPU Cores: \`${require("os").cpus().length}\``,
                        inline: true
                    },
                    {
                        name: "Memory status",
                        value: `Memory Usage: \`${
                            Math.round(
                                (process.memoryUsage().heapUsed / 1024 / 1024) * 100
                            ) / 100
                        }\`MB\nMemory Total: \`${Math.round((os.totalmem() / 1024 / 1024) * 100) / 100}\`MB`,
                        inline: true
                    },
                    {
                        name: "List of guilds I'm in",
                        value: client.guilds.cache.map((guild) => guild.name).join(",\n"),
                        inline: false
                    },
                    {
                        name: "Number of \"Hood Network's\" servers",
                        value: "s"
                    })
                    .setTimestamp()
                ]
            });
           
        

        // @ts-ignore
        client.commands = new Collection();
        const cmds = path.resolve("dist/src/commands");
        const cmdFiles = fs.readdirSync(cmds).filter((file) => file.endsWith(".js"));

        for (const cmd of cmdFiles) {
            const cmdModule = require(path.join(cmds, cmd));
            // @ts-ignore
            (await (client.commands.set(cmdModule.data.name, cmdModule)));
        }

        const commands: any[] = [];
        
        const rest = new REST({version: "10"}).setToken(token as string);
        // @ts-ignore
        for (const cmd of client.commands.values()) {
            if (cmd.beta) {
                try {
                    await rest.put(Routes.applicationGuildCommands(clientId as string, "973788333169856542"), {body: [cmd.data.toJSON()]})
                    .then(() => {
                        console.info(`Registered ${cmd.data.name} in the beta guild`);
                    });
                }
                catch (e) {
                    console.error(e);
                }
            } else {
                commands.push(cmd.data.toJSON());
                // @ts-ignore
                client.commands.set(cmd.data.name, cmd);
                // @ts-ignore
                console.info(client.commands.map((cmd) => cmd));
            }
        }

        /**
         * for (let guild of client.guilds.cache.map((guilds) => guilds)) {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(clientId as string, guild.id),
                    { body: [] }
                ).then(() => {
                    console.info(`Successfully deleted application commands for ${guild.name}.`);
                }).catch(console.error);
            } catch (e) {
                console.error(e);
            }
        }
        */

        await rest.put(Routes.applicationCommands(clientId as string), {body:commands}).then(()=>{console.info("Commands Deployed")});
        return;
    }
}
