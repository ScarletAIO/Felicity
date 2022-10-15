import db from "../db/db";
import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";

module.exports = {
    name: "guildMemberRemove",
    once: false,
    execute: async (member: GuildMember) => {
        // get the guild
        const guild = member.guild;
        // get the welcome message
        const welcome = await db.getGuild(guild.id);
        if (!welcome) {return;};
        // check if the welcome message is enabled
        if (welcome.toggle_leave == true) {
            // get the channel
            const channel = guild.channels.cache.get(welcome.leave_channel) as TextChannel;
            // check if the channel exists
            if (channel) {
                const message = welcome.leave_message.replace("{user}", member.user.tag);
                // check if the message is an embed
                if (welcome.message_embed == true) {
                    // create the embed
                    const embed = new EmbedBuilder()
                        .setTitle("Goodbye")
                        .setDescription(message as string)
                        .setColor((member.guild.client?.user?.accentColor as number));
                    // send the message
                    await channel.send({ embeds: [embed] });
                } else {
                    // send the message
                    await channel.send(message);
                }
            }
        }
    }
};