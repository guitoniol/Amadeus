require('dotenv/config');
const { Client, Collection, Intents } = require("discord.js");
const { play } = require("./util/play");
const token = process.env.TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

const queue = new Map();
const queueContruct = {
  textChannel: null,
  voiceChannel: null,
  connection: null,
  player: null,
  songs: [],
  volume: 5,
  playing: false,
  looping: false,
  paused: false,
  isAlone: false
};

["servers", "comandos", "aliases"].forEach(x => client[x] = new Collection());
["comando", "console", "event"].forEach(x => require(`./handlers/${x}`)(client));

client.on("ready", () => {
  for (let guild of client.guilds.cache) queue.set(guild[0], queueContruct);
  client.servers.set("queue", queue);

  client.user.setActivity(`+help | https://i.imgur.com/HjCQeIS.png`);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds`);
});

client.on("guildCreate", guild => {
  console.log(`Uma nova guild me adicionou: ${guild}`);
  client.servers.get("queue").set(guild.id, queueContruct);
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

client.on('voiceStateUpdate', (oldState, newState) => {
  if(oldState.member?.user?.bot || !client.servers.get("queue").get(newState?.guild?.id).playing) return;

  const guildId = newState?.guild?.id;
  const serverQueue = client.servers.get("queue").get(guildId);
  const voiceChannel = serverQueue.voiceChannel;
  const textChannel = serverQueue.textChannel;

  if (!voiceChannel || (voiceChannel.id != oldState.channelId && voiceChannel.id != newState.channelId)) return;

  if (voiceChannel.members.filter(member => !member.user?.bot).size > 0) {
    serverQueue.isAlone = false;
    return;
  }

  textChannel.send("ME DEIXARAO SOZINHA VOU EMBORA :(");
  serverQueue.isAlone = true;

  setTimeout(() => {
    if (!serverQueue.playing || !serverQueue.isAlone) return;

    serverQueue.songs = [];
    serverQueue.player.emit('idle');
  }, 30000);
});

client.login(token);