const api = "https://api.thecatapi.com/v1/images/search";// "https://nekos.life/api/v2/img/meow";
const fetch = require('node-fetch');

module.exports = {
    config: {
        nome: "cat",
        descricao: "GATINHOS",
        sintaxe: "`+cat`",
        permitidos: "Membros",
        aliases: ["gato", "catt"]
    },

    run: async(client, message, args) => {
        return fetch(api)
            .then(response => response.json())
                .then(json => message.channel.send({files: [json[0].url]})
                    .catch(O_o => {
                        message.channel.send("algo deu errado ;-;"); 
                        console.log(O_o)
                    }));
    }
}

