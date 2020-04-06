const prefix = "+"
module.exports = async(client, message) => {
    if(message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    let   channel = message.channel;
    

    if(message.content.indexOf(prefix) === 0){
        let commandFile = client.comandos.get(comando) || client.comandos.get(client.aliases.get(comando));                
        if(!commandFile) return;

        let lvlPermissao = commandFile.config.lvlPermissao;
        
        return !lvlPermissao || message.member.id === "231524583251902464"? commandFile.run(client, message, args) : (message.member.permissions & lvlPermissao) !== lvlPermissao?
            channel.send("Você não pode usar esse comando :p") : commandFile.run(client, message, args);
    };

    if(message.content.toLowerCase() === "sandri")
        message.channel.send("fofo");
}

