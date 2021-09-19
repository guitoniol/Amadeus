require('dotenv/config');
const { Client, Collection } = require("discord.js");
const { mkdir } = require('fs');
const token = process.env.TOKEN;
const client = new Client();
const queue = new Map();
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
["servers", "comandos", "aliases"].forEach(x => client[x] = new Collection());
["comando", "console", "event"].forEach(x => require(`./handlers/${x}`)(client));     
const embed = new MessageEmbed();
embed.setColor(16711680);
embed.setDescription('Hello, this is a slick embed!');

function play(guildId) {
  let serverQueue = client.servers.get("queue").get(guildId);
  if (serverQueue.songs.length == 0) {
    serverQueue.textChannel.send("Fila concluida!");
    serverQueue.voiceChannel.leave();

    serverQueue.textChannel = null;
    serverQueue.voiceChannel = null;
    serverQueue.connection = null;
    serverQueue.playing = false;
    return;
  }

  const song = serverQueue.songs[0];
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url), {filter: 'audioonly'}).on("finish", () => {
      if(!serverQueue.looping) serverQueue.songs.shift();

      client.emit("play", guildId);
    }).on("error", err => {
      console.log(err);
      serverQueue.textChannel.send("O_o -> " + err);
      serverQueue.looping = false;
      serverQueue.songs.shift();
      client.emmit("play", guildId);
    });

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

  if(!serverQueue.looping) {
    embed.setDescription(`Tocando: [${song.title}](${song.url}) [${song.member}]`);
    serverQueue.textChannel.send(embed);
  }
}

client.on("play", (guild, serverQueue) => {
  play(guild, serverQueue);
})

client.on("ready", () => {
  client.user.setActivity(`+help | não sei o que colocar aqui '-'`);    
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds`);

  for(let guild of client.guilds.cache) {
    //{ fila: [], skipVotes: 0, jaVotou: [] }
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

client.login(token);
