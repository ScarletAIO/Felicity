import * as console from "fancy-log";
console.info("Done compiling!");
console.info("Loading Modules...")
import { config } from "dotenv";
config();
import { Client, GatewayIntentBits } from "discord.js";
import path from "node:path";
import fs from "node:fs";

console.info("Finished loading modules!")
console.info("Starting bot...");
const { TOKEN: token } = process.env;
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent ]
});
const events = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(events).filter((file) => file.endsWith(".js"));

for (const event of eventFiles) {
    const eventModule = require(path.join(events, event));
    
    if (eventModule.once) {
        client.once(eventModule.name, (...args) => eventModule.execute(...args));
    } else {
        client.on(eventModule.name, (...args) => eventModule.execute(...args));
    }
}

client.login(token as string);