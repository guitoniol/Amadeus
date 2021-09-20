require('dotenv/config');
const { Client, Collection } = require("discord.js");
const { play } = require("./util/play");
const token = process.env.TOKEN;
const client = new Client();
const queue = new Map();

["servers", "comandos", "aliases"].forEach(x => client[x] = new Collection());
["comando", "console", "event"].forEach(x => require(`./handlers/${x}`)(client));

client.on("ready", () => {
  client.user.setActivity(`+help | não sei o que colocar aqui '-'`);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds`);

  for (let guild of client.guilds.cache) {
    const queueContruct = {
      textChannel: null,
      voiceChannel: null,
      connection: null,
      songs: [],
      volume: 5,
      playing: false,
      looping: false
    };

    queue.set(guild[0], queueContruct);
  }

  client.servers.set("queue", queue);
});

client.on("guildCreate", guild => {
  console.log(`Uma nova guild me adicionou: ${guild}`);
  client.user.setActivity(`+help | estou em ${client.guilds.cache.size} guilds`);
});

client.on("play", (guildId) => {
  play(client, guildId);
});

client.on("finish", (guildId) => {
  client.servers.get("queue").get(guildId).songs.shift();
  client.servers.get("queue").get(guildId).looping = false;
});

client.login(token);
