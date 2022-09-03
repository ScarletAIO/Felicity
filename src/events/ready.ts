import * as console from "fancy-log";
require("dotenv").config();
import { ActivityType, Client, Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import path from "node:path";
import fs from "node:fs";
import db from "../db/db";
const { TOKEN: token, BOTID: clientId } = process.env;

module.exports = {
    name: "ready",
    once: true,
    execute: async (client: Client) => {
        console.info(`Logged in as: ${client.user?.tag} (${client.user?.id})`);

        client.user?.setActivity("with Discord.js", { type: ActivityType.Playing });
        db.connect();

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
                    { body: commands }
                ).then(() => {
                    console.info(`Successfully registered application commands for ${guild.name}.`);
                }).catch(console.error);
            } catch (e) {
                console.error(e);
            }
        }
        
        return;
    }
}