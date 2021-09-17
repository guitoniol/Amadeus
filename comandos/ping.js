module.exports = {
    config: {
        nome: "ping",
        descricao: "retorna a latência da api e do host",
        sintaxe: "+ping",
        permitidos: "Membros",                          
    },

    run: async(client, message, args) => {
        const m = await message.channel.send("Ping?");      
        return m.edit(`Ping: ${m.createdTimestamp - message.createdTimestamp} ms. \nping da API: ${Math.round(client.ws.ping)} ms`);      
    }
}