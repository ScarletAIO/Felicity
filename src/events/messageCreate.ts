// Handle the messageCreate event

import axios from "axios";
import {  ChannelType, EmbedBuilder, escapeMarkdown, Message, TextChannel } from "discord.js";
import database from "../db/db";
import MassHandler from "../handlers/MassItemChecks";
import blacklist from "../../blacklist.json";


async function sendToScarletAI(message: string) {
    const out = await axios.post("https://api.scarletai.xyz/v3/analyze/msg", {
        text: message,
    });

    return out;
}

module.exports = {
    name: "messageCreate",
    once: false,
    execute: async (message: Message) => {
        if (message.author.bot) { return; }

        const chatServers = [
            "1025374379024056320",
            "1021277081214124074",
            "1029337449257783306",
        ]

        if (chatServers.includes(message.channel.id)) { 
        const a = async (message: Message) => {

            const bannedNSFWWords = [
                "vagina",
                "pussy",
                "porn",
            ]

            for (let i = 0; i < bannedNSFWWords.length; i++) {
                if (/(?:send(?: |$))*(?:bannedNSFWWords[i])?$/i.test(message.content)) {
                    message.content.replace(bannedNSFWWords[i], '*'.repeat(bannedNSFWWords[i].length))
                } else {
                    continue;
                }
            }
            
            let dialog:any[] = [];
            let memory: Map<string, string[]> = new Map();

            const userCheck = (message: Message) => {
                if (memory.get(message.author.id)) {
                    return memory.get(message.author.id)?.map((x) => x.toLowerCase());
                } else {
                    return false;
                }
            }

            if (!userCheck(message)) {
                dialog.push("Felicity is a friendly and bright bot that can answer any question that people ask of her and does not swear.\nFelicity will also assist users with computer support, discord support, mental health support, and can engage in conversations with the user.\n\n");
                dialog.push(`User: ${message.content}`);
                dialog.push("Bot:");
                memory.set(message.author.id, dialog);
                console.log(memory);
            } else {
                dialog = userCheck(message) as any[];
            }

            const instance = axios.create({
                baseURL: "https://api.openai.com/v1/completions",
                headers: {
                    "Authorization": `Bearer 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`,
                }
            });

            const completionParams = {
                model:"text-davinci-002",
                prompt:dialog.join("\n"),
                temperature:0.5,
                max_tokens:1024,
                top_p:1.0,
                frequency_penalty:0.5,
                presence_penalty:0.0,
                stop: ["User:", "Bot:"]
            };

            try { 
                const result = await instance.post('',completionParams);
                //console.log(result);
                let response:string = result.data.choices[0].text.trim();

                if (/(?:the(?: |$))*(?:chatbot)?$/i.test(response)) {
                    response = response.replace(/chatbot/i, "Felicity");
                }
                
                message.channel.sendTyping().then(() => {
                    message.reply({
                        content: escapeMarkdown(response),
                        allowedMentions: {
                            repliedUser: false,
                            "parse": [
                                "users",
                            ]
                        }
                    });
                });
                dialog.push("Bot:" + response);
                // update the memory
                try {
                    memory.set(message.author.id, dialog);
                } catch (err) {
                    console.log("can't use .set() to update memory");
                }
            } catch (e) {
                console.log(e);
                message.channel.sendTyping();
                message.reply({ content: "I'm sorry, I'm having trouble understanding you.",
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            }
        }
        a(message);
        }

        if (message.channel.type === ChannelType.DM) {
            const a = async (message: Message) => {
                
                let dialog:any[] = [];
                let memory: Map<string, string[]> = new Map();

                const userCheck = (message: Message) => {
                    if (memory.get(message.author.id)) {
                        return memory.get(message.author.id)?.map((x) => x.toLowerCase());
                    } else {
                        return false;
                    }
                }

                if (!userCheck(message)) {
                    dialog.push("Bot: Hello!");
                    dialog.push(`User: ${message.content}`);
                    dialog.push("Bot: ");
                    memory.set(message.author.id, dialog);
                } else {
                    dialog = userCheck(message) as any[];
                }

                const instance = axios.create({
                    baseURL: "https://api.openai.com/v1/completions",
                    headers: {
                        "Authorization": `Bearer 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`,
                    }
                });

                const completionParams = {
                    model:"text-davinci-002",
                    prompt:dialog.join("\n"),
                    temperature:0.5,
                    max_tokens:60,
                    top_p:1.0,
                    frequency_penalty:0.5,
                    presence_penalty:0.0,
                    stop: ["User:"]
                };

                try { 
                    const result = await instance.post("", completionParams);
                    //console.log(result);
                    let response:string = result.data.choices[0].text.trim();

                    if (/(?:the(?: |$))*(?:chatbot)?$/i.test(response)) {
                        response = response.replace(/chatbot/i, "Felicity");
                    }
                    
                    console.log(result.data.choices);
                    message.reply({
                        content: response,
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                    dialog.push("Bot: " + response);
                } catch (e) {
                    console.log(e);
                    message.reply({ content: "I'm sorry, I'm having trouble understanding you.",
                        allowedMentions: {
                            repliedUser: false
                        }
                    });
                }
            }
            a(message);
        }



        // Handle the Mass Item Checks
        await MassHandler(message);
        
        // Get the guild from the DB
        const guild = await database.getGuild(message.guildId as string);
        const user = await database.getUser(message.author.id as string);
        const bl: {
            users: [string]
        } = JSON.parse(JSON.stringify(blacklist));
        if (!user && !bl.users.includes(message.author.id)) {
            database.createUser(
                message.author.id, 
                message.author.username, 
                message.author.discriminator, 
                message.author.avatarURL() as string, 
                message.author.bot
            );
            console.log(`Created user ${message.author.tag} in the database.`);
        }
        if (bl.users.includes(message.author.id)) {
            console.log("Blacklisted user sent a message.");
            return;
        }
        if (user && user.afk == 1) {
            database.setAFK(message.author.id, false, '');
            message.reply({content:`Welcome back! I removed your AFK status.`,
            "allowedMentions": {
                "repliedUser": false
            }
        });
        } else {
            return;
        }
        if (guild === undefined) { 
            database.createGuild(
                message.guildId as string, 
                message.guild?.name as string, 
                message.guild?.iconURL() as string,
                message.guild?.ownerId as string
            )
        }
        try {
            const threshold = guild.tolerance as number;

            const response = (await axios.post("https://api.scarletai.xyz/v3/analyze/msg", {
                text: message.content,
            }))?.data.analyze.score;

            if (message.mentions.members?.size) {
                // get the user mentioned
                const mentioned = message.mentions.members.first();
                // get the user from the DB
                const mentionedUser = await database.getUser(mentioned?.id as string);
                console.log(mentionedUser);
                // check if the user is AFK
                if (mentionedUser.afk === 1) {
                    // if they are, send the embed
                    const embed = new EmbedBuilder()
                        .setTitle(`${mentioned?.user.username} is AFK!`)
                        .setDescription(mentionedUser.afkReason as string)
                        .setColor("Red")
                        .setTimestamp()
                        .setFooter({
                            text: `Scarlet AI | ${message.author.username}`, 
                            iconURL: message.author.avatarURL() as string
                        });
                    message.reply({ embeds: [embed] });
                    message.delete();
                }
            }

            if ((response <= threshold) && guild.toggle_ai == true) {
                message.delete();
                message.author.send({
                    content: `Hey ${message.author}, your message* was deleted because it was too toxic!\n\n*\`\`\`\n${message.content}\`\`\``
                }).catch(() => {
                    return; // ignore if we can't DM the user
                }).finally(() => {
                    // Send a message to the modlog channel
                    const channel = message.guild?.channels.cache.get(guild.log_channel as string);
                    if (channel) {
                        channel.fetch().then((c) => {
                            // Create an embed and send it to the channel
                            const embed = new EmbedBuilder()
                                .setTitle("Message Deleted")
                                .setDescription(`A message was deleted in ${message.channel} by ${message.author}`)
                                .addFields([
                                    {
                                        name: "Message",
                                        value: `\`\`\`\n${message.content}\`\`\``,
                                        inline: false
                                    },
                                    {
                                        name: "Reason",
                                        value: "Toxicity",
                                        inline: false
                                    }
                                ])
                                .setColor("Red")
                                .setTimestamp();
                            // @ts-ignore
                            c.send({ embeds: [embed] });
                        }).catch(console.error);
                    }
                })
            }
        } catch (err) {
            console.error(err);
        }
    }
};