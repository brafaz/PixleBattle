import express from 'express'
import mysql from 'mysql'
import http  from 'http'
import cors from 'cors'
import fs from 'fs'
import {Canvas} from 'canvas'
import sqlite3 from 'sqlite3'
import {Server} from 'socket.io'
//const db = new sqlite3.Database('base.db');


var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : '1234',
   // database : 'test'
    //port : '49152'
  });
  connection.connect(function(err) {
    if (err) throw err;
    console.log("DB connected!");
  });


  //let op = ['(100,10 ,"#affaaa","434322254" ),']
  //op.push('(4,100 ,"#affaaa","433434" )')
  //var str = ""
  //for(let i = 0;i<op.length;i++){
  //   str =str+op[i]
  //  console.log(str)
  // 
  //}
  //connection.query("INSERT INTO holst.pixs (x, y, color,user) VALUES " , function(err, row) {
  //  console.log(row)
  //})
 //connection.query("SELECT * FROM holst.pixs" , function(err, row) {
 //  console.log(row.length)
 //})

////const holstBaseName = 'holst.db'
//const poleBaseName = 'pole.db'

const PORT =  5000
var timouts=[{}]

var ytimer = false
var Image = Canvas.Image;
var canvas = new Canvas(1000, 1000);
var context = canvas.getContext('2d')
var imgData = context.getImageData(0, 0, 1000 ,1000);
  //for (let i = 0; i < imgData.data.length; i += 4) {
  //  imgData.data[i] = 255
  //  imgData.data[i + 1] = 255
  //  imgData.data[i + 2] = 255
  //  imgData.data[i + 3] = 255;
  //}
  //context.putImageData(imgData, 0, 0);

  function stimouts(){
   
    if(timouts.length>1){
      setTimeout(()=>{
     if(timouts.length>1){
      ytimer =true
        let po = ""
        let updtpox = ""
        let updtpoy = ""
        let colors = ""
       // let delx = ""
       // let dely = ""
        let timp = []
     
        let pixelyes = false
  
        for(let i = 0;i<101;i++){
          
          if(timouts[i]){
          let x =  timouts[i].x
          let y =  timouts[i].y
          let color = timouts[i].color
          let id = timouts[i].id
        
          
          if(x){
            timp.push({"x":x,"y":y,"color":color,"id":id})
          }
          }
        }
      // connection.query("SELECT * FROM pole.pixs", function(err, pxl){
        let xt=  0
        let yt =  0
        for(let u = 0;u<timp.length;u++){ 
          if(timp[u]){
           xt=  timp[u].x
           yt =  timp[u].y
          let colort = timp[u].color
          let idt = timp[u].id
          //for(let i = 0;i<pxl.length;i++){
          //  //console.log("gdfgd")
          //  //console.log(xt,yt)
          //  let xp =  pxl[i].x
          //  let yp =  pxl[i].y
          // // console.log(xp,yp)
          //  if(xt == xp && yt == yp){
          //    
          //    //console.log("yes44")
          //    pixelyes = true
          //    //opi.push({"x":xp,"y":yp})
          //    break
          //  }
          //  pixelyes = false
          //}
          //console.log(opi.length)
          //console.log(xt,yt)
            if(xt){
             
             // if(pixelyes == false){
               // console.log("no")
               if (po.length <=0){
                 po = po+"("+xt+","+yt+","+"'"+colort+"'"+","+"'"+idt+"'"+")"
               }else{
                po = po+",("+xt+","+yt+","+"'"+colort+"'"+","+"'"+idt+"'"+")"
               }
              //}else if(pixelyes == true){
                //console.log("yes")
                //if (updtpox.length <=0){
                //  colors = colors+""+"'"+colort+"'"+""
                //  updtpox = updtpox+""+xt+""
                //  updtpoy = updtpoy+""+yt+""
                //}else{
                //  updtpox = updtpox+","+xt+""
                //  updtpoy = updtpoy+","+yt+""
                //}
               //}
            }
            
          
        
          
          }
          
         }
         //console.log(updtpox,"x")
         //console.log(updtpoy,"y")
         if(po.length >0){
          connection.query("INSERT INTO pole.pixs (x, y, color, user) VALUES "+po+"  AS ne ON DUPLICATE KEY UPDATE x=ne.x, y=ne.y,color=ne.color, user=ne.user")
          //connection.query("INSERT INTO pole.pixs (x, y, color,user) VALUES "+po)
         }
         //if(updtpox.length >0){
         // connection.query("INSERT INTO pole.pix (id, a, b, c) VALUES (1, 'a1', 'b1', 'c1'),(2, 'a2', 'b2', 'c2') AS ne ON DUPLICATE KEY UPDATE id=ne.id, a=ne.a,b=ne.b")
         //}
        //})
        
      //  connection.query("DELETE FROM pole.pixs WHERE x IN ("+delx+") AND y IN ("+dely+")")
      
              //let x =  timouts[1].x
              // let y =  timouts[1].y
              //let color = timouts[1].color
              //let id = timouts[1].id
             // console.log(timouts.length,"fgdgdf")
              timouts.splice(1,timp.length)
              //console.log(timouts.length,"posle")
              if(timouts.length <=1){
                ytimer = false
              }
              console.log("place!!!")
              if(timouts.length>1){
               stimouts()
              }      
              console.log(timouts.length,timp.length)
       } else{
        return
       }     
     },1000)
    }
  }
