require('dotenv/config');
const ytdl = require('ytdl-core');
const { google } = require('googleapis');
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE
});

module.exports = {
  config: {
    nome: "play",
    descricao: "musica tuts tuts",
    sintaxe: "`+play` <link do youtube>",
    permitidos: "Membros",
    aliases: ["song"]
  },


  run: async (client, message, args) => {
    const voiceChannel = message.member.voice?.channel;
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

    if (!ytUrl) return message.react('❌')

    const songInfo = await ytdl.getInfo(ytUrl);
    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
      member: message.member
    };

    serverQueue.songs.push(song);
    if (!serverQueue.playing) {
      try {
        let connection = await voiceChannel.join();
        serverQueue.playing = true;
        serverQueue.textChannel = message.channel;
        serverQueue.voiceChannel = voiceChannel;
        serverQueue.connection = connection;

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
