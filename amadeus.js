const {Client, Collection} = require("discord.js");
const {mkdir} = require('fs');
const {token} = process.evn.TOKEN
const client = new Client();

["filas", "tocando", "comandos", "aliases"].forEach(x => client[x] = new Collection());
["comando", "console", "event"].forEach(x => require(`./handlers/${x}`)(client));     
client["tocando"].set("tocando", "false");

client.on("ready", () => {    
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds`);
    client.user.setActivity(`+help | não sei o que colocar aqui '-'`);    
    client.guilds.forEach(g => client["filas"].set(g.id, []))
  });

client.on("guildCreate", guild => {
  console.log(`Uma nova guild me adicionou: ${guild}`);
  client.user.setActivity(`+help | estou em ${client.users.size} guilds`);
  mkdir(`/data/${guild.id}`, { recursive: true}).catch(console.error);
});

setInterval(function(){
  client.user.setActivity(`+help | não sei o que colocar aqui '-'`);      
}, 3000); 

client.login(token);

