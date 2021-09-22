require('dotenv/config');
const { createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { google } = require('googleapis');
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE
});

const getPlayer = async (client, serverQueue) => {
  const player = createAudioPlayer();

  player.on("idle", () => {
    if(!serverQueue.playing) return;
    
    if(!serverQueue.looping) client.emit("finish", serverQueue.textChannel.guildId);
  });
  
  player.on("error", err => {
    console.log(err);
    serverQueue.textChannel.send("O_o -> " + err);
    client.emit("finish", serverQueue.textChannel.guildId);
  });
  
  return player;
}

module.exports = {
  config: {
    nome: "play",
    descricao: "musica tuts tuts",
    sintaxe: "`+play` <link do youtube>",
    permitidos: "Membros",
    aliases: ["song"]
  },
  

  run: async (client, message, args) => {
    if(args.length == 0) return message.react('❌');

    const voiceChannel = await message.member.voice?.channel;
    if (!voiceChannel)
      return message.channel.send("Você não está conectado a nenhum canal de voz.");

    const serverQueue = client.servers.get("queue").get(message.guild.id);
    if (serverQueue.voiceChannel && serverQueue.voiceChannel != voiceChannel)
      return message.channel.send(`Já estou tocando no canal ${serverQueue.voiceChannel.title}.`);

    let ytUrl = args[0];
    if (!ytdl.validateURL(args[0])) {
      await youtube.search.list({ q: args.join(" "), part: 'snippet', type: 'video', maxResults: 1 })
        .then(res => {
          let items = res.data?.items;
          ytUrl = items && items.length > 0 ? `https://youtu.be/${items[0].id.videoId}` : null;
        }).catch(error => {
          console.error(error);
        });
    }

    if (!ytUrl) return message.react('❌');

    const songInfo = await ytdl.getInfo(ytUrl);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      member: message.member
    };

    serverQueue.songs.push(song);
    if (!serverQueue.playing) {
      try {
        const voiceConnection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        serverQueue.playing = true;
        serverQueue.textChannel = message.channel;
        serverQueue.voiceChannel = voiceChannel;
        const player = await getPlayer(client, serverQueue);
        voiceConnection.subscribe(player);
        serverQueue.player = player;

        client.emit("play", message.guild.id);
      } catch (err) {
        console.log(err);
        message.channel.send("Algo inesperado aconteceu!" + err);
        return;
      }
    }

    message.react('✅');
  }
}
