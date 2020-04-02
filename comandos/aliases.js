//ee
const {Collection} = require("discord.js")
const fs = require('fs');

module.exports = {
    config: {
        nome: "aliases",
        descricao: "adiciona um alias pro comando (outro nome pra vc usar ele)",
        sintaxe: "`+aliases <comando> <alias>`",
        permitidos: "Administradores"        
    },

    run: async(client, message, args) => {
        if(args.length < 2) return message.channel.send(`é assim que usa: ${client.comandos.get("aliases").config.sintaxe}`);            
        if(!client.comandos.get(args[0])) return message.channel.send(`Esse comando (\`${args[0]}\`) não existe :sleeping:`)

        if(!fs.existsSync(`./data/g${message.guild.id}/aliases.json`))            
            fs.writeFile(`./data/g${message.guild.id}/aliases.json`, '', (err) => {
                if(err) throw err
            });
        
        fsAliases = fs.readFileSync(`./data/g${message.guild.id}/aliases.json`);                                   
    }
}

