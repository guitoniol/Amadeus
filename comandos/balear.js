module.exports = {
    config: {
        nome: "balear",
        descricao: "baleie alguém",
        sintaxe: "+balear <texto>",
        permitidos: "Membros",        
    },

    run: async(client, message, args) => {
        let member = message.mentions.members.first(); 
        message.channel.send(`${member}, você acaba de ser belado por ${message.author}`, {embed: {image: {url: "https://media3.giphy.com/media/ZgRibURMn7Ywdvzhd7/giphy.gif"}}});               
    }
}