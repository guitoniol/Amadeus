const playDl = require('play-dl') //JS importing
const { MessageEmbed } = require('discord.js');
const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const DiscordQueueModel = require("../models/DiscordQueueModel");

module.exports = {
    play: async (client, guildId) => {
        const embed = new MessageEmbed();
        embed.setColor(16711680);

        let serverQueue = client.servers.get("queue").get(guildId);
        if (serverQueue.songs.length == 0) {
            getVoiceConnection(guildId).destroy();
            serverQueue.player?.stop();
            client.servers.get("queue").set(guildId, new DiscordQueueModel());

            serverQueue.textChannel.send("Fila concluida!");
            return;
        }

        const song = serverQueue.songs[0];
        try {
            const stream = await playDl.stream(song.url);
            const resource = createAudioResource(stream.stream, {
                inputType : stream.type,
                inlineVolume: true
            });

            resource.volume.setVolume(0.5);
            serverQueue.player.play(resource);

            if(!serverQueue.looping || serverQueue.skip) {
                embed.setDescription(`Tocando: [${song.title}](${song.url}) [${song.member}]`);
                let message = await serverQueue.textChannel.send({embeds: [embed]});

                if(serverQueue.looping) message.react('🔁');

                serverQueue.skip = false;
            }
        } catch(err) {
            const msg = err.message;
            console.log(song.url, song.title, err);
            client.emit("finish", guildId, msg.indexOf("Video unavailable") == -1? msg : null);
        }
    }
}