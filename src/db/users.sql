CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    discriminator TEXT,
    avatar TEXT,
    bot BOOLEAN,
    guild TEXT,
    afk BOOLEAN NOT NULL DEFAULT FALSE,
    afkReason TEXT
);