const Ytdl = require('ytdl-core');

function play(client, message) {        
    link = client["filas"].get(message.guild.id)[0];        

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
    
    let musica = Ytdl(link);        

    setTimeout(() => {
        message.member.voiceChannel.connection.playStream(musica).on('end', () => {
            client["filas"].get(message.guild.id).shift();            
            if(client["filas"].get(message.guild.id).length > 0)                     
                play(client, message);                        
            else{
                message.channel.send(":white_check_mark: Fila concluída!")
                message.member.voiceChannel.leave();
                client["tocando"].set("tocando", "false");
            }
        });                
    }, 1500);
    
}

module.exports = {
    config: {
        nome: "play",
        descricao: "musica tuts tuts",
        sintaxe: "`+play` <link do youtube>",
        permitidos: "quem quiser",
        aliases: ["song"]
    },

    run: async(client, message, args) => {         
        if(!message.member.voiceChannel) return message.channel.send("você precisa estar em um canal de voz");
        if(!Ytdl.validateURL(args[0])) return message.channel.send("link inválido! (tem que ser do youtube)");
        
        if(!message.guild.voiceConnection) await message.member.voiceChannel.join()
            .then(message.channel.send(`:white_check_mark: Sucesso ao conectar em ${message.member.voiceChannel.name}`));                 
        
        client["filas"].get(message.guild.id).push(args[0]);
        fila = await client["filas"].get(message.guild.id);         
        
        
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
                
        client["tocando"].set("tocando", "true");
        if(fila.length === 1) try{ play(client, message)} catch(err) {console.log(err); message.channel.send(err)};
    }
}

