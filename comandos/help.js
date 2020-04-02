module.exports = {
    config: {
        nome: "help",
        descricao: "ajuda",
        sintaxe: "+help [comando]",
        permitidos: "membros",
        aliases: ["ajuda", "info"]        
    },

    run: async(client, message, args) => {             
        let comandos = "";
        client.comandos.forEach(c => comandos += `\`${c.config.nome}\` `) ;                

        if(args.length === 0){
            message.channel.send({embed: {
                color: 16711680,                
                author: {
                    name: `Ajudinha`,
                    icon_url: message.author.avatarURL
                },
                description: "+help [comando]",            
                fields: [{
                    name: "Comandos",
                    value: comandos
                },
                {
                    name: "Interações",
                    value: "`Bom dia`, `sandri`"
                }],
            }}).catch(O_o => console.log(O_o));                    
        }

        if(comandos.indexOf(args[0]) !== -1){
            let cmd = client.comandos.get(args[0]) || client.comandos.get(client.aliases.get(args[0]));

            message.channel.send({embed: {
                color: 16711680,
                author: {
                    name: `informações sobre o comando ${cmd.config.nome}`,
                    icon_url: message.author.avatarURL
                },                
                description: `${cmd.config.descricao}`,
                fields: [{
                    name: "Quem pode usar",
                    value: `${cmd.config.permitidos}`
                },
                {
                    name: "Exemplo de uso",
                    value: `${cmd.config.sintaxe}`
                },
                {
                    name: "Sinônimos",
                    value: `${cmd.config.aliases}`
                }],                
                footer: {
                    text: '<> - parametro obrigatório | [] opcional',
                    icon_url: message.author.avatarURL
                }
            }}).catch(O_o => console.log(O_o));  
        }

    }
}