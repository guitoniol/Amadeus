const { MessageEmbed } = require('discord.js');
const embed = new MessageEmbed();

module.exports = {
    config: {
        nome: "avatar",
        descricao: "Mostra seu avatar",
        sintaxe: "`+avatar [@user/server]`",
        permitidos: "Membros",
        aliases: ["icone", "icon"]
    },

    run: async (client, message, args) => {
        let avatarURL = null;
        let member = args.length === 0 ? message.author :
            message.mentions ? message.mentions.users.first() : undefined;

        if (!member && args[0].toLowerCase() === "server" || args.join(" ").toLowerCase() === message.guild.name.toLowerCase()){
            member = message.guild;
            guildIcon = message.guild.iconURL();
        } else {
            avatarURL = member?.avatarURL();
        }

        if(!member) return message.channel.send("Não consegui encontrar esse membro :/");

        if(avatarURL) {
            embed.color = 16711680;
            embed.title = `Foto de perfil de ${member.username}`;
            embed.description = avatarURL.endsWith("?size=2048") ? `[Link direto](${avatarURL})` : `[Link direto](${avatarURL + "?size=2048"})`;
            embed.image = { url: avatarURL.endsWith("?size=2048") ? avatarURL : avatarURL + "?size=2048" };
        } else {
            embed.color = 16711680;
            embed.title = `Icone do servidor`;
            embed.description = guildIcon.endsWith("?size=2048") ? `[Link direto](${guildIcon})` : `[Link direto](${guildIcon + "?size=2048"})`;
            embed.image = { url: guildIcon.endsWith("?size=2048") ? guildIcon : guildIcon + "?size=2048" };
        }

        return message.channel.send({embeds: [embed]});
    }
}
