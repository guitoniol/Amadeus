const api = "https://nekos.life/api/neko";// "https://nekos.life/api/v2/img/meow";
const fetch = require('node-fetch');

module.exports = {
    config: {
        nome: "neko",
        descricao: "desculpa",
        sintaxe: "`+neko`",
        permitidos: "Membros",        
    },

    run: async(client, message, args) => {
        return fetch(api)
            .then(response => response.json())
                .then(json => message.channel.send({embeds: [{image: {url: json.neko}}]}))
                    .catch(O_o => {message.channel.send("algo deu errado ;-;"); console.log(O_o)});;                    
    }                                 
}

