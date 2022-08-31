// Select Menu for roles
//
// Language: typescript
// Path: src/commands/rolemenu.ts


import { SlashCommandBuilder, EmbedBuilder, CommandInteraction } from "discord.js";

module.exports =  {
    beta: true,
    data: new SlashCommandBuilder()
        .setName("rolemenu-create")
        .setDMPermission(true)
        .setDescription("Creates a role menu.")
        .addStringOption(option => option.setName("name").setDescription("The name of the role menu.").setRequired(true))
        .addStringOption(option => option.setName("description").setDescription("The description of the role menu.").setRequired(true))
        .addStringOption(option => option.setName("role").setDescription("The role to add to the role menu.").setRequired(true))
        .addStringOption(option => option.setName("emoji").setDescription("The emoji to add to the role menu.").setRequired(true)),
    async execute(interaction: CommandInteraction) {
        if (!interaction.memberPermissions?.has("ManageRoles")) {
            await interaction.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            return;
        }

        let name = interaction.options.get("name")?.value as string;
        let description = interaction.options.get("description")?.value as string;
        let role = interaction.options.get("role")?.value as string;
        let emoji = interaction.options.get("emoji")?.value as string;

        if (!name || !description || !role || !emoji) {
            await interaction.reply({ content: "You must provide all options!", ephemeral: true });
            return;
        }

        let embed = new EmbedBuilder()
            .setTitle(name)
            .setDescription(description)
            .setColor("Blue")
            .setTimestamp()
            .setThumbnail(interaction.client?.user?.avatarURL() as string);

        let message = await interaction.reply({ embeds: [embed], fetchReply: true });
        await message.react(emoji);
        await interaction.editReply({ 
            embeds: [embed], 
            components: [{ 
                type: 1, 
                components: [{ 
                    type: 3, 
                    custom_id: "rolemenu", 
                    options: [
                        { 
                            label: name, 
                            value: role, 
                            description: description, 
                            emoji: { name: emoji } 
                        },
                    ]},
                ]},
            ],
        });
    }
}
        