module.exports = {
    config: {
        nome: "loop",
        descricao: "coloca a musica atual em loop pro rhettz chato",
        sintaxe: "`+loop`",
        permitidos: "Membros",        
    },

    run: async(client, message, args) => {
        const serverQueue = client.servers.get("queue").get(message.guild.id);
        serverQueue.looping = !serverQueue.looping;
    }                                 
}