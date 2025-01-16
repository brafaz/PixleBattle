import React from 'react'
import './PolePage.css';
import { useEffect ,useState} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {registerUser } from '../redux/features/auth/authSlice'
import { Navbar } from '../components/Navbar'
import { NavLink } from 'react-router-dom';
import io from "socket.io-client"
import notify from '../utils/notify'
import dialog from '../utils/dialog'
//import socket from '../utils/io'
import bridge from '@vkontakte/vk-bridge';
export const PolePage = () => {
  const socket = io("https:///127.0.0.1:5000");
  const user = JSON.parse(localStorage.getItem('user'))
  var range = 0
//  var [loading, setLoad] = useState(false);
var diams = 0
  var scale = 3,
  panning = false,
  pointX = 100,
  pointY = 80,
  start = { x: 0, y: 0 }
  var timerkist = false
  var kist = false
  var ban = 0
  var minZoom = 1.2
  var maxZoom = 50
  var color = '0'
  var clan = '0'
  var startm = { x: 0, y: 0 }
  var mov = false
  var bombsCount = 0
  var maxBombs = 0
  var timerbombs = 0
  var bombtimer = false
  var goIdUser = '0'
 var goIdClan = '0'
  function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }
 function declOfNum(n) {  
  n = Math.abs(n) % 100; 
  var n1 = n % 10;
  if (n > 10 && n < 20) { return "Бомбочек"; }
  if (n1 > 1 && n1 < 5) { return "Бомбочки"; }
  if (n1 == 1) { return "Бомбочка"; }
  return "Бомбочек";
}
  function progress(timeleft, timetotal, elm,prc) {
   // console.log(timeleft,timetotal)
    if(timeleft >=1){
      var progressBarWidth = prc+100/timetotal;
     let w = elm.style.width
     let r = w.replace("%","")
      let bmb = document.getElementById('bombcount')
      if(bmb != null){  
        //socket.emit('loaduser',user[0].id);
        
      }else{
        return
      }
      elm.style.width = Math.floor(r)+Math.floor(progressBarWidth)+"%"
    }
    
    
    if(timeleft === timetotal){
      elm.style.width = "100%"
      setTimeout(function() {
        elm.style.width = "0%"
        bombsCount++
        let bombln = declOfNum(bombsCount)
        let bmbb = document.getElementById('bombcount')
    bmbb.innerHTML = bombsCount+" "+bombln
       
        if(bombsCount < maxBombs){
          bombtimer = true
          progress(timeleft - timeleft, timetotal, elm,0);
          return
        } 
        bombtimer = false
     }, 1000);
    }
    if(bombtimer){
     if(timeleft < timetotal) {
       setTimeout(function() {
           progress(timeleft + 1, timetotal, elm,0);
           
       }, 1000);
      }
    }else{
      elm.style.width = "0%"
    }
  }
  function goUser(){
    if(goIdUser == '0'){
     return
    }
     window.open("https://vk.com/id"+goIdUser)
   }
   function goClan(){
     if(goIdClan == '0'){
      return
     }
      window.open("https://vk.com/"+goIdClan)
    }
 function placePixel (x,y){
  //if(range == 0 ){
  //  return
  //}
  if(ban == 1){
    return
  }
  let zoomt = document.getElementById("holstpole");
  let rect = zoomt.getBoundingClientRect()
    let xn = x - rect.left
    let yn = y - rect.top
    var xst = xn/scale
    var yst = yn/scale
   var mx =Math.floor(xst) 
   var my= Math.floor(yst)
   var pixelsli =  []
   var minusbombs = 0
   var ctx = zoomt.getContext("2d");
   var sendendPixels =[]
   if (range == 0){
   // if(target.id == "holst"){
      socket.emit('getPix',{"x":Math.floor(xst),"y":Math.floor(yst)},'pole');  
      let inf = document.getElementById('info')
      inf.style.display ='block'
      let infcords = document.getElementById('infcords')
      infcords.innerHTML = "x: "+Math.floor(xst)+" y: "+Math.floor(yst)
    //}
    return
  }
    if(range == 1){
      //var pixel = ctx.getImageData(xst, yst, 1, 1);
      //var data = pixel.data;
      let pix = {"x":mx,"y":my}
      pixelsli.push(pix)
      minusbombs = pixelsli.length
     //if(data[0] === 255 && data[1]=== 255&&data[2]=== 255&&data[3]===0){
     // ctx.fillStyle = color;
     // ctx.fillRect(Math.floor(xst), Math.floor(yst), 1, 1);
     //}
    }
    if(range >= 5){
      for(let i = 0;i<range;i++){
        let pix = {}
        if(i === 0){
         pix = {"x":mx,"y":my}
         pixelsli.push(pix)
        }
        if(i === 1){
          pix = {"x":mx+1,"y":my}
          pixelsli.push(pix)
        }
        if(i === 2){
          pix = {"x":mx-1,"y":my}
          pixelsli.push(pix)
         }
         if(i === 3){
          pix = {"x":mx,"y":my+1}
          pixelsli.push(pix)
         }
         if(i === 4){
          pix = {"x":mx,"y":my-1}
          pixelsli.push(pix)
          minusbombs = pixelsli.length
         }
      }
    }
    if(range >= 9){
      for(let i = pixelsli.length;i<range;i++){
        let pix = {}
        if(i === 5){
          pix = {"x":mx-1,"y":my+1}
          pixelsli.push(pix)
        }
        if(i === 6){
         pix = {"x":mx+1,"y":my-1}
         pixelsli.push(pix)
        }
        if(i === 7){
         pix = {"x":mx-1,"y":my-1}
         pixelsli.push(pix)
        }
        if(i === 8){
          pix = {"x":mx+1,"y":my+1}
          pixelsli.push(pix)
          minusbombs = pixelsli.length
        }
      }
    }
    if(range >= 13){
      for(let i = pixelsli.length;i<range;i++){
        let pix = {}
         if(i === 9){
          pix = {"x":mx,"y":my-2}
          pixelsli.push(pix)
         }
         if(i === 10){
          pix = {"x":mx,"y":my+2}
          pixelsli.push(pix)
         }
         if(i === 11){
          pix = {"x":mx-2,"y":my}
          pixelsli.push(pix)
         }
        if(i === 12){
          pix = {"x":mx+2,"y":my}
          pixelsli.push(pix)
          minusbombs = pixelsli.length
        }
      }
    }
    if(range >= 25){
      for(let i = pixelsli.length;i<range;i++){
        let pix = {}
         if(i === 13){
          pix = {"x":mx,"y":my-3}
          pixelsli.push(pix)
         }
         if(i === 14){
          pix = {"x":mx,"y":my+3}
          pixelsli.push(pix)
         }
         if(i === 15){
          pix = {"x":mx-3,"y":my}
          pixelsli.push(pix)
         }
        if(i === 16){
          pix = {"x":mx+3,"y":my}
          pixelsli.push(pix)
        }
        if(i === 17){
          pix = {"x":mx+2,"y":my-1}
          pixelsli.push(pix)
         }
         if(i === 18){
          pix = {"x":mx+2,"y":my+1}
          pixelsli.push(pix)
         }
         if(i === 19){
          pix = {"x":mx+1,"y":my-2}
          pixelsli.push(pix)
         }
         if(i === 20){
          pix = {"x":mx-1,"y":my-2}
          pixelsli.push(pix)
        }
        if(i === 21){
          pix = {"x":mx-2,"y":my-1}
          pixelsli.push(pix)
         }
         if(i === 22){
          pix = {"x":mx-2,"y":my+1}
          pixelsli.push(pix)
         }
         if(i === 23){
          pix = {"x":mx-1,"y":my+2}
          pixelsli.push(pix)
         }
        if(i === 24){
          pix = {"x":mx+1,"y":my+2}
          pixelsli.push(pix)
          minusbombs = pixelsli.length
        }
      }
    }
    for(let i = 0;i<pixelsli.length;i++){
      let x = pixelsli[i].x
      let y = pixelsli[i].y
      let pixel = ctx.getImageData(x, y, 1, 1);
      let data = pixel.data;
     
      if(data[0] != 0 && data[1]!= 0&&data[2]!= 0&&data[3]!=0){
        if(color === rgbToHex(data[0],data[1],data[2])){
          minusbombs -=1
          
        }else{
          if(bombsCount<minusbombs){
            notify("Нехватает бомбочек!")
            return
          }
          
          sendendPixels.push({"x":x,"y":y})
         ctx.fillStyle = color;
         ctx.fillRect(x, y, 1, 1);
        }
      }else {
        minusbombs -=1
      }
      

     }
     
     if(pixelsli.length>0){
      socket.emit('placepole',sendendPixels,color,user[0].id,clan);
      bombsCount -= minusbombs
      var bomblel = declOfNum(bombsCount)
      socket.emit('updatepixs',{"pixels":bombsCount,"id":user[0].id,"maxpixels":maxBombs,"timerpixels":timerbombs});
      let bmb = document.getElementById('bombcount')
      bmb.innerHTML = bombsCount+" "+bomblel
     }
     if(bombsCount < maxBombs){
      let el = document.getElementById('reload')
      el.style.display = "block"
      if(!bombtimer){
      let prgr = document.getElementById('progr')
      bombtimer = true
      progress(0, timerbombs, prgr,0);
      }
     }
 }
 socket.on("loadUser",function(data,proct,progrt){
  bombsCount = data.pixels
  maxBombs = data.maxpixels
  timerbombs = data.timerpixels
  let proc = proct
  let progr = progrt
  let elm = document.getElementById('progr')
  //elm.style.width = proc+"%"
  //var pixelel = "Пикселей"
 let bombleln =declOfNum(bombsCount);
     let bombl = document.getElementById('bombcount')
     bombl.innerHTML = bombsCount+" "+bombleln
     if(bombsCount >=maxBombs){
      let el = document.getElementById('reload')
      el.style.display = "none"
    }
  if(bombsCount < maxBombs){
    let el = document.getElementById('reload')
      el.style.display = "block"
   if(!bombtimer){
  // let prgr = document.getElementById('progr')
   bombtimer = true
   progress(progr, timerbombs, elm,proc);
   }
  }
})
 socket.on("loadClan",function(colord,cland){
   color = colord
   clan = cland
 })
 socket.on("getPixs",function(data){
  let name = data.first_name
  let famil = data.last_name
  let clan = data.clan
  let id = data.id
  let infname = document.getElementById('infname')
  infname.innerHTML = name+" "+famil
  bridge.send('VKWebAppGetGroupInfo', {
    group_id: parseInt(clan)
    })
    .then((data) => { 
      if (data.id) {
        let infgroup = document.getElementById('infgroup')
        infgroup.innerHTML = data.name
        goIdClan = data.screen_name
      }
    })

  if(data.regtype == "noVK"){
    goIdUser = '0'
    return
  }
  goIdUser = id
})
 socket.on("placeCpole",function(data,color){
  //alert(data.length+" "+color)
  var holst = document.getElementById("holstpole");
  var ctx = holst.getContext("2d");
  
  for(let i = 0;i<data.length;i++){
    let x = data[i].x
    let y = data[i].y
    ctx.fillStyle = color
    ctx.fillRect(x, y, 1, 1);
  }
  
  })
  socket.on("loadUseru",function(data){
    ban = data.isban
    diams =data.diams
  })
 
