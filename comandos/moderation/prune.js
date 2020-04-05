module.exports = {
    config: {
        nome: "prune",
        descricao: "limpa mensagens",
        sintaxe: "+prune <n>",
        permitidos: "Moderadores",
        aliases: ["delete", "purge", "clear"],
        lvlPermissao: 0x00002000,
    },

    run: async(client, message, args) => {
        qntd = args[0];

        if(!qntd || isNaN(qntd)){
            filter = m => m.author.id === message.author.id;            
            reply = await message.channel.send(!qntd? "quantas?" : "Quantas?(use somente números)!");
             
            await message.channel.awaitMessages(filter, {
                 max:1,
                 time: 10000
             }).then(m => {
                 if(!m || !m.first()) return reply.delete();                                   
                 qntd = m.first().content;

                 if(isNaN(qntd)){
                     message.channel.send("Argumento invalido, utilize números")
                     return reply.delete();
                 } else{
                    reply.delete();            
                    m.first().delete();        
                 }
             }).catch(err => console.log(err));
        }

        await message.delete();
        if(isNaN(qntd)) return;
        qntd = parseInt(qntd);
        
        if(qntd === 0) return 
        else if(qntd > 100) return message.channel.send("Só da pra deletar até 100 mensagens :|").then(m => m.delete(5000));

        if(qntd === 1){
            deletar = await message.channel.fetchMessages({limit: 1})
            deletar.first().delete();
            return message.channel.send("Deletei 1 mensagem (:").then(m => m.delete(1500))
        }
        
        message.channel.fetchMessages({limit: qntd}).then(messages => 
            message.channel.bulkDelete(messages).then(
                message.channel.send(`Foram deletadas \`${messages.size}\` mensagens :call_me:`).then(
                    m => m.delete(3000))).catch(err => {
                        console.log(err);
                        message.channel.send("puts deu merda").then(m => m.delete(1500));
                    })).catch(err => {
                        console.log(err);
                        message.channel.send(`Ué: \`${err.message}\``).then(m => m.delete(1500))
                    });
    }
}   

