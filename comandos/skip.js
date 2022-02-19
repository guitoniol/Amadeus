module.exports = {
    config: {
        nome: "skip",
        descricao: "skipa a músic que estiver tocando",
        sintaxe: "`+skip`",
        permitidos: "mods",
        aliases: ["stop"]
    },

    run: async(client, message, args) => {
        const serverQueue = client.servers.get("queue").get(message.guild.id);
        const voiceChannel = message.member.voice?.channel;
        
        if(!voiceChannel) return message.channel.send("você precisa estar em um canal de voz!");
        if(!serverQueue.playing) return message.channel.send("Não estou tocando no momento <:");                                    

        serverQueue.skip = true;
        serverQueue.paused = false;
        serverQueue.player.emit('idle');
        message?.react('✅');
    }
}

