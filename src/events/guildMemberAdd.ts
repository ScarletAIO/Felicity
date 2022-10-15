import db from "../db/db";
import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";

module.exports = {
    name: "guildMemberAdd",
    once: false,
    execute: async (member: GuildMember) => {
        // get the guild
        const guild = member.guild;
        // get the welcome message
        const welcome = await db.getGuild(guild.id);
        if (!welcome) {return;};
        // check if the welcome message is enabled
        if (welcome.toggle_welcome == true) {
            // get the channel
            const channel = guild.channels.cache.get(welcome.welcome_channel);
            // check if the channel exists
            if (channel) {
                const WelcomeEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("Welcome")
                    .setDescription(`Welcome to the server, ${member}.`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setImage(member.guild.iconURL())
                    .addFields({name: "Member Count", value: `${member.guild.memberCount}`})
                    .setFooter({
                        "iconURL": member.guild.iconURL() as string,
                        "text": `${member.guild.name} (${member.guild.id})`
                    });
                // send the message
                (member.client.channels.cache.get(channel as any) as TextChannel).send({ embeds: [WelcomeEmbed] });
                await (channel as TextChannel).send({ embeds: [WelcomeEmbed] });
            } else {
                console.info(`The welcome channel for guild ${guild.name} (${guild.id}) does not exist.`);
            }
        }
    }
};