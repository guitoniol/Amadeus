const prefix = "+"
module.exports = async(client, message) => {
    if(message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    let   channel = message.channel;
    var   horaLastMsg;

    if(message.content.indexOf(prefix) === 0){
        let commandFile = client.comandos.get(comando) || client.comandos.get(client.aliases.get(comando));                
        if(!commandFile) return;

        let lvlPermissao = commandFile.config.lvlPermissao;        

        return !lvlPermissao? commandFile.run(client, message, args) : (message.member.permissions & lvlPermissao) !== lvlPermissao?
            channel.send("Você não pode usar esse comando :p") : commandFile.run(client, message, args);
    };

    if(message.content.toLowerCase() === "sandri")
        message.channel.send("fofo");

    /*if(message.content.toLowerCase().indexOf("bom dia") !== -1){        
        let bomDias = ["bom dia grupo!", "BOM DIA GRUPO", "bom dia", "BOM DIA GRUPO!!", "bom dia!!!"];        
        let today = new Date();        

        if(!this.horaLastMsg || this.horaLastMsg<today.getHours()){
            let i = Math.floor(Math.random() * (5 - 0)) + 0;
            channel.send(bomDias[i]);

            this.horaLastMsg = today.getHours();
        }
    }*/
}

