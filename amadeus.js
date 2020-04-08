const {Client, Collection} = require("discord.js");
const {mkdir} = require('fs');
const {token} = require('./auth.json');
//const token = process.env.TOKEN
const client = new Client();

["servers", "comandos", "aliases"].forEach(x => client[x] = new Collection());
["comando", "console", "event"].forEach(x => require(`./handlers/${x}`)(client));     

client.on("ready", () => {    
    client.user.setActivity(`+help | não sei o que colocar aqui '-'`);    
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds`);
    
    client.guilds.forEach(g => {
      client.servers.set(g.id, new Collection());  
      client.servers.get(g.id).set("fila", []);
      client.servers.get(g.id).set("tocando", false);
      client.servers.get(g.id).set("djID", "");
      client.servers.get(g.id).set("skipVotes", 0);
      client.servers.get(g.id).set("jaVotou", []);
    })
  });

client.on("guildCreate", guild => {
  console.log(`Uma nova guild me adicionou: ${guild}`);
  client.user.setActivity(`+help | estou em ${client.guilds.size} guilds`);
  mkdir(`/data/${guild.id}`, { recursive: true }).catch(console.error);
});

setInterval(function(){
  client.user.setActivity(`+help | não sei o que colocar aqui '-'`);      
}, 3000); 

client.login(token);