CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    discriminator TEXT,
    avatar TEXT,
    bot BOOLEAN NOT NULL,
    guild TEXT NOT NULL,
    FOREIGN KEY (guild) REFERENCES guilds(id) ON DELETE CASCADE
);