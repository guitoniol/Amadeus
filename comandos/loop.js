module.exports = {
    config: {
        nome: "loop",
        descricao: "loop '-'",
        sintaxe: "`+loop`",
        permitidos: "Membros",        
    },

    run: async(client, message, args) => {
        const serverQueue = client.servers.get("queue").get(message.guild.id);
        serverQueue.looping = !serverQueue.looping;
        message.react(serverQueue.looping? '✅' : '🔴');
    }                                 
}