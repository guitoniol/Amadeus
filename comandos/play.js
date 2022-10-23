require('dotenv/config');

const { google } = require('googleapis');
const { createAudioPlayer, joinVoiceChannel, VoiceConnectionStatus, entersState, getVoiceConnection } = require('@discordjs/voice');
const DiscordQueueModel = require("../models/DiscordQueueModel");
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
  const options = { type: "video", part: "snippet", maxResults: 1 };
  let res;

  if(proxy.v) {
    options["id"] = proxy.v;
    res = await youtube.videos.list(options);
  } else {
    options["q"] = query;
    res = await youtube.search.list(options);
  }

  songs = res.data?.items.map(songInfo => new Object({
    title: songInfo.snippet.title,
    url: `https://youtu.be/${proxy.v? proxy.v : songInfo.id.videoId}`,
    member
  }));

    if(!songs.length) throw 'Invalid query.';
  
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

  if(!songs.length) throw 'Invalid query.';

  serverQueue.songs.push(...songs);
  serverQueue.lastPlaylist = proxy.list;
  serverQueue.lastMember = member;
}

const resolveProxy = async (proxy, member, serverQueue, query) => {
    if(proxy.list) return await resolvePlaylistUrl(proxy, member, serverQueue);

    return await resolveVideoUrl(proxy, member, serverQueue, query);
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
    const voiceChannel = await message.member.voice?.channel;
    if (!voiceChannel)
      return message.channel.send("Você não está conectado a nenhum canal de voz.");

    const serverQueue = client.servers.get("queue").get(message.guild.id);
    if (args.length == 0) {
      return serverQueue.paused? resume(client, message, args) : pause(client, message, args);
    }

    const connection = getVoiceConnection(message.guild.id);
    if (connection && connection.joinConfig.channelId != voiceChannel.id) {
      const connectionChannel = await client.channels.fetch(connection.joinConfig.channelId);
      return message.channel.send(`Já estou tocando no canal ${connectionChannel.name}.`);
    }

    const query = args[0].indexOf("youtu.be/") != -1? "v=" + args[0].split("/").pop() : args[0].split("?").pop();
    const proxy = new Proxy(new URLSearchParams(query), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    try {
      await resolveProxy(proxy, message.member, serverQueue, args.join(" "));
    } catch(err) {
      return message.react('❌');    
    }

    if (!serverQueue.playing) {
      try {
        const voiceConnection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: voiceChannel.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator
        });

        voiceConnection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
          try {
            if (newState.status == 'disconnected') throw 'disconnected';

            await Promise.race([
              entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5_000),
              entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
            // Seems to be reconnecting to a new channel - ignore disconnect
          } catch (error) {
            // Seems to be a real disconnect which SHOULDN'T be recovered from
            voiceConnection.destroy();
            client.servers.get("queue").set(voiceChannel.guild.id, new DiscordQueueModel());
          }
        });

        serverQueue.playing = true;
        serverQueue.textChannel = message.channel;
        serverQueue.voiceChannel = voiceChannel;
        serverQueue.player = await getPlayer(client, serverQueue);
        voiceConnection.subscribe(serverQueue.player);

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