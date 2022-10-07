const { stream } = require('play-dl')
const { MessageEmbed } = require('discord.js');
const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const DiscordQueueModel = require("../models/DiscordQueueModel");

const destroyVoiceConnection = (client, guildId) => {
    client.servers.get("queue").set(guildId, new DiscordQueueModel());

    setTimeout(() => {
        if(client.servers.get("queue").get(guildId).playing) return;
        
        getVoiceConnection(guildId)?.destroy();
    }, 120000);
}

module.exports = {
    play: async (client, guildId) => {
        const embed = new MessageEmbed();
        embed.setColor(16711680);

        let serverQueue = client.servers.get("queue").get(guildId);
        if (!serverQueue.songs.length) {
            serverQueue.player?.stop();
            destroyVoiceConnection(client, guildId);
            return;
        }

        const song = serverQueue.songs[0];
        try {
            const songStream = await stream(song.url).catch(() => {
                serverQueue.textChannel.send(`Vídeo indisponível: *${song.title}*`);
                client.emit("finish", guildId);
            });

            if(!songStream) return;

            const resource = createAudioResource(songStream.stream, {
                inputType: songStream.type,
                inlineVolume: true
            });

            resource.volume.setVolume(0.5);
            serverQueue.player.play(resource);

            if (!serverQueue.looping || serverQueue.skip) {
                embed.setDescription(`Tocando: [${song.title}](${song.url}) [${song.member}]`);
                let message = await serverQueue.textChannel.send({ embeds: [embed] });

                if (serverQueue.looping) message.react('🔁');

                serverQueue.skip = false;
            }
        } catch (err) {
            console.log(song.url, song.title, err);
            client.emit("finish", guildId, err.message);
        }
    }
}