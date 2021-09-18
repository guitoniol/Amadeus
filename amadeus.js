require('dotenv/config');
const { Client, Collection } = require("discord.js");
const { mkdir } = require('fs');
const token = process.env.TOKEN;
const client = new Client();
const queue = new Map();

["servers", "comandos", "aliases"].forEach(x => client[x] = new Collection());
["comando", "console", "event"].forEach(x => require(`./handlers/${x}`)(client));     

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
