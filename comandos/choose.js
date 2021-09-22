const {escolhas} = require('../responses/choose.json')

module.exports = {
    config: {
        nome: "choose",
        descricao: "Eu escolho entre duas ou mais opções",
        sintaxe: "+choose <opção 1> | <opção 2>",
        permitidos: "Membros",
        aliases: ["escolha", "switch"]        
    },

    run: async(client, message, args) => {           
        let chooses = args.join(" ").split("|");                    
        i = 0;

        chooses = chooses.filter(c => c.trim() !== "");
        if(chooses.length < 2) return message.channel.send("Passe pelo menos duas opções. (separe-as com `|`)");

        let random = Math.floor(Math.random() * (chooses.length - 0)) + 0;
        let j = Math.floor(Math.random() * (escolhas.length -0)) + 0; 
        choose = chooses[random];
        choose = choose.trim();

        return message.channel.send(escolhas[j].replace("$", choose));
    }
}
