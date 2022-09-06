import Database from "better-sqlite3";
import { Guild } from "discord.js";
import { config } from "dotenv";
import * as fs from "fs";
import path from "path";
config();
const { DBPATH: dbPath } = process.env;
const db = new Database("db.sqlite");

db.prepare(fs.readFileSync(path.resolve(__dirname, "guilds.sql"), "utf-8")).run();
const usersSql = fs.readFileSync(path.resolve(__dirname, "users.sql"), "utf8");
db.prepare(usersSql).run();

export default new class DbHandler {
    db: Database.Database;
    constructor() {
        this.db = db;
        this.connect();
    }

    createTable(name: string, columns: string) {
        name = escape(name);
        columns = escape(columns);
        if (!columns) {
            throw new Error("No columns provided");
        }
        this.db.prepare(`CREATE TABLE IF NOT EXISTS [${name}] (${columns});`).run();
    }

    dropTable(name: string) {
        name = escape(name);
        this.db.prepare(`DROP TABLE IF EXISTS ${name};`).run();
    }

    connect() {
        return this.db;
    }

    getGuild(id: string) {
        return this.db.prepare("SELECT * FROM guilds WHERE id = ?").get(id);
    }

    getUser(id: string) {
        return this.db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    }

    getGuildUsers(id: string) {
        return this.db.prepare("SELECT * FROM users WHERE guild = ?").all(id);
    }

    createGuild(id: string, name: string, icon: string, owner: string) {
        return this.db.prepare("INSERT INTO guilds (id, name, icon, owner) VALUES (?, ?, ?, ?)").run(id, name, icon, owner);
    }

    createUser(id: string, name: string, discriminator: string, avatar: string, bot: any) {
        if (bot == true) {
            bot = 1;
        } else {
            bot = 0;
        }
        return this.db.prepare("INSERT INTO users (id, name, discriminator, avatar, bot) VALUES (?, ?, ?, ?, ?)").run(id, name, discriminator, avatar, bot);
    }

    updateGuild(id: string, key: string, value: string | boolean | number) {
        return this.db.prepare(`UPDATE guilds SET ${key} = ? WHERE id = ?`).run(value, id);
    }

    updateUser(id: string, key: string, value: string | boolean | number) {
        return this.db.prepare(`UPDATE users SET ${key} = ? WHERE id = ?`).run(value, id);
    }

    setAFK(id: string, set: any, reason: string) {
        if (set == true) {
            set = 1;
        } else {
            set = 0;
        }
        return this.db.prepare("UPDATE users SET afk = ?, afkReason = ? WHERE id = ?").run(set, reason, id);    
    }

    deleteGuild(id: string) {
        return this.db.prepare("DELETE FROM guilds WHERE id = ?").run(id);
    }

    deleteUser(id: string) {
        return this.db.prepare("DELETE FROM users WHERE id = ?").run(id);
    }

    deleteGuildUsers(id: string) {
        return this.db.prepare("DELETE FROM users WHERE guild = ?").run(id);
    }

    deleteGuildUser(guild: string, user: string) {
        return this.db.prepare("DELETE FROM users WHERE guild = ? AND id = ?").run(guild, user);
    }

    getGuilds() {
        return this.db.prepare("SELECT * FROM guilds").all();
    }

    getUsers() {
        return this.db.prepare("SELECT * FROM users").all();
    }

    getGuildsCount() {
        return this.db.prepare("SELECT COUNT(*) FROM guilds").get();
    }

    getUsersCount() {
        return this.db.prepare("SELECT COUNT(*) FROM users").get();
    }

    backup() {
        return this.db.backup(`${dbPath}-${Date.now()}` as string, {
            progress({ totalPages, remainingPages }) {
                console.log(`Backup progress: ${totalPages} / ${remainingPages}`);
                return false ? 0 : 200;
            }
        });
    }

    async updateAutomod(
        guild: Guild["id"]
    ) {
        const keys = require("../../../config.json")
        console.log(keys)
        const guildData = this.getGuild(guild);
        if (!guildData) {
            throw new Error("Guild not found");
        }
        console.log(guildData)

        // update each key individually
        for (const key of Object.keys(keys)) {
            if (guildData[key] === null) {
                if (keys[key] === false) {
                    this.updateGuild(guild, key, 0);
                } else if (keys[key] === true) {
                    this.updateGuild(guild, key, 1);
                }
            }
        }

        // check if the db has been updated
        const updatedGuildData = this.getGuild(guild);
        if (!updatedGuildData) {
            throw new Error("Guild not found");
        }
        console.log(updatedGuildData);
    }
}