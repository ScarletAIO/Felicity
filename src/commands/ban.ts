import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Bans a user from the server.")
        .addUserOption(option => option.setName("user").setDescription("The user to ban.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the ban.")),
    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has("BanMembers")) {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            return;
        }
        let user = interaction.options.getUser("user");
        if (!user) {
            await interaction.reply({ content: "You must specify a user to ban!", ephemeral: true });
            return;
        }

        if (interaction.user === user) {
            await interaction.reply({ content: "You cannot ban yourself!", ephemeral: true });
            return;
        } else if (interaction.client?.user === user) {
            return await interaction.reply({ content: "Huh? Me? If there's an issue, could you message: `Undead Kaz#0734` about my failure?", ephemeral: true });
        }

        
        let reason = interaction.options.get("reason")?.value as string;
        if (!reason) {
            reason = "No reason provided.";
        }


        let embed = new EmbedBuilder()
            .setAuthor({
                "name": interaction.user.tag,
                "iconURL": interaction.user.avatarURL() as string
            })
            .setColor("Blue")
            .setTitle("Ban")
            .setDescription(`You have been banned from ${interaction.guild?.name} by ${interaction.user.tag} for ${reason}`)
            .setTimestamp()
            .setThumbnail(interaction.client.user?.avatarURL() as string);

        await interaction.guild?.members.ban(user, { reason: reason });
        await interaction.reply({ content: `Banned ${user.tag} for ${reason}`, ephemeral: true });
        await user.send({ embeds: [embed] });
    }
}