const {readdirSync} = require('fs');

module.exports = (client) => {   
    const load = dir => {        
        const events  = readdirSync(`./eventos/${dir}/`).filter(d => d.endsWith('.js'));                       

        for(let file of events){                        
            const evt = require(`../eventos/${dir}/${file}`);
            let eName = file.split(".")[0];

            client.on(eName, evt.bind(null, client));
        }
    }

    ["guild"].forEach(x => load(x));
}