import { codeBlock, EmbedBuilder, Interaction } from "discord.js";
import db from "../db/db";
import SelectHandler from "../handlers/SelectHandler";
import fs from "node:fs";

module.exports = {
    name: "interactionCreate",
    once: false,
    execute: async (interaction: Interaction, client?: any) => {
        // @ts-ignore
        const command = client.commands.get(interaction.commandName);
        if (interaction.isSelectMenu()) {
            console.info("Select menu interaction detected.");
            await SelectHandler(interaction);
        }
        else if (interaction.isButton()) {
            console.info("Button interaction detected.");
            // get the button that was pressed
            const button = interaction.customId;
            // get the guild
            const guild = interaction.guild;
            switch(button) {
                case "user-info-guild":
                    // get the user
                    let user:any = fs.readFileSync("config/user.json", "utf8");
                    // convert user to JSON
                    user = JSON.parse(user);
                    // get the user's guild member
                    const member = guild?.members.cache.get(user.id);
                    // get the user's roles
                    const roles = member?.roles.cache.map((role:any) => role.name) as any[];
                    // get the user's permissions
                    const permissions = member?.permissions.toArray();
                    // get the user's nickname
                    const nickname = member?.nickname as string;
                    // get the user's joined at date
                    const joinedAt = member?.joinedAt ?? "Unknown";
                    // get the user's premium since date
                    const premiumSince = member?.premiumSince ?? "Hasn't boosted yet.";

                    // create the embed
                    const embed = new EmbedBuilder()
                        .setTitle("<:success:999546710764294224> User Info")
                        .setAuthor({
                            "name": user.tag,
                            "iconURL": user.avatarURL as string
                        })
                        .setColor("Blue")
                        .setDescription(`<:info:999546705517232238> Guild information about ${user.tag}`)
                        .addFields({
                            "name": "<:roles:1019556293180149801> Roles",
                            "value": codeBlock(roles.join(", ")?.toString() as string) ?? "No roles",
                            "inline": true
                        },
                        {
                            "name": "<:perms:1019556011893338112> Permissions",
                            "value": codeBlock(permissions?.join(", ")?.toString() as string) ?? "Failed to get permissions.",
                            "inline": true
                        },
                        {
                            "name": ":pencil: Nickname",
                            "value": nickname ?? "No nickname set.",
                            "inline": false
                        },
                        {
                            "name": "<:link:1019554548609732638> Joined At",
                            "value": joinedAt.toString(),
                            "inline": true
                        },
                        {
                            "name": "<:link:1019554548609732638> Premium Since",
                            "value": premiumSince.toString(),
                        });
                    // reply with the embed
                    await interaction.deferUpdate().then(async () => {
                        await interaction.editReply({ embeds: [embed],
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
                                        },
                                        disabled: true
                                    }
                                ]
                            }]
                        });
                    });
                    break;
                
                case "user-info-extra":
                    // get the user
                    let user2:any = fs.readFileSync("config/user.json", "utf8");
                    // convert user to JSON
                    user2 = JSON.parse(user2);
                    // get the user's created at date
                    const createdAt = user2.createdAt ?? "Unknown";
                    // get the user's id
                    const id = user2.id;
                    // get the user's avatar url
                    const avatarURL = user2.avatarURL;
                    // get the user's bot status
                    const bot = user2.bot;
                    // get the user's activity
                    let activities:any[] = [];
                    let guild2 = interaction.guild?.members.cache.get(user2.id);
                    guild2?.presence?.activities?.forEach((activity) => {
                        if (activity) {
                            return activities.push(activity);
                        } else {
                            return activities.push({ name: "${user2.tag} isn't doing anything....*sad noises*" });
                        }
                    })
                    
                    if (activities.length === 0) {
                        activities.push({ name: `${user2.tag} isn't doing anything....*sad noises*` });
                    }
                    // create the embed
                    const embed2 = new EmbedBuilder()
                        .setTitle("<:success:999546710764294224> User Info")
                        .setAuthor({
                            "name": user2.tag,
                            "iconURL": user2.avatarURL as string
                        })
                        .setColor("Blue")
                        .setDescription(`<:info:999546705517232238> Extra information about ${user2.tag}`)
                        .addFields({
                            "name": "<:link:1019554548609732638> Created At",
                            "value": createdAt,
                            "inline": true
                        },
                        {
                            "name": "<:id:1019554548609732638> ID",
                            "value": id,
                            "inline": true
                        },
                        {
                            "name": "<:avatar:1019554548609732638> Avatar URL",
                            "value": avatarURL,
                            "inline": false
                        },
                        {
                            "name": "<:bot:1019554548609732638> Bot",
                            "value": bot.toString(),
                            "inline": true
                        },
                        {
                            "name": "<:activity:1019554548609732638> Activity",
                            "value": activities[0].name,
                            "inline": true
                        });
                    // reply with the embed
                    await interaction.deferUpdate().then(async () => {
                        await interaction.editReply({ embeds: [embed2],
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
                                        },
                                        disabled: true
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
                    });
                    break;

            }
            if (button === 's-config-yes') {
                // update the database
                db.updateAutomod(guild?.id as string);
                // edit the message
                await interaction.deferUpdate().then(() => {
                    interaction.editReply({
                        content: "Ok! Confirming the options and saving them to the database...",
                        embeds: [],
                        components: [],
                    });
                });
            }
            else if (button === 's-config-no') {
                // edit the message
                await interaction.update({
                    content: "Ok! Cancelling the options and not saving them to the database...",
                    components: [],
                    embeds: []
                });
            }
            else if (button === 'delete-yes') {
                // delete the user
                db.deleteUser(interaction.user.id);
                // append the ID to the blacklist file
                const oldBlacklist = fs.readFileSync("blacklist.json", "utf8");
                console.log(oldBlacklist);
                const newBlacklist = JSON.parse(oldBlacklist);
                newBlacklist.users.push(interaction.user.id);
                fs.writeFileSync("blacklist.json", JSON.stringify(newBlacklist));
                // edit the message
                await interaction.deferUpdate().then(() => {
                    interaction.editReply({
                        content: "Ok! I've removed you from the database.",
                        components: [],
                    });
                });
            } else if (button === 'delete-no') {
                // edit the message
                await interaction.update({
                    content: "Ok! I won't remove you from the database.",
                    components: [],
                });
            }
        }
        else {
            if (!command) {
                return;
            }
            try {
                await command.execute(interaction);
            }
            catch (e:any) {
                if (e.code === 50013) {
                    // @ts-ignore
                    return await interaction.reply({
                        content: "Oh no! Either you or me don't have permission to do that! Please make sure that the correct permissions are set!",
                        ephemeral: true
                    });
                }
                console.error(e);
                // @ts-ignore
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
        }
    }
};
