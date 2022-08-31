import { Guild, Interaction } from "discord.js";
import database from "./db/db";

export default async function SelectHandler(id: string, guildId: Guild["id"], i: Interaction) {
    switch (id) {
        case "ai-config": 
            if (!i.isSelectMenu()) { return; }
            // get the chosen value
            const value = i.values[0];
            // get the guild
            const guild = database.getGuild(guildId);
            // update the guild
            database.updateGuild(guildId, "toggle_ai", value);

            // reply to the interaction
            await i.reply({ content: `Set AI to ${value}`, ephemeral: true, components: [] });

        break;
        
        default: return;
    }
}