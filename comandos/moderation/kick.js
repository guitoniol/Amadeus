module.exports = {
    config: {
        nome: "kick",
        descricao: "Expulsa babacas",
        sintaxe: "+kick <usuario>",
        permitidos: "Mods",
        lvlPermissao: 0x2,           
    },

    run: async(client, message, args) => {    
        if(args.length === 0) 
            return message.channel.send("Você precisa me dizer quem quer kickar")
        
        if(!message.mentions.members.first()) 
            return message.channel.send("Não consegui encontrar esse membro");
        
        let channel = message.channel;    
        let member = message.mentions.members.first();        
        
        if(member.id === message.member.id) 
            return channel.send("'-'");
        
        if(member.highestRole.position >= message.member.highestRole.position)
            return channel.send("Essa pessoa é mais importante que você ;-;");
        
        if(!member.kickable)
            return channel.send("Essa pessoa tem o cargo maior ou igual ao meu >:(");
        
        let motivo = args.slice(1).join(' ');
        reason = !motivo? `Expulso por ${message.author.username}#${message.author.discriminator}` : 
                          `Expulso por ${message.author.username}#${message.author.discriminator} com o motivo: \"${motivo}\"`;
        
        await member.kick(reason).then(
            channel.send(`${member} foi expulso(a) com sucesso!`),
                member.send(`${message.author.username}#${message.author.discriminator} te expulsou do servidor ${message.guild.name} :/`))
                    .catch(error => message.reply(`Erro erro erro \`${error.message}\``));                            
    }
}

