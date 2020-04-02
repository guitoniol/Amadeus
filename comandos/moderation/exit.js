module.exports = {
    config: {
        nome: "exit",
        descricao: "fecha a api",
        sintaxe: "+exit",
        permitidos: "imi e retis",        
    },

    run: async(client, message, args) => {        
        if(message.member.id === "231524583251902464" || message.member.id === "205854329049972736")
            client.destroy();           
            
        return;
    }
}

