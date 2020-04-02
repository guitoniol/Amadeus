module.exports = {
    config: {
        nome: "kick",
        descricao: "Expulsa babacas",
        sintaxe: "+kick <usuario>",
        permitidos: "Moderadores",
        lvlPermissao: 0x2,           
    },

    run: async(client, message, args) => {        
        if(args.length === 0) return message.channel.send("Você precisa me dizer quem quer kickar")
        if(!message.mentions.members.first()) return message.channel.send("Não consegui encontrar esse membro");
        
        let channel = message.channel;    
        let member = message.mentions.members.first();        
        
        if(member.id === message.member.id) return channel.send("'-'");

        if(member.id === "231524583251902464") return channel.send("vai catar coquinho");
        
        if(member.highestRole.position >= message.member.highestRole.position)
            return channel.send("Essa pessoa é mais importante que você ;-;");
        
        if(!member.kickable)
            return channel.send("Essa pessoa tem o cargo maior ou igual ao meu >:(");
        
        let motivo = args.slice(1).join(' ');
        reason = !motivo? `Expulsado por ${message.author} sem nenhum dado` : 
                          `Expulsado por ${message.author} com o motivo: ${motivo}`;
        
        await member.kick(reason)
            .then(       
                channel.send(`${member} foi expulso(a) com sucesso!`),
                member.send(`${message.author} te expulsou do servidor ${message.guild.name}`))
            .catch(error => message.reply(`Desculpe ${message.author}, mas não pude expulsar porque ${error.message}`));                            
    }
}

