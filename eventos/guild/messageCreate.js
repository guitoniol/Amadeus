const prefix = "+"
module.exports = async (client, message) => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const comando = args.shift().toLowerCase();
    let channel = message.channel;


    if (message.content.indexOf(prefix) === 0) {
        let commandFile = client.comandos.get(comando) || client.comandos.get(client.aliases.get(comando));
        if (!commandFile) return;

        let lvlPermissao = commandFile.config.lvlPermissao;

        return !lvlPermissao || (message.member.permissions & lvlPermissao) == lvlPermissao? commandFile.run(client, message, args) : channel.send("Você não pode usar esse comando :p");
    };

    if (message.content.toLowerCase() === "sandri")
        message.channel.send("fofo");
    else if (message.content.toLowerCase() === "sandroca")
        message.channel.send("sandroga");
}

