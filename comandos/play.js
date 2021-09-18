require('dotenv/config');
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core');
const {google} = require('googleapis');
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE
});

const embed = new MessageEmbed();
embed.setColor(16711680);
embed.setDescription('Hello, this is a slick embed!');

function play(guild, serverQueue) {
  while(true) {
    if (serverQueue.songs.length == 0) {
      serverQueue.textChannel.send("Fila concluida!");
      serverQueue.voiceChannel.leave();

      serverQueue.textChannel = null;
      serverQueue.voiceChannel = null;
      serverQueue.connection = null;
      serverQueue.playing = false;
      return true;
    }

    const song = serverQueue.songs[0];
    dispatcher = serverQueue.connection
      .play(ytdl(song.url)).on("finish", () => {
        if(!serverQueue.looping) serverQueue.songs.shift();
      }).on("error", err => {
        console.log(err);
        serverQueue.textChannel.send("O_o -> " + err);
        serverQueue.songs.shift();
      });

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
    if(!serverQueue.looping) {
      embed.setDescription(`Tocando: [${song.title}](${song.url}) [${song.member}]`);
      serverQueue.textChannel.send(embed);
    }
  }
}

module.exports = {
    config: {
        nome: "play",
        descricao: "musica tuts tuts",
        sintaxe: "`+play` <link do youtube>",
        permitidos: "Membros",
        aliases: ["song"]
    },
    

    run: async(client, message, args) => {
        const voiceChannel = message.member.voice?.channel;
        if(!voiceChannel) 
          return message.channel.send("Você não está conectado a nenhum canal de voz.");

        const serverQueue = client.servers.get("queue").get(message.guild.id);
        if(serverQueue.voiceChannel && serverQueue.voiceChannel != voiceChannel) 
          return message.channel.send(`Já estou tocando no canal ${serverQueue.voiceChannel.title}.`);

        let ytUrl = null;
        if(!ytdl.validateURL(args[0])) {
          await youtube.search.list({ q: args.join(" "), part: 'snippet', type: 'video', maxResults: 1}).then(res => {
            let items = res.data?.items;
            
            if(items && items.length > 0)
              ytUrl = `https://youtu.be/${items[0].id.videoId}`;
            else
              ytUrl = null;
          }).catch(error => {
            console.error(error);
          });
        } else {
		ytUrl = args[0];		

	}
        
        if(!ytUrl) return;
        
        const songInfo = await ytdl.getInfo(ytUrl);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
            member: message.member
        };

        serverQueue.songs.push(song);
        if(!serverQueue.playing) {
          try {
              let connection = await voiceChannel.join();
              serverQueue.playing = true;
              serverQueue.textChannel = message.channel;
              serverQueue.voiceChannel = voiceChannel;
              serverQueue.connection = connection;
              
              play(message.guild, serverQueue);
            } catch (err) {
              console.log(err);
              message.channel.send("Algo inesperado aconteceu!" + err);
              return;
            }
        }     

        message.react('✅');
    }
}
