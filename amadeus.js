require('dotenv/config');
const { Client, Collection, Intents } = require("discord.js");
const { play } = require("./util/play");
const DiscordQueueModel = require("./models/DiscordQueueModel")
const token = process.env.TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const queue = new Map();
["servers", "comandos", "aliases"].forEach(x => client[x] = new Collection());
["comando", "console", "event"].forEach(x => require(`./handlers/${x}`)(client));

client.on("ready", () => {
  for (let guild of client.guilds.cache) queue.set(guild[0], new DiscordQueueModel());

  client.servers.set("queue", queue);
  client.user.setActivity(`+help`);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds`);
});

client.on("guildCreate", guild => {
  client.servers.get("queue").set(guild.id, new DiscordQueueModel());
});

client.on("play", (guildId) => {
  play(client, guildId);
});

client.on("finish", (guildId, error = null) => {
  const serverQueue = client.servers.get("queue").get(guildId);

  if (error) {
    serverQueue.textChannel.send("O_o -> " + error);
    serverQueue.looping = false;
  }

  if (!serverQueue.looping || serverQueue.skip) {
    serverQueue.songs.shift();
  }

  play(client, guildId);
});

client.login(token);