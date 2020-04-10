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
        //skipar = (message.member.hasPermission("MOVE_MEMBERS") || (message.member.id === client.servers.get(message.guild.id).fila[0].dj))
            
        if(!skipar && !(client.servers.get(message.guild.id).jaVotou.includes(message.member.id))){
            if(client.servers.get(message.guild.id).skipVotes > 1){
                skipar = true;
                client.servers.get(message.guild.id).skipVotes = 0;
                client.servers.get(message.guild.id).jaVotou = [];                
            } else {
                client.servers.get(message.guild.id).skipVotes++;
                client.servers.get(message.guild.id).jaVotou.push(message.member.id);
                return message.channel.send(`:cry: ${message.author.username} votou para pular a música **(${client.servers.get(message.guild.id).skipVotes}/3)**`)    
            }
        }
            
        if(skipar && message.guild.voiceConnection.dispatcher)
            message.guild.voiceConnection.dispatcher.end();        
    }
}

