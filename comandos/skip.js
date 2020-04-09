module.exports = {
    config: {
        nome: "skip",
        descricao: "skipa a músic que estiver tocando",
        sintaxe: "`+skip`",
        permitidos: "mods",        
    },

    run: async(client, message, args) => {                      
        if(!message.guild.voiceConnection) return message.channel.send("Não estou tocando no momento <:");                                    
        
        let skipar = false
        votos = client.servers.get(message.guild.id).get("skipVotes")

        skipar = (message.member.hasPermission("MOVE_MEMBERS") || (message.member.id === client.servers.get(message.guild.id).get("fila")[0].dj))
            
        if(!skipar && !(client.servers.get(message.guild.id).get("jaVotou").includes(message.member.id))){
            client.servers.get(message.guild.id).set("skipVotes", ++votos);
            client.servers.get(message.guild.id).get("jaVotou").push(message.member.id);

            if(votos > 2){
                skipar = true;
                client.servers.get(message.guild.id).set("skipVotes", 0);
            } else 
                return message.channel.send(`:cry: ${message.author.username} votou para pular a música **(${votos}/3)**`)    
        }
            
        if(skipar && message.guild.voiceConnection.dispatcher)
            message.guild.voiceConnection.dispatcher.end();        
    }
}

