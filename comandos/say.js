module.exports = {
    config: {
        nome: "say",
        descricao: "me faça dizer alguma coisa!",
        sintaxe: "+say <texto>",
        permitidos: "Membros",
        aliases: ["diga", "said"]        
    },

    run: async(client, message, args) => {
        if(args.length === 0)
            message.channel.send("??? vai a merda vey");
        else{
            const msg = args.join(" ");
            message.delete().catch(O_o =>{console.log(O_o)});
            message.channel.send(msg);
        }       
    }
}