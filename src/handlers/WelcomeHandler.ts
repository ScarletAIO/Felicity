import db from "../db/db";

export function SettingsHandler(options: any, guildId: string, WelcomeOrLeave: string) {
    const opts = [
        "message",
        "enabled",
        "dm",
        "embed"
    ];
    for (let i = 0; i < opts.length; i++) {
        let option = options.get(opts[i]);

        if (!option?.value) {
            return options.get(opts[i]).value = null;
        }

        if (typeof option.value === "boolean") {
            let value = option.value ? 1 : 0;
            
            switch(option.name) {
                case "embed":
                    return db.updateGuild(
                        guildId,
                        "message_embed",
                        value
                    );
                case "dm":
                    return db.updateGuild(
                        guildId,
                        "message_dm",
                        value
                    );
                case "enabled":
                    if (WelcomeOrLeave === "welcome") {
                        return db.updateGuild(
                            guildId,
                            "toggle_welcome",
                            value
                        );
                    } else {
                        return db.updateGuild(
                            guildId,
                            "toggle_leave",
                            value
                        );
                    }
            }
        }

        if (typeof option.value === "string" && option.name === "message") {
            let message = options.get(opts[i]).value = escape(options.get(opts[i]).value);
            if (WelcomeOrLeave === "welcome") {
                db.updateGuild(
                    guildId,
                    "welcome_message",
                    message
                );
            } else {
                db.updateGuild(
                    guildId,
                    "leave_message",
                    message
                );
            }
        }
        break;
    }

    let channel = options.get("channel").value;
    if (WelcomeOrLeave === "welcome") {
        db.updateGuild(
            guildId,
            "welcome_channel",
            channel
        );
    } else {
        db.updateGuild(
            guildId,
            "leave_channel",
            channel
        );
    }
}