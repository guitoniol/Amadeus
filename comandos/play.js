require('dotenv/config');

const { google } = require('googleapis');
const { createAudioPlayer, joinVoiceChannel, VoiceConnectionStatus, entersState, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const resume = require('./resume.js').run;
const pause = require('./pause.js').run;
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE });

const getPlayer = async (client, serverQueue) => {
  const player = createAudioPlayer();

  player.on("idle", (err) => {
    if (!serverQueue.playing) return;
    if (err) console.log(err);

    client.emit("finish", serverQueue.textChannel.guildId);
  });

  player.on("error", err => {
    console.log(err);
    client.emit("finish", serverQueue.textChannel.guildId, err);
  });

  return player;
}

module.exports = {
  config: {
    nome: "play",
    descricao: "musica tuts tuts",
    sintaxe: "`+play` <link do youtube>",
    permitidos: "Membros",
    aliases: ["song", "p", "jabuticaba"]
  },

  run: async (client, message, args) => {
    const serverQueue = client.servers.get("queue").get(message.guild.id);
    if (args.length == 0) {
      return serverQueue.paused? resume(client, message, args) : pause(client, message, args);
    }

    const voiceChannel = await message.member.voice?.channel;
    if (!voiceChannel)
      return message.channel.send("Você não está conectado a nenhum canal de voz.");

    const connection = getVoiceConnection(message.guild.id);
    if (connection && connection.joinConfig.channelId != voiceChannel.id) {
      const connectionChannel = await client.channels.fetch(connection.joinConfig.channelId);
      return message.channel.send(`Já estou tocando no canal ${connectionChannel.name}.`);
    }

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

        voiceConnection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
          try {
            await Promise.race([
              entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5_000),
              entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
          } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            voiceConnection.destroy();
          }
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
