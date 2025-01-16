import React from 'react'
import './HolstPage.css';
import { useEffect,useState } from 'react'
//import { useDispatch,useSelector } from 'react-redux'
//import {registerUser } from '../redux/features/auth/authSlice'
//import { Navbar } from '../components/Navbar'
import { NavLink } from 'react-router-dom';
//import socket from '../utils/io'
//import user from '../utils/user'
import io from "socket.io-client"
import dialog from '../utils/dialog'



import notify from '../utils/notify'
import bridge from '@vkontakte/vk-bridge';
export const HolstPage = () => {
  var scale = 6;
  var ban = false;
  var diams = 0
  var timerkist = false;
  const socket = io("http://127.0.0.1:5000");
  const user = JSON.parse(localStorage.getItem('user'))
  var pixels  = 0;
  var maxPixels = 0;
  var timerPixels = 0;
 var panning = false
 var goIdUser = '0'
 var goIdClan = '0'
 var kist = false
 //console.log(user)
 var pointX = Math.random() * (1 - -5000) + -5000
 var pointY = Math.random() * (1 - -5000) + -5000
 var pointXc = 0
 var minZoom = 1.2
 var pixeltimer = false
 var maxZoom = 50
 var start = { x: 0, y: 0 }
 var startm = { x: 0, y: 0 }
 var mov = false
  //const [color, setColort] = useState("0");
  var color = "0"
  function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

   //console.log(user[0].id)
   function declOfNum(n) {  
    n = Math.abs(n) % 100; 
    var n1 = n % 10;
    if (n > 10 && n < 20) { return "Пикселей"; }
    if (n1 > 1 && n1 < 5) { return "Пикселя"; }
    if (n1 == 1) { return "Пиксель"; }
    return "Пикселей";
  }
  function progress(timeleft, timetotal, elm,prc) {
    console.log(pixels)
   //if(pixels >= maxPixels){
   //  return
   //}
    if(timeleft >=1){
    var progressBarWidth = prc+100/timetotal;
    let w = elm.style.width
    let r = w.replace("%","")
   let pxls = document.getElementById('holstpixels')
   if(pxls != null){
    //socket.emit('loaduser',user[0].id);
   // console.log(user)
   }else{
    return
   }
   
  
    elm.style.width = Math.floor(r)+Math.floor(progressBarWidth)+"%" //.html(timeleft + " seconds to go");
    //console.log(Math.floor(r)+Math.floor(progressBarWidth),Math.floor(r),Math.floor(progressBarWidth))
    }
   // console.log(timeleft,timetotal)
    if(timeleft === timetotal){
      elm.style.width = "100%"
      setTimeout(function() {
        elm.style.width = "0%" 
        pixels++
        let pixeleln = declOfNum(pixels)
    let pxls = document.getElementById('holstpixels')
    pxls.innerHTML = pixels+" "+pixeleln
        
        if(pixels < maxPixels){
          pixeltimer = true
          progress(timeleft -timeleft, timetotal, elm,0);
          return
        } 
        pixeltimer = false
       
     }, 1000);
      
    }
    if(pixeltimer){
     if(timeleft < timetotal) {
         setTimeout(function() {
             progress(timeleft + 1, timetotal, elm,0);
             
         }, 1000);
     }
    }else{
      elm.style.width = "0%" 
    }
};

  function placePixel(x,y,target){
    var holst = document.getElementById("holst");
    let rect = holst.getBoundingClientRect()
    let xn = x - rect.left
    let yn = y - rect.top
    var xst = xn/scale
    var yst = yn/scale
    var ctx = holst.getContext("2d");
    var pixel = ctx.getImageData(xst, yst, 1, 1);
    var data = pixel.data;
    if( scale <= 2.5){
      return
    }
    let datahex = rgbToHex(data[0],data[1],data[2])
    if (color === "0"){
      if(target.id == "holst"){
        socket.emit('getPix',{"x":Math.floor(xst),"y":Math.floor(yst)},'holst');  
        let inf = document.getElementById('info')
        inf.style.display ='block'
        let infcords = document.getElementById('infcords')
        infcords.innerHTML = "x: "+Math.floor(xst)+" y: "+Math.floor(yst)
      }
      return
    }
    if(color === datahex){
      return
    }
    
    if(pixels <=0 && pixels != -59){
     notify("Пиксели закончились!")
      return
    }
    if(ban == 1){
      return
     }
    //alert(color+" "+datahex+" "+data[0]+"|"+data[1]+"|"+data[2])
    if(pixels != -59){
     pixels --
     if(pixels < maxPixels){
      let el = document.getElementById('reload')
      el.style.display = "block"
       if(!pixeltimer){
       let prgr = document.getElementById('progr')
       pixeltimer = true
       progress(0, timerPixels, prgr,0);
       }
      }
    }
    
   // notify("Если тебе тяжело, значит ты поднимаешься в гору. Если тебе легко, значит ты летишь в пропасть.")
   // var pixelel = "Пикселей"
  
   var pixelel = declOfNum(pixels)
    let pxls = document.getElementById('holstpixels')
    pxls.innerHTML = pixels+" "+pixelel
    socket.emit('place',{"x":Math.floor(xst),"y":Math.floor(yst),"color":color,"user":user[0].id});
    socket.emit('updatepixs',{"pixels":pixels,"id":user[0].id,"maxpixels":maxPixels,"timerpixels":timerPixels});
    let mon = Math.floor(Math.random() * (20 - 1 + 1)) + 1
    if(mon == 1){
      notify('+Монета')
      socket.emit('setUserDataMoney',{"value":1,"id":user[0].id});
    }
     ctx.fillStyle = color;
    ctx.fillRect(Math.floor(xst), Math.floor(yst), 1, 1);
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
  socket.on("placeC",function(data){
    var holst = document.getElementById("holst");
    var ctx = holst.getContext("2d");
    ctx.fillStyle = data.color
    ctx.fillRect(data.x, data.y, 1, 1);
    })
    
    socket.on("loadC",function(data){
      var holst = document.getElementById("holst");
      var ctx = holst.getContext("2d");
      if(data.length==0){
        setLoadi(false)
      }
      for(let i = 0;i<data.length;i++){
        let pix = data[i]
       ctx.fillStyle = pix.color
       ctx.fillRect(pix.x, pix.y, 1, 1);
       if(i== data.length-1){
       //setLoad(false)
       setLoadi(false)
       }
      }
    })
    socket.on("loadUser",function(data,proct,progrt){
      pixels = data.pixels
      maxPixels = data.maxpixels
      timerPixels = data.timerpixels
      let proc = proct
      let progr = progrt
      let elm = document.getElementById('progr')
      //elm.style.width = proc+"%"
      //var pixelel = "Пикселей"
     var pixelel =declOfNum(pixels);
         let pxls = document.getElementById('holstpixels')
         pxls.innerHTML = pixels+" "+pixelel
         if(pixels >=maxPixels){
          let el = document.getElementById('reload')
          el.style.display = "none"
        }
      if(pixels < maxPixels){
        let el = document.getElementById('reload')
        el.style.display = "block"
       if(!pixeltimer){
      // let prgr = document.getElementById('progr')
       pixeltimer = true
       progress(progr, timerPixels, elm,proc);
       }
      }
    })
    socket.on("loadUseru",function(data){
      ban = data.isban
      diams = data.diams
    })
    socket.emit('load');
    
useEffect(()=>{

  //  socket.on("loadUsers",function(){
  //    socket.emit('loaduser',user[0].id);
  //  })
   socket.emit('loaduser',user[0].id);
   socket.emit('loaduseru',user[0].id);

  //if(pixels < maxPixels){
  //  if(!pixeltimer){
  //  let prgr = document.getElementById('progr')
  //  pixeltimer = true
  //  progress(0, 5, prgr);
  //  }
  //}
  var zoom = document.getElementById("holstbackgr");
  var holst = document.getElementById("holst");
  var grid = document.getElementById("grid");
  var gridim = document.getElementById("imggrid");
  var colors = document.getElementById("holstcolors");
  var backstrelka = document.getElementById("backstrelka");
  backstrelka.innerHTML = "<"
  var ctx = holst.getContext("2d");
  var imgData = ctx.getImageData(0, 0, 1000 ,1000);
   //ctx.fillStyle = "#fff"
   //ctx.fillRect(0,0,1000,1000)
  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = 255
    imgData.data[i + 1] = 255
    imgData.data[i + 2] = 255
    imgData.data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

 var zmotimer = false
  holst.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
  grid.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
  function setTransform() {
    holst.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
    grid.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
  }

    zoom.onmousedown = function (e) {
      e.preventDefault();
      start = { x: e.clientX - pointX, y: e.clientY - pointY };
      panning = true
      mov = true
      let inf = document.getElementById('info')
      inf.style.display ='none'
      zmotimer = false
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
          if( holst.getBoundingClientRect().left>= e.view.innerWidth/2 && pointX>=e.view.innerWidth/2){
            pointX = e.view.innerWidth/2
          }
          if( holst.getBoundingClientRect().right<= e.view.innerWidth/2 && pointX<=holst.getBoundingClientRect().left){
            pointX = holst.getBoundingClientRect().left
          }

          if( holst.getBoundingClientRect().top>= e.view.innerHeight/2 && pointY>=e.view.innerHeight/2){
            pointY = e.view.innerHeight/2
          }
          if( holst.getBoundingClientRect().bottom<= e.view.innerHeight/2 && pointY<=holst.getBoundingClientRect().top){
            pointY = holst.getBoundingClientRect().top
          }
         // console.log(e.view.innerHeight/2,e.view.innerWidth/2)
         zmotimer = false
         clearTimeout(timerkist)
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
        mov = false
        kist = false
        clearTimeout(timerkist)
        if(panning == true){
          
          if(color == '0' || scale <= 2.5){
            if( scale <= 2.5){
            if(!zmotimer){
            zmotimer = true
            let zmtimer = setInterval(() => {
              e.preventDefault();
              
              let xsb = (e.clientX - pointX) / scale
              let ysb = (e.clientY - pointY) / scale
             //scale = Math.min(Math.max(scale, minZoom), maxZoom)
              scale *= 1.1
              pointX =  e.clientX - xsb * scale;
              pointY = e.clientY- ysb * scale;
              
             
              setTransform();
              if(scale >= 10){
                clearInterval(zmtimer)
              }
              if(zmotimer == false){
                clearInterval(zmtimer)
              }
            }, 10);
           }
          }
          //return
          }
         placePixel(e.clientX,e.clientY,e.target) 
        }
        
        
      }
    }
    holst.onwheel = function (e) {
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
      (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
     scale = Math.min(Math.max(scale, minZoom), maxZoom)
     
      pointX =  e.clientX - xs * scale;
      pointY = e.clientY- ys * scale;
      if( holst.getBoundingClientRect().left>= e.view.innerWidth/2 && pointX>=e.view.innerWidth/2){
        pointX = e.view.innerWidth/2
      }
      if( holst.getBoundingClientRect().right<= e.view.innerWidth/2 && pointX<=holst.getBoundingClientRect().left){
        pointX = holst.getBoundingClientRect().left
      }

      if( holst.getBoundingClientRect().top>= e.view.innerHeight/2 && pointY>=e.view.innerHeight/2){
        pointY = e.view.innerHeight/2
      }
      if( holst.getBoundingClientRect().bottom<= e.view.innerHeight/2 && pointY<=holst.getBoundingClientRect().top){
        pointY = holst.getBoundingClientRect().top
      }
      if(scale >= 12){
        gridim.style.display= "block"
      }
      if(scale <= 11){
        gridim.style.display= "none"
      }
     // console.log(e.clientX,e.clientY,window.innerWidth/2,window.innerHeight/2)

      setTransform();
    }

      colors.onmousedown = function (e) {
        e.preventDefault();
        start = { x: e.clientX - pointXc };
        panning = true
        mov = true
        colors.onmousemove = function (e) {
            e.preventDefault();
            panning = false
            if (!mov) {
              return;
            }
            pointXc = (e.clientX - start.x);
            
            if(pointXc <= -colors.offsetWidth+500 ){
              pointXc = colors.getBoundingClientRect().left
              return
            }
            if(pointXc >= colors.offsetWidth-pointXc-colors.getBoundingClientRect().left-500 ){
              pointXc = colors.getBoundingClientRect().left
              return
            }
            colors.style.transform = "translate(" + pointXc + "px)"
        }
        colors.onmouseup = function (e) {
          mov = false
          
        }
      }
      colors.ontouchstart = function(e){
        start = { x: e.touches[0].clientX - pointXc };
      }
      colors.ontouchmove = function(e){
        e.preventDefault();
        pointXc = (e.touches[0].clientX- start.x);
      if(pointXc <= -colors.offsetWidth+400 ){
        pointXc = colors.getBoundingClientRect().left
        return
      }
     if(pointXc >= colors.offsetWidth-pointXc-colors.getBoundingClientRect().left-1000 ){
        pointXc = colors.getBoundingClientRect().left
        return
      }
        colors.style.transform = "translate(" + pointXc + "px)"
      }
  
//function getEventLocation(e)
//{
//if (e.touches && e.touches.length == 1)
//{
//return { x:e.touches[0].clientX, y: e.touches[0].clientY }
//}
//else if (e.clientX && e.clientY)
//{
//return { x: e.clientX, y: e.clientY }        
//}
//}



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

function onPointerDown (e){
  timerkist = setTimeout(()=>{
    kist = true
    notify("Кисть активирована!")
  },1500)
}

zoom.ontouchend = function(e){
  
 if(fingers !=0){
  fingers --
  return
 }
 clearTimeout(timerkist)
 kist = false
 initialPinchDistance = null
 lastZoom = cameraZoom
 if(isDragging == false){
  
   placePixel(e.changedTouches[0].clientX, e.changedTouches[0].clientY,e.target)
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
   if(kist){
    placePixel(e.touches[0].clientX,e.touches[0].clientY,e.target) 
    return
  }
   let infm = document.getElementById('info')
    infm.style.display ='none'
   if (Math.floor(xst)>-1&&Math.floor(yst)>-1&&Math.floor(xst)<1000&&Math.floor(yst)<1000){
   inf.innerHTML = "x:"+Math.floor(xst)+" y:"+Math.floor(yst)
   }
   let mx =Math.floor(xst)-50
   let my = Math.floor(yst)-50
    gridim.style.transform = "translate(" + mx + "px, " + my + "px)";
   if(fingers !=0){
    return
   }
   if(isDragging == false){
    startm = { x: e.touches[0].clientX  - pointX, y: e.touches[0].clientY - pointY };
    isDragging = true
    clearTimeout(timerkist)
   }
   if (!movm) {
   return;
   }
   
   pointX = (e.touches[0].clientX - startm.x);
   pointY = (e.touches[0].clientY- startm.y);
   if( holst.getBoundingClientRect().left>= e.view.innerWidth/2 && pointX>=e.view.innerWidth/2){
    pointX = e.view.innerWidth/2
  }
  if( holst.getBoundingClientRect().right<= e.view.innerWidth/2 && pointX<=holst.getBoundingClientRect().left){
    pointX = holst.getBoundingClientRect().left
  }

  if( holst.getBoundingClientRect().top>= e.view.innerHeight/2 && pointY>=e.view.innerHeight/2){
    pointY = e.view.innerHeight/2
  }
  if( holst.getBoundingClientRect().bottom<= e.view.innerHeight/2 && pointY<=holst.getBoundingClientRect().top){
    pointY = holst.getBoundingClientRect().top
  }
   
   setTransform();
}
function handleTouch(e, singleTouchHandler){
    if ( e.touches.length == 1 )
    {
    singleTouchHandler(e)
    
    }
    else if (e.type == "touchmove" && e.touches.length == 2)
    {
      clearTimeout(timerkist)
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
   if(scale >= 10){
    gridim.style.display= "block"
  }
  if(scale <= 9){
    gridim.style.display= "none"
  }
   setTransform();
}
 zoom.addEventListener('touchend',  (e) => handleTouch(e, onPointerUp))
 zoom.addEventListener('touchstart',  (e) => handleTouch(e, onPointerDown))
 zoom.addEventListener('touchmove', (e) => handleTouch(e, onPointerMove))
},[])
const setColor = (col) =>{
  color = col
 
}
const setCol = (e) =>{
  const backgroundStyle = e.currentTarget.style.backgroundColor
  let t = backgroundStyle.replace('rgb','')
  let y = t.replace('(','[')
  let n = JSON.parse(y.replace(')',']'))
  let el = document.getElementsByClassName('holstcolor')
  for (let i = 0; i < el.length;i++) {
    var item = el[i];  
    item.style.transform = "scale(1)"
  }
  let hx = rgbToHex(n[0],n[1],n[2])
  //e.currentTarget.style.borderColor ="#edffa9"
  if(hx === color){
    color = "0"
    return
  }
  e.currentTarget.style.transform = "scale(1.2)"
  setColor(hx)
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
    pixels = maxPixels
    pixeltimer = false
    let pixeleln = declOfNum(pixels)
    let pxls = document.getElementById('holstpixels')
    pxls.innerHTML = pixels+" "+pixeleln
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
        
       <div id='btnback'>
       <NavLink to="/" id='backstrelka' ></NavLink>
       </div>
       <p id='cords'>x:0 y:0</p>
      </div>
      <div id='holstbackgr'>
          <div alt='' id='grid'>
            <img alt='' id='imggrid' src={require('../imgs/grid.png')}></img>
            </div>
          
           <canvas  id='holst' width={"1000px"} height={"1000px"}></canvas>
      </div>
      <div id='holstcolorsbar'>
        <div id='progrtimer'><div id='progr'></div></div>
        <p id='holstpixels'>{pixels} Пикселей</p>
        <div id='holstcolors'>
          <div onClick={setCol} style={{backgroundColor:"#fff"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#ccc"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#999"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#333"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#000"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#39f"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#69c"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#669"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#06f"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#63c"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#f66"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#f30"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#f39"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#936"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#639"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#fc6"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#f93"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#f96"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#f63"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#c60"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#9c3"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#6c0"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#cc3"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#fc0"}} className='holstcolor'></div>
          <div onClick={setCol} style={{backgroundColor:"#c90"}} className='holstcolor'></div>
        </div>
      </div>
      </div>
       
  )
}
