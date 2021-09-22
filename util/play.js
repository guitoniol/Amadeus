const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const { OpusEncoder } = require('@discordjs/opus');

module.exports = {
    play: async (client, guildId) => {
        const embed = new MessageEmbed();
        embed.setColor(16711680);

        let serverQueue = client.servers.get("queue").get(guildId);
        if (serverQueue.songs.length == 0) {

            serverQueue.textChannel.send("Fila concluida!");
            serverQueue.player?.stop();
            serverQueue.textChannel = null;
            serverQueue.playing = false;
            serverQueue.player = null;

            getVoiceConnection(guildId).destroy();
            return;
        }

        const song = serverQueue.songs[0];
        const stream = ytdl(song.url);
        const resource = createAudioResource(stream, {
            inlineVolume: true
        });

        resource.volume.setVolume(0.5);
        serverQueue.player.play(resource);

        if(!serverQueue.looping) {
            embed.setDescription(`Tocando: [${song.title}](${song.url}) [${song.member}]`);
            serverQueue.textChannel.send({embeds: [embed]});
        }
    }
}