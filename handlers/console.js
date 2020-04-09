module.exports = (client) => {    
    return;
    let prompt = process.openStdin();   
    
    
   /* setTimeout(() => {
        client.guilds.forEach(g => {
            setTimeout(() => {
                g.channels.forEach(m => {
                    console.log(m.name + ' id: ' + m.id);
                })                
            }, 2000);            
        })      
    }, 2000);     */

    prompt.addListener("data", res => { 
        let x = res.toString().trim().split(/ +/g);         
        client.channels.get("496087532698861575").send(x.join(" "));                             
    });  
}

    