require('dotenv/config');

const { google } = require('googleapis');
const { createAudioPlayer, joinVoiceChannel, VoiceConnectionStatus, entersState, getVoiceConnection } = require('@discordjs/voice');
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

const resolveVideoUrl = async (proxy, member, serverQueue, query) => {  
  let songs = [];
  const q = proxy.v? proxy.v : query;
  const type = "video";

  await youtube.search.list({q, type, part: 'snippet',  maxResults: 1})
    .then(res => {
      songs = res.data?.items.map(songInfo => new Object({
        title: songInfo.snippet.title,
        url: `https://youtu.be/${songInfo.id.videoId}`,
        member
      }));
    });

    serverQueue.songs.push(...songs);
}

const resolvePlaylistUrl = async (proxy, member, serverQueue) => {  
  let songs = [];
  let requestOptions = {
      playlistId: proxy.list,
      part: 'contentDetails, snippet', 
      maxResults: 50
  };

  if (serverQueue.pageToken) requestOptions.pageToken = serverQueue.pageToken;

  await youtube.playlistItems.list(requestOptions).then(res => {
    serverQueue.pageToken = res.data?.nextPageToken;

    songs = res.data?.items.map(songInfo => new Object({
      title: songInfo.snippet.title,
      url: `https://youtu.be/${songInfo.contentDetails.videoId}`,
      member
    }));
  });

  if(proxy.v) {
    let index = songs.findIndex(songInfo => (songInfo.url.indexOf(proxy.v) != -1));

    if(index != -1) {
      const songInfo = songs.splice(index, 1)[0];
      songs.splice(0, 0, songInfo);
    } else {
      await resolveVideoUrl(proxy, member, serverQueue);
    }
  }

  serverQueue.songs.push(...songs);
  serverQueue.lastPlaylist = proxy.list;
  serverQueue.lastMember = member;
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

    const proxy = new Proxy(new URLSearchParams(args[0].split("?").pop()), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    if(proxy.list) {
      await resolvePlaylistUrl(proxy, message.member, serverQueue);
    } else {
      await resolveVideoUrl(proxy, message.member, serverQueue, args.join(" "));
    }

    if (!serverQueue.songs.length) 
      return message.react('❌');    

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
  }, 

  resolvePlaylistUrl: resolvePlaylistUrl
};