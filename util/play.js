const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');

module.exports = {
    play: (client, guildId) => {
        const embed = new MessageEmbed();
        embed.setColor(16711680);

        let serverQueue = client.servers.get("queue").get(guildId);
        if (serverQueue.songs.length == 0) {
            serverQueue.textChannel.send("Fila concluida!");
            serverQueue.voiceChannel.leave();
            serverQueue.textChannel = null;
            serverQueue.voiceChannel = null;
            serverQueue.connection = null;
            serverQueue.playing = false;

            return;
        }

        const song = serverQueue.songs[0];
        const dispatcher = serverQueue.connection
            .play(ytdl(song.url), {filter: 'audioonly'}).on("finish", () => {
                if(!serverQueue.looping) {
                    client.emit("finish", guildId);
                }

                client.emit("play", guildId);
            }).on("error", err => {
                console.log(err);
                serverQueue.textChannel.send("O_o -> " + err);
                client.emit("finish", guildId);
                client.emit("play", guildId);
            });
    
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    
        if(!serverQueue.looping) {
            embed.setDescription(`Tocando: [${song.title}](${song.url}) [${song.member}]`);
            serverQueue.textChannel.send(embed);
        }
    }
}