require('dotenv/config');
const { Client, Collection, Intents } = require("discord.js");
const { play } = require("./util/play");
const { resolvePlaylistUrl } = require("./comandos/play");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const DiscordQueueModel = require("./models/DiscordQueueModel")
const token = process.env.TOKEN;

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

client.on("finish", async (guildId, error = null) => {
  const serverQueue = client.servers.get("queue").get(guildId);

  if (error) {
    serverQueue.textChannel.send("O_o -> " + error);

    serverQueue.looping = false;
    serverQueue.songs = [];
    serverQueue.lastPlaylist = null;
    serverQueue.pageToken = null;
  }

  if (!serverQueue.looping || serverQueue.skip) {
    serverQueue.songs.shift();
  }
  if(serverQueue.songs.length == 0 && serverQueue.pageToken) {
    await resolvePlaylistUrl({ list: serverQueue.lastPlaylist }, serverQueue.lastMember, serverQueue);
  }  

  play(client, guildId);
});

client.login(token);