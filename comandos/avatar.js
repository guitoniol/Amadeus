module.exports = {
    config: {
        nome: "avatar",
        descricao: "Mostra seu avatar",
        sintaxe: "`+avatar [@user/server]`",
        permitidos: "Membros",
        aliases: ["icone", "icon"]
    },

    run: async (client, message, args) => {
        let member = args.length === 0 ? message.author :
            message.mentions ? message.mentions.users.first() : undefined;

        if (!member && args[0].toLowerCase() === "server" || args.join(" ").toLowerCase() === message.guild.name.toLowerCase())
            member = message.guild;

        avatarURL = member.avatarURL();
        guildIcon = message.guild.iconURL();

        return !member ? message.channel.send("Não consegui encontrar esse membro :/") :
            avatarURL ?
                message.channel.send({
                    embed: {
                        color: 16711680,
                        title: `Foto de perfil de ${member.username}`,
                        description: avatarURL.endsWith("?size=2048") ? `[Link direto](${avatarURL})` : `[Link direto](${avatarURL + "?size=2048"})`,
                        image: { url: avatarURL.endsWith("?size=2048") ? avatarURL : avatarURL + "?size=2048" },
                    }
                }).catch(O_o => console.log(O_o))
                :
                message.channel.send({
                    embed: {
                        color: 16711680,
                        title: `Icone do servidor`,
                        description: guildIcon.endsWith("?size=2048") ? `[Link direto](${guildIcon})` : `[Link direto](${guildIcon + "?size=2048"})`,
                        image: { url: guildIcon.endsWith("?size=2048") ? guildIcon : guildIcon + "?size=2048" },
                    }
                }).catch(O_o => console.log(O_o));
    }
}
