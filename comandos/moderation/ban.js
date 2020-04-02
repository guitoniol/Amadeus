module.exports = {
    config: {
        nome: "ban",
        descricao: "Bane pessoas",
        sintaxe: "+ban <@user>",
        permitidos: "Moderadores",
        lvlPermissao: 0x4,
    },

    run: async(client, message, args) => {        
        if(args.length === 0) return message.channel.send("... você quer banir o vento?")
        if(!message.mentions.members.first()) return message.channel.send("Não consegui encontrar esse membro");
        
        let channel = message.channel;    
        let member = message.mentions.members.first(); 
        
        if(member.id === message.member.id) return channel.send("'-'");
        
        if(member.highestRole.position >= message.member.highestRole.position && message.guild.owner !== message.member)
            return channel.send("Essa pessoa é mais importante que você ;-;");    

        if(member.id === client.user.id) return channel.send("para ;-;");console.log(client.user.id)
        
        if(!member.bannable) return channel.send("O cargo dessa pessoa é maior ou igual ao meu >:(");    
        
        let motivo = args.slice(1).join(' ');
        reason = !motivo? `Expulsado por ${message.author} sem nenhum dado` : 
                           `Expulsado por ${message.author} com o motivo: ${motivo}`;
        
        await member.ban(reason)
            .then(
                channel.send(`${member} foi banido(a) com sucesso!`),
                member.send(`${message.author} te baniu do servidor ${message.guild.name}`).catch(O_o => console.log(O_o)))
            .catch(error => {message.reply(`ops, deu algum problema na hora de banir\n${error.message}`); console.log(error)});               
    }
}

