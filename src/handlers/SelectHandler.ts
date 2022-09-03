import { CommandInteraction, Guild, Interaction } from "discord.js";
import database from "../db/db";

export default async function SelectHandler(i: Interaction | any) {
    const id = i.customId;
    const guildId = i?.guild?.id as Guild["id"];
    switch (id) {
        case "ai-config": 
            let permissions = i.memberPermissions?.has("ManageServer") || i.memberPermissions?.has("Administrator");
            
            // get the chosen value
            if (!permissions) {
                return await i.reply({ content: "You do not have permission to use this command.", ephemeral: true });
            }

            let value = i.values[0];
            // get the guild
            const guild = database.getGuild(guildId);
            if (!guild) {
                return i.reply({ content: "You aren't in the database!", ephemeral: true });
            }

            switch (value) {
                case "enable":
                    value = 1;
                    database.updateGuild(guildId, "toggle_ai", value);
                    return i.reply({ content: `Enabled the AI for the Scarlet API.`, ephemeral: true });
                case "disable":
                    value = 0;
                    database.updateGuild(guildId, "toggle_ai", value);
                    return i.reply({ content: `Disabled the AI for the Scarlet API.`, ephemeral: true });
            }
    }
}