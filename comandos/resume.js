module.exports = {
    config: {
        nome: "resume",
        descricao: "despausa '-'",
        sintaxe: "`+resume`",
        permitidos: "Membros",        
    },

    run: async(client, message, args) => {
        const serverQueue = client.servers.get("queue").get(message.guild.id);

        if(!serverQueue?.playing)
            return message.react('❌');

        if(!serverQueue?.paused)
            return;

        serverQueue.player.unpause();
        message.react('▶');
        serverQueue.paused = false;
    }                                 
}