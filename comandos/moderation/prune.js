module.exports = {
    config: {
        nome: "prune",
        descricao: "limpa mensagens",
        sintaxe: "+prune <n>",
        permitidos: "Mods",
        aliases: ["delete", "purge", "clear"],
        lvlPermissao: 0x00002000,
    },

    run: async(client, message, args) => {
        qntd = args[0];
        
        if(!qntd || isNaN(qntd)){
            filter = m => m.author.id === message.author.id;            
            reply = await message.channel.send(!qntd? "quantas?" : "Quantas?(use somente números)");
             
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

        if(qntd === 1){
            deletar = await message.channel.fetchMessages({limit: 1})            
            deletar.first().delete().catch(err => console.log(err));
            return message.channel.send("Deletei 1 mensagem (:").then(m => m.delete(1500))
        }

        if(qntd > 100){
            let hoje = new Date();            
            let messages = [];
            let before;
            let has14 = false; 
            let size = 0;            

            await message.channel.fetchMessages({limit: 100}).then(msgs => {
                if(msgs.last().createdAt.getMonth() < hoje.getMonth || 
                  (msgs.last().createdAt.getDate() - hoje.getDate()) >= 14 || 
                  msgs.last().createdAt.getYear() < hoje.getYear()){
                      message.channel.send(`Só é possível deletar mensagens que foram enviadas há menos de 14 dias ${client.emojis.get("527760726241181709")}`)
                      has14 = true;
                  } else {                                            
                      messages.push(msgs);
                      before = msgs.last().id;
                      qntd -= 100;
                      size += 100;
                  }
            });            

            while((!has14) && (qntd !== 0)){                
                await message.channel.fetchMessages({limit: qntd<=100? qntd : 100, before: before}).then(msgs => {
                    if(msgs.last().createdAt.getMonth() < hoje.getMonth || 
                       (msgs.last().createdAt.getDate() - hoje.getDate()) >= 14 ||
                        msgs.last().createdAt.getYear() < hoje.getYear()){                            
                            has14 = true;                                                    
                    } else {                        
                        messages.push(msgs);
                        before = msgs.last().id;
                        qntd = qntd <= 100? 0 : qntd - 100;
                        size += msgs.size;
                    }
                }); 
            }

            if(has14){                               
                let aviso = await message.channel.send(`Algumas mensagens não serão deletadas pois foram enviadas a mais de 14 dias, continuar?`);

                aviso.react('✅'); 
                filter = (reaction, user) => (reaction.emoji.name === '✅' || reaction.emoji.name === '❌') && (user.id === message.author.id)
                aviso.react('❌');

                await aviso.awaitReactions(filter, { time: 7000 }).then(emojo => { 
                    if(emojo.size === 0 || emojo.first()._emoji.name === '❌'){
                        messages = [];
                        message.channel.send("❌ Comando cancelado!");                                                                                      
                    } 
                });

                aviso.delete();
            }

            if(messages.length > 0){                
                messages.forEach(msgs => {
                    message.channel.bulkDelete(msgs).catch(err => {
                        message.channel.send(`:< deu erro \`${err.message}\``);
                        console.log(err);
                    });
                }).then(() => message.channel.send(`Apaguei \`${size}\` mensagens ${client.emojis.get("604084329311633467")}`).then(m => m.delete(5000)))
                
                
            }

            return;
        }

        await message.channel.fetchMessages({limit: qntd}).then(messages => {
            message.channel.bulkDelete(messages).catch(err => {                
                message.channel.send("puts deu merda").then(m => m.delete(1500));
                console.log(err);
                return;
            });            
            
            qntd = messages.size;
        }).catch(err => {
            console.log(err);
            return message.channel.send(`Ué: \`${err.message}\``).then(m => m.delete(1500))
        });

        message.channel.send(`Apaguei \`${qntd}\` mensagens :call_me:`).then(m => m.delete(3000))        
    }
}   