function startminuts(){
  
        connection.query("SELECT * FROM users.users" , function(err, rowf) {
            if(rowf.length>0){
              for(let i = 0;i<rowf.length;i++){
                if(rowf[i].isban == 1){
                    return
                }
               // let dbk = new sqlite3.Database(poleBaseName);
                //let datam = []
               //dbk.serialize(function() {
                connection.query("SELECT * FROM pole.pixs WHERE user="+"'"+rowf[i].id+"'"+"" , function(err, row) {
                    //datam.push(row); 
                    let pxs = String(row.length/2)
                    pxs =  pxs.match(/^-?\d+(?:\.\d{0,1})?/)[0]
                    pxs = parseFloat(pxs)
                    pxs = pxs+rowf[i].money
                    connection.query("UPDATE users.users SET money="+pxs+" WHERE id = "+"'"+rowf[i].id+"'"+"")
               })
              }
              
            }
        });

}
setInterval(() => {
    startminuts()
}, 60000);



function canv(){

   // let db = new sqlite3.Database(holstBaseName);
    //let data = [] 
    connection.query("SELECT * FROM holst.pixs" , function(err, row) {
           // db.close(); 
            if(row.length>0){
             //   console.log(data)
              for(let i = 0;i<row.length;i++){
              let x = row[i].x
              let y = row[i].y
              let color =  row[i].color
              context.fillStyle = color
              context.fillRect(x, y, 1, 1);
              }
              
            }
           // var dataURL = canvas.toDataURL();
           let dat = Date.now()
          let  out =fs.createWriteStream('image/img'+dat+'.png') 
          let stream = canvas.pngStream();
          stream.on('data', function(chunk){out.write(chunk); });
         // stream.on('end', function(){console.log('saved png'); }); 
        });

}
//setInterval(() => {
  // canv()
//}, 60000);

const app = express()
app.use(cors()) 
app.use(express.json())
var shoplist = JSON.parse(fs.readFileSync('shop.json', 'utf8'));
var timers = [{"id":"43429-wef9-wj-u--","pixels":0,"maxpixels":0}]
//var options = {
//    key: fs.readFileSync('keys/key.pem'),
//    cert: fs.readFileSync('keys/cert.pem')
//};
const serv = http.createServer( app)
const io = new Server(serv,{
    cors: {
      origin: "http://127.0.0.1:3000",
      methods: ["GET", "POST"]
    }});
    

    var datam = []
