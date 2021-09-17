module.exports = {
    config: {
        nome: "limparFila",
        descricao: "limpa a fila de um servidor",
        sintaxe: "`+limparFila`",
        permitidos: "td mundo",
    },

    run: async(client, message, args) => {
        const serverQueue = client.servers.get("queue").get(message.guild.id);
        serverQueue.songs = [];

        message?.react('✅');
    }
}