useEffect(()=>{
 // socket.emit('getUserPixsPole',user[0].id);
 socket.emit('loaduseru',user[0].id);
  socket.emit('loaduser',user[0].id);
  socket.emit('loadpoleClan',user[0].id);
  var grid = document.getElementById("gridpole");
  var gridim = document.getElementById("imggrid");
  var zoom = document.getElementById("polebackgr");
  var holst = document.getElementById("holstpole");
  var backstrelka = document.getElementById("backstrelka");
  backstrelka.innerHTML = "<"
  holst.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
  grid.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
  function setTransform() {
    holst.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
    grid.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
  }
 var ctxt = holst.getContext('2d');
  var img = new Image();
img.addEventListener('load', function(){
    ctxt.drawImage(img,0,0);
    socket.emit('loadpole');
});
img.src=require('../imgs/mir.png');
socket.on("loadCpole",function(data){
  var holst = document.getElementById("holstpole");
  var ctx = holst.getContext("2d");
  if(data.length==0){
    setLoadi(false)
  }
  for(let i = 0;i<data.length;i++){
    let pix = data[i]
   ctx.fillStyle = pix.color
   ctx.fillRect(pix.x, pix.y, 1, 1);
   if(i== data.length-1){
   setLoadi(false)
   }
  }
  })

zoom.onmousedown = function (e) {
  e.preventDefault();
  start = { x: e.clientX - pointX, y: e.clientY - pointY };
  let inf = document.getElementById('info')
  inf.style.display ='none'
  panning = true
  mov = true
timerkist = setTimeout(()=>{
  kist = true
  notify("Кисть активирована!")
},1500)
  zoom.onmousemove = function (e) {
      e.preventDefault();
      panning = false
     if(kist){
       placePixel(Math.floor(e.clientX), Math.floor(e.clientY),e.target) 
       return
     }
      if (!mov) {
        return;
      }
  
      let rect = holst.getBoundingClientRect()
      let x = window.innerWidth/2 - rect.left
      let y = window.innerHeight/2 - rect.top
      var xst = x/scale
       var yst = y/scale
       let mx =Math.floor(xst)-50
       let my = Math.floor(yst)-50
       gridim.style.transform = "translate(" + mx + "px, " + my + "px)";
      pointX = (e.clientX - start.x);
      pointY = (e.clientY - start.y);
      setTransform();
  }
  holst.onmousemove = function (e) {
    e.preventDefault();
    var inf = document.getElementById("cords")
    let rect = holst.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top
    var xst = x/scale
    var yst = y/scale
    inf.innerHTML = "x:"+Math.floor(xst)+" y:"+Math.floor(yst)
 } 
  zoom.onmouseup = function (e) {
    kist = false
    clearTimeout(timerkist)
    if(panning == true){
     placePixel(e.clientX,e.clientY) 
    }
    mov = false
    
  }
}
zoom.onwheel = function (e) {
  e.preventDefault();
  let rect = holst.getBoundingClientRect()
  let x = window.innerWidth/2 - rect.left
  let y = window.innerHeight/2 - rect.top
  var xst = x/scale
   var yst = y/scale
   let mx =Math.floor(xst)-50
   let my = Math.floor(yst)-50
   gridim.style.transform = "translate(" + mx + "px, " + my + "px)";
  var xs = (e.clientX - pointX) / scale,
    ys = (e.clientY - pointY) / scale,
    delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
  (delta > 0) ? (scale *= 1.2) : (scale /= 1.1);
 scale = Math.min(Math.max(scale, minZoom), maxZoom)
  pointX =  e.clientX - xs * scale;
  pointY = e.clientY- ys * scale;
  if(scale >= 14){
    gridim.style.display= "block"
  }
  if(scale <= 13){
    gridim.style.display= "none"
  }
  setTransform();
}
var isDragging = false
var movm = true

let cameraZoom = 6
var fingers = 0


function onPointerUp(e)
{
initialPinchDistance = null
lastZoom = cameraZoom
isDragging = false
}
zoom.ontouchend = function(e){
 if(fingers !=0){
  fingers --
  return
 }
 initialPinchDistance = null
 lastZoom = cameraZoom
 if(isDragging == false){
   placePixel(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
 }
 isDragging = false

}
function onPointerMove(e){
   e.preventDefault();
   var inf = document.getElementById("cords")
   let rect = holst.getBoundingClientRect()
   let x = window.innerWidth/2 - rect.left
   let y = window.innerHeight/2 - rect.top
   var xst = x/scale
   var yst = y/scale
   if (Math.floor(xst)>-1&&Math.floor(yst)>-1&&Math.floor(xst)<1000&&Math.floor(yst)<1000){
   inf.innerHTML = "x:"+Math.floor(xst)+" y:"+Math.floor(yst)
   //gridim.style.left = Math.floor(xst)+"px"
   //gridim.style.top = Math.floor(yst)+"px"
   }
   if(fingers !=0){
    return
   }
   if(isDragging == false){
    startm = { x: e.touches[0].clientX  - pointX, y: e.touches[0].clientY - pointY };
    isDragging = true
   }
   if (!movm) {
   return;
   } 
    let mx =Math.floor(xst)-50
    let my = Math.floor(yst)-50
    gridim.style.transform = "translate(" + mx + "px, " + my + "px)";
   pointX = (e.touches[0].clientX - startm.x);
   pointY = (e.touches[0].clientY- startm.y);
   setTransform();
}
function handleTouch(e, singleTouchHandler){
    if ( e.touches.length == 1 )
    {
    singleTouchHandler(e)
    }
    else if (e.type == "touchmove" && e.touches.length == 2)
    {
      fingers = e.touches.length
     isDragging = true
    handlePinch(e)
    }
}

function handlePinch(e)
{
   e.preventDefault()
   
   let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
   let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
   
   let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
   if (initialPinchDistance == null)
   {
   initialPinchDistance = currentDistance
   }
   else
   {
   adjustZoom(e, null, currentDistance/initialPinchDistance )
   }
}
let initialPinchDistance = null
let lastZoom = cameraZoom
function adjustZoom(e,zoomAmount, zoomFactor){

    
  if (zoomAmount)
  {
      cameraZoom += zoomAmount
  }
  else if (zoomFactor)
  {
      cameraZoom = zoomFactor*lastZoom
  }
   var xs = (window.innerWidth/2 - pointX) / scale,
   ys = (window.innerHeight/2 - pointY) / scale
   scale = Math.min(Math.max(zoomFactor*lastZoom, minZoom), maxZoom)
   pointX = window.innerWidth/2 - xs * scale;
   pointY = window.innerHeight/2- ys * scale;
   if(scale >= 14){
    gridim.style.display= "block"
  }
  if(scale <= 13){
    gridim.style.display= "none"
  }
  let rect = holst.getBoundingClientRect()
  let x = window.innerWidth/2 - rect.left
  let y = window.innerHeight/2 - rect.top
  var xst = x/scale
   var yst = y/scale
   let mx =Math.floor(xst)-50
   let my = Math.floor(yst)-50
   gridim.style.transform = "translate(" + mx + "px, " + my + "px)";
   setTransform();
}
 zoom.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
 zoom.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
},[])
function setRange(e,num){
  let el = document.getElementsByClassName('bombs')
  for (let i = 0; i < el.length;i++) {
    var item = el[i];  
    item.style.transform = "scale(1)"
  }
  if(num == range){
    range = 0
    return
  }
  e.currentTarget.style.transform = "scale(1.2)"
  range = num
  
  //alert(num)
}
function setLoadi(bool){
  
  if(bool === true){
   let el = document.getElementById('loadiv')
   el.style.display = "block"
  }
  if(bool === false){
   let el = document.getElementById('loadiv')
   el.style.display = "none"
  }
}
function refr(){
  socket.emit('loaduseru',user[0].id);
  if(diams >= 5 ){
    socket.emit('reloadUserGun',user[0].id);
    bombsCount = maxBombs
    bombtimer = false
    let bombln = declOfNum(bombsCount)
    let bmbb = document.getElementById('bombcount')
    bmbb.innerHTML = bombsCount+" "+bombln
    notify("Пушка перезаряжена")
    return
  }
  notify("Нехватает Алмазов")
 }
  return (
    <div>
      <div id="loadiv"><img style={{width:"100px",position:"relative",top:"30%"}} alt="" src={require('../imgs/loading.gif')}></img><p style={{position:"relative",top:"40%",fontSize:"30px"}}>Загрузка</p></div>
      <div id="notify"></div>
      <div id="reload" onClick={()=>{dialog("Уверены что хотите перезарядить пушку за 5 алмазов ?",0,refr,"Да")}}>Перезарядить</div>
      <div id="info">
        <p onClick={goUser} id="infname"></p>
        <p onClick={goClan} id='infgroup'></p>
        <p id='infcords'>x: 1000 y:1000</p>
      </div>
      <div id='backbar'>
       <div  id='btnback'>
        <NavLink to="/" id='backstrelka' >˂</NavLink>
       </div>
       <p id='cords'>x:0 y:0</p>
      </div>
      <div id='polebackgr'>
      <div alt='' id='gridpole'>
       <img alt='' id='imggrid' src={require('../imgs/grid.png')}></img>
        </div>
       <canvas id='holstpole' width={"1357px"} height={"628px"}></canvas>
      </div>
      <div id='bombsbar'>
      <div id='progrtimer'><div id='progr'></div></div>
        <p id='bombcount'>{bombsCount} Бомбочек</p>
        <div id='bombslist'>
         <img onClick={(e)=>setRange(e,1)} className="bombs" src={require("../imgs/bomb1.png")}></img>
         <img onClick={(e)=>setRange(e,5)} className="bombs" src={require("../imgs/bomb5.png")}></img>
         <img onClick={(e)=>setRange(e,9)} className="bombs" src={require("../imgs/bomb9.png")}></img>
         <img onClick={(e)=>setRange(e,13)} className="bombs" src={require("../imgs/bomb13.png")}></img>
         <img onClick={(e)=>setRange(e,25)} className="bombs" src={require("../imgs/bomb25.png")}></img>
        </div>
      </div>
  
    </div>
       
  )
}
