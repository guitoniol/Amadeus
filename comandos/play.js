const ytdl = require('ytdl-core');

function play(guild, serverQueue) {
  if(serverQueue.songs.length == 0) {
    serverQueue.textChannel.send("fila concluida");
    serverQueue.voiceChannel.leave();
    
    serverQueue.textChannel = null;
    serverQueue.voiceChannel = null;
    serverQueue.connection = null;
    serverQueue.playing = false;

    return;
  }
  let song = serverQueue.songs[0];
  const dispatcher = serverQueue.connection
    .play(ytdl(song.url)).on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue);
    }).on("error", error => {
      console.log(error);
      serverQueue.textChannel.send("erro :X");
    });
    
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
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
        const serverQueue = client.servers.get("queue").get(message.guild.id);
        
        if(!voiceChannel) return message.channel.send("você precisa estar em um canal de voz!");
        if(serverQueue.voiceChannel && serverQueue.voiceChannel != voiceChannel) return message.channel.send(`Já estou tocando no canal ${serverQueue.voiceChannel.title}.`);

        const songInfo = await ytdl.getInfo(args[0]);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };
        
        try {
            // Here we try to join the voicechat and save our connection into our object.
            let connection = await voiceChannel.join();
            serverQueue.playing = true;
            serverQueue.textChannel = message.channel;
            serverQueue.voiceChannel = voiceChannel;
            serverQueue.connection = connection;
            serverQueue.songs.push(song);
            if(serverQueue.songs.length == 1) play(message.guild, serverQueue);

           } catch (err) {
             console.log(err);
             return message.channel.send("'-'" + err);
           }        
    }
}
