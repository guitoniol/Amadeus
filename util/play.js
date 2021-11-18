const playDl = require('play-dl') //JS importing
const { MessageEmbed } = require('discord.js');
const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');

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
        const stream = await playDl.stream(song.url);
        const resource = createAudioResource(stream.stream, {
            inputType : stream.type,
            inlineVolume: true
        });

        resource.volume.setVolume(0.5);
        serverQueue.player.play(resource);

        if(!serverQueue.looping || serverQueue.skip) {
            embed.setDescription(`Tocando: [${song.title}](${song.url}) [${song.member}]`);
            message = await serverQueue.textChannel.send({embeds: [embed]});
            if(serverQueue.looping) message.react('🔁');
            serverQueue.skip = false;
        }
    }
}