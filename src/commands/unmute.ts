import { CommandInteraction, Guild, RoleResolvable, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("UnMutes a member in the server.")
        .setDMPermission(false)
        .addUserOption(option => option.setName("user").setDescription("The user to mute").setRequired(true)),
    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has("MuteMembers")) {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            return;
        }
        let user = interaction.options.getUser("user");

        if (interaction.user === user) {
            await interaction.reply({ content: "You cannot mute yourself!", ephemeral: true });
            return;
        } else if (interaction.client?.user === user) {
            return await interaction.reply({ content: "Huh? Me? If there's an issue, could you message: `Undead Kaz#0734` about my failure?", ephemeral: true });
        }
        let member = interaction.guild?.members.cache.get(user?.id as string);
        member?.timeout(null)
        .then(async () => {
            await interaction.reply({ content: `UnMuted ${user?.tag}`, ephemeral: true });
        })
        .catch((e: { message: string, code: number | string, stack: string } | any) => {
            if (e?.code === 50013) {
                return interaction.reply({ content: "Oh no! Either you or me don't have permission to do that! Please make sure that the correct permissions are set!", ephemeral: true });
            }
            console.error(e);
            return interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        });
    }
}