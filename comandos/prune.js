module.exports = {
    config: {
        nome: "prune",
        descricao: "Apaga x mensagens de um canal",
        sintaxe: "+prune <número de mensagens>",
        permitidos: "Moderadores",
        lvlPermissao: 0x2000,        
        aliases: ["delete", "clean", "clear", "purge"]
    },

    run: async(client, message, args) => {                             
        let limite = !args? undefined : args[0];                     
       
        if(isNaN(limite)) return message.channel.send("Especifique quantas mensagens quer deletar :sleeping:");      
        await message.delete();

        let count = limite;              
        var messages;                    
        
        while(count>=100){                        
            messages = await message.channel.fetchMessages({limit: 100});
            console.log(messages);
            messages.forEach(m => {
                m.delete();
            })                        

            count -=100;
        }                    
        
        messages = await message.channel.fetchMessages({limit: count});                    
        messages.forEach(m => {m.delete();})                    
        
        const msg = await message.channel.send(limite==1? `${message.author} deletou 1 mensagem` : `${message.author} deletou ${limite} mensagens`);                
        setTimeout(() => {
            try {msg.delete();} catch(error){console.log(error)}
        }, 3000);
    }
}

