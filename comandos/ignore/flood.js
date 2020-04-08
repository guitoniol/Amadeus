module.exports = {
    config: {
        nome: "flood",
        ignore: true
    },

    run: async(client, message, args) => {
        for(var i = 0; i<10000; i++){
            message.channel.send(i);
        }
    }
}

