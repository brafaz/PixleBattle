const express = require('express');
var fs = require('fs');
const path = require('path');
//var https = require('https');
//var privateKey  = fs.readFileSync('keys/key.pem')
//var certificate = fs.readFileSync('keys/cert.pem')
const PORT = 3000

//var credentials = {key: privateKey, cert: certificate};
const app =express()
app.use(express.static(__dirname))
app.use(express.static(path.resolve(__dirname,'build')))

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname,'build','index.html'))
})
app.listen(PORT,()=>{
 console.log("Слушаю порт "+PORT)
})
//var httpsServer = https.createServer( credentials,app);
//httpServer.listen(8080);
//httpsServer.listen(PORT);