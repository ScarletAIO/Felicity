CREATE TABLE IF NOT EXISTS guilds (
    id TEXT NOT NULL PRIMARY KEY UNIQUE,
    name TEXT,
    icon TEXT,
    owner TEXT,
    log_channel TEXT,
    welcome_channel TEXT,
    welcome_message TEXT DEFAULT 'Welcome {user} to {guild}!',
    message_embed BOOLEAN,
    leave_channel TEXT,
    leave_message TEXT DEFAULT 'Goodbye {user}!',
    toggle_welcome BOOLEAN ,
    toggle_leave BOOLEAN ,
    toggle_log BOOLEAN ,
    mass_mentions BOOLEAN ,
    mass_mentions_count INTEGER ,
    toggle_mentions BOOLEAN ,
    toggle_links BOOLEAN ,
    toggle_invites BOOLEAN ,
    toggle_nsfw BOOLEAN ,
    tolerance TINYINT  DEFAULT -5,
    toggle_ai TINYINT DEFAULT 0,
    toggle_spam TINYINT DEFAULT 0
);