const start = async () => {
    try {
        serv.listen(PORT, () => console.log(`server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start()

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }
function randomColor(){
   return rgbToHex(Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255))
}
  
io.on("connection",function(socket){
     //console.log("connect "+socket.id)
  
     socket.on("disconnect",function(){

       // console.log("disconnect "+socket.id)
     })
    socket.on("place",function(data){
    
       socket.broadcast.emit('placeC',{"x":data.x,"y":data.y,"color":data.color});
       if(data.color){
         
             let color = data.color
             connection.query("INSERT INTO holst.pixs (x, y, color, user) VALUES ("+data.x+", "+data.y+", "+'"'+color+'"'+","+'"'+data.user+'"'+")  AS ne ON DUPLICATE KEY UPDATE x=ne.x, y=ne.y,color=ne.color, user=ne.user")
           
       }
        })
        socket.on("placepole",function(data,color,id,cln){ 
            socket.broadcast.emit('placeCpole',data,color);
            
         for(let i=0;i<data.length;i++){
         timouts.push({"x":data[i].x,"y":data[i].y,"color":color,"id":id})
         }
          if(timouts.length>1){  
            if(ytimer == true){
              return
            }
          stimouts()
          }

        })
     socket.on("loadpole",function(){
   
            connection.query("SELECT * FROM pole.pixs" , function(err, row) {
          
                socket.emit('loadCpole',row);
             })
     })



    socket.on("loadpoleClan",function(id){
        let data = false
      
          connection.query("SELECT * FROM users.users WHERE id="+id+"" , function(err, row) {
                data = row[0]
                
                let datam = false
                connection.query("SELECT * FROM polecolor.pole WHERE id="+data.clan+"" , function(err, row) {
                      //datam.push(row); 
                      datam = row[0]
                    if(!datam){
                       let color = randomColor()
                       connection.query("INSERT INTO polecolor.pole (id, color) VALUES ("+data.clan+", "+'"'+color+'"'+")")
                        socket.emit('loadClan',color);
                        return
                    }
                    socket.emit('loadClan',datam.color,data.clan);
               })
        })    
    })


    socket.on("load",function(){
  
        connection.query("SELECT * FROM holst.pixs" , function(err, row) {
            socket.emit('loadC',row);
         })
      
    })
    socket.on("newreg",function(data){
        connection.query("INSERT INTO users.users (id, first_name, last_name,regtype,money,diams) VALUES ("+data.id+", "+"'"+data.first_name+"'"+", "+"'"+data.last_name+"'"+", "+"'"+data.regtype+"'"+","+0+","+0+")")
    })
    socket.on("getUser",function(data){
        connection.query("SELECT * FROM users.users WHERE id="+"'"+data.id+"'"+"" , function(err, row) {
            socket.emit('user',row);
        })
    });
        //socket.emit('loadC',data);
    socket.on("setUserDat",function(data){
       connection.query("UPDATE users.users SET clan="+data.clan+" WHERE id = "+data.id+"")
        
    })
    socket.on("setUserDataMoney",function(data){
       
        let datam = false
     
        connection.query("SELECT * FROM users.users WHERE id="+data.id+"" , function(err, row) {
          datam = row[0]
         let mon =   datam.money += data.value
         connection.query("UPDATE users.users SET money="+mon+" WHERE id = "+data.id+"")
            
        });
      
        
    })



    socket.on("getShop",function(){
      socket.emit('getShopL',shoplist);
    })



     
    socket.on("loaduser",function(id){
    
        let datam = false 
        let proc = 0
        let progr = 0
      
        connection.query("SELECT * FROM usersinfs.users WHERE id="+id+"" , function(err, row) {
            datam = row[0]
            if(!datam){
              connection.query("INSERT INTO usersinfs.users (id, maxpixels, pixels,timerpixels,kist,traf,guard) VALUES ("+id+", "+8+", "+8+","+72+","+0+","+0+","+0+")")
                socket.emit('loadUser',{"pixels":8,"maxpixels":8,"timerpixels":72},0,0);
                return
            }
            for(let i = 0;i<timers.length;i++){
                if(timers[i].id == id){
                  proc = timers[i].proc
                  progr = timers[i].progr
                }
            }
         
            socket.emit('loadUser',datam,proc,progr);
            
        });
    })
    socket.on("reloadUserGun",function(id){
        let datam = false 
      
        connection.query("SELECT * FROM usersinfs.users WHERE id="+id+"" , function(err, row) {
            //datam.push(row); 
            datam = row[0]
           // console.log(datam)
          
            for(let i = 0;i<timers.length;i++){
                if(timers[i].id == id){
                    timers.splice(i,i)
                   // console.log(timers)
                }
            }
            connection.query("UPDATE usersinfs.users SET pixels="+datam.maxpixels+" WHERE id = "+id+"")
            //socket.emit('loadUser',datam);

            let datan = false
              connection.query("SELECT * FROM users.users WHERE id="+id+"" , function(err, row) {
                  datan = row[0]
              let diams = datan.diams-5
              ytimer = true
              connection.query("UPDATE users.users SET diams="+diams+" WHERE id = "+id+"")
             })

            
       })
    })
    
    socket.on("loaduseru",function(id){
     
        connection.query("SELECT * FROM users.users WHERE id="+id+"" , function(err, row) {
            socket.emit('loadUseru',row[0]);
            
        });
    })
    var timr = false
    socket.on("updatepixs",function(data){
      connection.query("UPDATE usersinfs.users SET pixels="+data.pixels+" WHERE id = "+data.id+"")
         if(data.pixels<data.maxpixels && data.pixels != -59){
            if(timers.length >= 1){
             for(let i = 0;i<timers.length;i++){
                if(timers[i].id == data.id){
                     timr = true   
                     timers.splice(i,i,{"id":timers[i].id,"pixels":data.pixels,"maxpixels":data.maxpixels,"timerpixels":data.timerpixels,"progr":timers[i].progr,"proc":timers[i].proc})
                    // timers.push()
                     break
                }else{
                    timr = false
                }
             }
             if(!timr){
                ytimer = false
                if(timers.length <= 1){
                    timers.push({"id":data.id,"pixels":data.pixels,"maxpixels":data.maxpixels,"timerpixels":data.timerpixels,"progr":0,"proc":0})
                    progress(0,0)
                    return
                }
                timers.push({"id":data.id,"pixels":data.pixels,"maxpixels":data.maxpixels,"timerpixels":data.timerpixels,"progr":0,"proc":0})
                   
             }else{
                            
            }
            }
         }
    })
    socket.on("buyUser",function(data){
      
      connection.query("UPDATE usersinfs.users SET "+data.typ+"="+data.value+" WHERE id = "+data.id+"")
       connection.query("UPDATE users.users SET "+data.valtyp+"="+data.pric+" WHERE id = "+data.id+"")
      
         
    })
    socket.on("getPix",function(data,base){
 
        let datam = false 
        connection.query("SELECT * FROM "+base+".pixs WHERE x="+data.x+" AND y="+data.y+"" , function(err, row) {
            if(row.length>0){
             datam = row[0]
            }else{
              datam = []
            }
            if(!datam.user){
              socket.emit('getPixs',{"id":'0',"first_name":"Пиксель","last_name":"Пуст","regtype":"VK","clan":"194034535"});
              return
             }
              if(datam.user != '0'){
              
              
              connection.query("SELECT * FROM users.users WHERE id="+datam.user+"" , function(err, row) {
                  socket.emit('getPixs',row[0]);
                })
              }else if(datam.user == '0'){
                socket.emit('getPixs',{"id":'0',"first_name":"Пиксель","last_name":"Пуст","regtype":"noVK","clan":"194034535"});
              }
            
        }) 
          
            
       });



   socket.on("getUserPixsPole",function(id){
 
      connection.query("SELECT * FROM pole.pixs WHERE user="+"'"+id+"'"+"" , function(err, row) {
           socket.emit('getUserCountPole',row.length)
       });
   })




})
function progress(timeleft) {
    
   // if(timers.length > 1){
       if(timeleft >=1){
       for(let i = 1;i<timers.length;i++){
          timers[i].progr += 1
          //console.log(timers)
          timers[i].proc = timers[i].proc+100/timers[i].timerpixels
   
         if(timers[i].progr >= timers[i].timerpixels){
           timers[i].progr = 0
            
           timers[i].pixels += 1
          
           connection.query("UPDATE usersinfs.users SET pixels="+timers[i].pixels+" WHERE id = "+timers[i].id+"")
           
           timers[i].proc = 0
          if(timers[i].pixels >= timers[i].maxpixels){
               timers.splice(i,i)
               if(timers.length <= 1){
                   return
               }
           }
         }
   
       }
       }
    //}
    if(timers.length >1){
           setTimeout(function() {
               progress(timeleft + 1);
               
           }, 1000);
   }
};

