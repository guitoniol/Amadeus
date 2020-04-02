const {readdirSync} = require('fs');

module.exports = (client) => {    
    const load = dirs => {
        const comandos  = readdirSync(`./comandos/${dirs}/`).filter(d => d.endsWith('.js'));                

        for(let file of comandos){
            const pull = require(`../comandos/${dirs}/${file}`);            
            client.comandos.set(pull.config.nome, pull);           

            if(pull.config.aliases)
                pull.config.aliases.forEach(alias => client.aliases.set(alias, pull.config.nome));
        }
    }

    ["", "moderation"].forEach(x => load(x));
}