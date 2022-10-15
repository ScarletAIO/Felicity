import * as console from "fancy-log";
console.info("Loading Modules...")
import { config } from "dotenv";
config();
import { Client, EmbedBuilder, GatewayIntentBits, Partials, PartialTextBasedChannel, TextChannel } from "discord.js";
import path from "node:path";
import fs from "node:fs";

console.info("Finished loading modules!")
console.info("Starting bot...");
const { TOKEN: token } = process.env;
const client = new Client({
    intents: [ 
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.MessageContent,
    ],
    "partials": [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User
    ],
});
const events = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(events).filter((file) => file.endsWith(".js"));

for (const event of eventFiles) {
    const eventModule = require(path.join(events, event));
    
    if (eventModule.once) {
        client.once(eventModule.name, (...args) => eventModule.execute(...args));
    } else {
        client.on(eventModule.name, (...args) => eventModule.execute(...args, client));
    }
}

client.login(token as string);

process.on("uncaughtException", (err) => {
    console.error(err);

    client.channels.fetch("1016628057978699776").then((c) => {
        const channel = c as TextChannel;
        channel.send({
            content: "An error has occured!",
            embeds: [
                new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`${err.name}`)
                .setColor(0xff0000)
                .addFields({
                    name: "Error Message",
                    value: `${err.message}`
                },
                {
                    name: "Stack Trace",
                    value: `\`\`\`${err.stack}\`\`\``
                })
                .setTimestamp()
            ]
        });
    })
})