module.exports = {
    config: {
        nome: "pause",
        descricao: "pause '-'",
        sintaxe: "`+pause`",
        permitidos: "Membros",        
    },

    run: async(client, message, args) => {
        const serverQueue = client.servers.get("queue").get(message.guild.id);

        if(!serverQueue?.playing)
            return message.react('❌');
        
        if(serverQueue?.paused)
            return;

        serverQueue.player.pause();
        message.react('⏸');
        serverQueue.paused = true;
    }                                 
}