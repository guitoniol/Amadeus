const Ytdl = require('ytdl-core');

async function play(fila, message){            
    let musica = Ytdl(fila[0].link);    

    await message.member.voiceChannel.connection.playStream(musica).on('end', () => {
        fila.shift();                    
        
        if(fila.length > 0){                                 
            message.channel.send(fila[0].msg);
            play(fila, message);                        
        } else{
            message.member.voiceChannel.leave();
            message.channel.send(":white_check_mark: Fila concluída!")            
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
        if(args.length === 0) return message.channel.send(`+play <link> :smile:`);
        if(!Ytdl.validateURL(args[0])) return message.channel.send("link inválido! **(tem que ser do youtube)**"); 
        
        if(!message.guild.voiceConnection) //vendo se já não ta num canal de voz
            if(message.member.voiceChannel.joinable)
                await message.member.voiceChannel.join().then(
                    message.channel.send(`:white_check_mark: Sucesso ao conectar em ${message.member.voiceChannel.name}`));                 
            else
                return message.channel.send(`Não foi possível conectar em ${message.member.voiceChannel.name}`)
        
        let fila = await client.servers.get(message.guild.id).fila;
        let msg = "";
        await fila.push({link: args[0], dj: message.member.id});        

        Ytdl.getInfo(args[0], (err, info) => {
            if(err){
                console.log(err);
                message.channel.send(`Erro '_' \`${err.message}\``)
            } else {
                let title = info.title;
                let minutes = Math.round(info.length_seconds/60);
                let seconds = info.length_seconds % 60;
                minutes = minutes < 10? '0' + minutes : ''+minutes;
                seconds = seconds < 10? '0' + seconds : ''+seconds;
                msg = `:musical_note: Tocando **${title} (${minutes}:${seconds})** adicionado por **${message.member.user.username}**`
                
                if(fila.length > 1) {
                    fila[fila.length-1].msg = msg;
                    message.channel.send(`:white_check_mark: **${title} (${minutes}:${seconds})** foi adicionado a fila com sucesso!`);                    
                } else {
                    message.channel.send(msg);
                }
            }
        });            

        if(fila.length > 1) return;   
        play(fila, message);
    }
}
