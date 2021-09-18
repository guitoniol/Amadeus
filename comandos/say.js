module.exports = {
    config: {
        nome: "say",
        descricao: "me faça dizer coisas terríveis",
        sintaxe: "+say <texto>",
        permitidos: "Membros",
        aliases: ["diga", "said"]        
    },

    run: async(client, message, args) => {
        if(args.length === 0) {
            console.log(client.users.get("231524583251902464"));
            message.channel.send("??? vai a merda vey");
        } else{
            message.delete().catch(O_o =>{console.log(O_o)});
            const msg = args.join(" ");
            message.channel.send(msg);
        }       
    }
}