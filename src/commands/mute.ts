import { CommandInteraction, Guild, RoleResolvable, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mutes a member in the server.")
        .setDMPermission(false)
        .addUserOption(option => option.setName("user").setDescription("The user to mute").setRequired(true))
        .addIntegerOption(option => 
            option.setName("time").setDescription("The time to mute the user for")
            .addChoices(
                { name: "1 minute", value: 1 },
                { name: "5 minutes", value: 5 },
                { name: "10 minutes", value: 10 },
                { name: "30 minutes", value: 30 },
                { name: "1 hour", value: 60 },
                { name: "1 day", value: 1440 },
                { name: "1 week", value: 10080 },
            ).setRequired(true)
        )
        .addStringOption(option => option.setName("reason").setDescription("The reason for the mute")),
        // timeout the user for the specified amount of time
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

        let reason = interaction.options.get("reason")?.value as string;
        if (!reason) {
            reason = "No reason provided.";
        }
        let member = interaction.guild?.members.cache.get(user?.id as string);
        let time = interaction.options.get("time")
        let t = time?.value as number;
        member?.timeout(t * 60000, reason)
        .then(async () => {
            await interaction.reply({ content: `Muted ${user?.tag} for \`${time?.value}\` minutes.`, ephemeral: true });
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