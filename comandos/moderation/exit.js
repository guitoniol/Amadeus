module.exports = {
    config: {
        nome: "exit",
        descricao: "DESTROI a api",
        sintaxe: "+exit",
        permitidos: "imi",
        ignore: true        
    },

    run: async(client, message, args) => {        
        if(message.member.id === "231524583251902464")
            client.destroy();           
            
        return;
    }
}

