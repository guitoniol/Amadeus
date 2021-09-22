module.exports = (client) => {    
    return;
    let prompt = process.openStdin();   

    prompt.addListener("data", res => { 
        let x = res.toString().trim().split(/ +/g);         
        client.channels.get("496087532698861575").send(x.join(" "));                             
    });  
}

    