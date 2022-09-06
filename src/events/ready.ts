import * as console from "fancy-log";
require("dotenv").config();
import { ActivityType, Client, Collection, TextChannel } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import path from "node:path";
import fs from "node:fs";
import db from "../db/db";
import axios from "axios";
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

        (client.channels.cache.get("1015836371937665135") as TextChannel).send({
            content: "List of servers I'm in:",
            embeds: [
                {
                    title: "Servers",
                    description: client.guilds.cache.map((guild) => guild.name).join("\n- ").toString(),
                    color: 0x00ff00
                }
            ]
        })

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
                continue; // Skip beta commands
            } else {
                commands.push(cmd.data.toJSON());
            }
        }

        for (let guild of client.guilds.cache.map((guilds) => guilds)) {
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
        await rest.put(Routes.applicationCommands(clientId as string), {body:commands}).then(()=>{console.info("Commands Deployed")});
        return;
    }
}
