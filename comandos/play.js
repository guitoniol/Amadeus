const Ytdl = require('ytdl-core');

async function play(client, message){        
    link = client.servers.get(message.guild.id).get("fila")[0];      
    client.servers.get(message.guild.id).set("djID", message.member.id);
    let musica = Ytdl(link);
    
    setTimeout(() => {
        Ytdl.getInfo(link, (err, info) => {
            let title = info.title;
            let minutes = Math.round(info.length_seconds/60);
            let seconds = info.length_seconds % 60;
            minutes = minutes < 10? '0' + minutes : ''+minutes;
            seconds = seconds < 10? '0' + seconds : ''+seconds;
        
            message.channel.send(`:musical_note: Tocando **${title} (${minutes}:${seconds})** adicionado por **${message.member.user.username}**`);   
        })
    }, 1000);     

    message.member.voiceChannel.connection.playStream(musica).on('end', () => {
        client.servers.get(message.guild.id).get("fila").shift();            
        
        if(client.servers.get(message.guild.id).get("fila").length > 0)                     
            play(client, message);                        
        else{
            message.member.voiceChannel.leave();
            message.channel.send(":white_check_mark: Fila concluída!")
            client.servers.get(message.guild.id).set("tocando", false);
        }
    });                
}

module.exports = {
    config: {
        nome: "play",
        descricao: "musica tuts tuts",
        sintaxe: "`+play` <link do youtube>",
        permitidos: "Membros",
        aliases: ["song"]
    },

    run: async(client, message, args) => {     
        if(!message.member.voiceChannel) return message.channel.send("você precisa estar em um canal de voz");
        if(args.length === 0) return message.channel.send("'-'")
        if(!Ytdl.validateURL(args[0])) return message.channel.send("link inválido! (tem que ser do youtube)");
        
        if(!message.guild.voiceConnection)
            if(message.member.voiceChannel.joinable) 
                await message.member.voiceChannel.join().then(
                    message.channel.send(`:white_check_mark: Sucesso ao conectar em ${message.member.voiceChannel.name}`)
                );                 
            else
                return message.channel.send(`Não foi possível conectar em ${message.member.voiceChannel.name}`)
        
        fila = await client.servers.get(message.guild.id).get("fila");
        await fila.push(args[0]);
        
        if(fila.length > 1){
            Ytdl.getInfo(args[0], (err, info) => {
                let title = info.title;
                let minutes = Math.round(info.length_seconds/60);
                let seconds = info.length_seconds % 60;
                minutes = minutes < 10? '0' + minutes : ''+minutes;
                seconds = seconds < 10? '0' + seconds : ''+seconds;

                message.channel.send(`:white_check_mark: **${title} (${minutes}:${seconds})** foi adicionado a fila com sucesso!`);
            });            
        }
    
        client.servers.get(message.guild.id).set("tocando", true);
        if(fila.length === 1) 
            play(client, message).catch(err => {
                console.log(err);
                message.channel.send(`Ops, deu algum problema: \`${err.message}\``);
            })
        
    }
}
