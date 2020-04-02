module.exports = {
    config: {
        nome: "skip",
        descricao: "skipa a músic que estiver tocando",
        sintaxe: "`+skip`",
        permitidos: "mods",        
    },

    run: async(client, message, args) => {                      
        if(!message.guild.voiceConnection) return message.channel.send("eu não estou em nenhum canal de voz");                                    
        if(!message.member.hasPermission("MOVE_MEMBERS"))  return message.channel.send(":rage: espera a música acabar");

        if(message.guild.voiceConnection.dispatcher) message.guild.voiceConnection.dispatcher.end();        
    }
}

