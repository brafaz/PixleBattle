import React from 'react'
import './ShopPage.css';
import { useEffect,useState } from 'react'
import { Navbar } from '../components/Navbar'
import { NavLink } from 'react-router-dom';
import io from "socket.io-client"
import bridge from '@vkontakte/vk-bridge';
import notify from '../utils/notify'
//import socket from '../utils/io'
import dialog from '../utils/dialog'
export const ShopPage = () => {
  var [listi, setlisti] = useState([]);
  var [canClick, setCanClick] = useState(true);
  var [money, setMoney] = useState(0);
  var [diams, setDiams] = useState(0);
  var [loading, setLoad] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'))
  const socket = io("https:///127.0.0.1:5000")
 var panning = false
 var pointYc = 0
 var selc = 0
 var val = 0
 var typet = 0,
 valui = 0
 var maxpx = 0
 var timerpx = 0
 var start = { y: 0 }
 var mov = false
 //var buyedlist=[]
 socket.on("getShopL",function(listn){
   //setlisti(listn)
   if(timerpx!=0&& maxpx !=0){
   for(let i = 0;i<listn.length;i++){
     
       if(listn[i].typ === 'timerpixels'){
         if(timerpx<= listn[i].value){
           listn[i].color = '#666666'
           listn[i].text = 'Куплено!'
         }else{
           listn[i].color = '#086fc9'
         }
   
       }
       if(listn[i].typ === 'maxpixels'){
         if(maxpx>= listn[i].value){
           listn[i].color = '#666666'
           listn[i].text = 'Куплено!'
         }else{
           listn[i].color = '#086fc9'
         }
   
       }
   }
   //console.log(listn)
   setlisti(listn)
    setLoad(true)
  }
  })
  socket.on("user",function(data){
    //console.log(data)
    setMoney(data[0].money)
    setDiams(data[0].diams)
   })
  
   socket.on("loadUser",function(data){
    
    maxpx = data.maxpixels
    timerpx = data.timerpixels
    socket.emit('getShop');
  })
 useEffect(()=>{
  socket.emit('loaduser',user[0].id);
  
  socket.emit('getUser',{"id":user[0].id});
 
  var list = document.getElementById("shopList")
  list.onmousedown = function (e) {
   e.preventDefault();
   start = { y: e.clientY - pointYc };
   panning = true
   mov = true
   setCanClick(true)
   list.onmousemove = function (e) {
    
       e.preventDefault();
       panning = false
       setCanClick(false)
       if (!mov) {
         return;
       }
       pointYc = (e.clientY - start.y);
       if( list.getBoundingClientRect().top>= e.view.innerHeight/6 && pointYc>=e.view.innerHeight/6){
        pointYc = e.view.innerHeight/6
      }
      if( list.getBoundingClientRect().bottom<= e.view.innerHeight/2 && pointYc<=list.getBoundingClientRect().top){
        pointYc = list.getBoundingClientRect().top
      }
       list.style.transform = "translate(0px,"+pointYc+"px)"
   }
   list.onmouseup = function (e) {
     mov = false
     
   }
 }
 list.onwheel = function (e) {
  e.preventDefault();
    var delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
  //(delta > 0) ? (pointYc *= 1.2) : (pointYc /= 1.2);
  if(delta >0){
    pointYc += 30
  }else{
    pointYc -= 30
  }
  if( list.getBoundingClientRect().top>= e.view.innerHeight/6 && pointYc>=e.view.innerHeight/6){
    pointYc = e.view.innerHeight/6
  }
  if( list.getBoundingClientRect().bottom<= e.view.innerHeight/2 && pointYc<=list.getBoundingClientRect().top){
    pointYc = list.getBoundingClientRect().top
  }
  list.style.transform = "translate(0px,"+pointYc+"px)"

}
 list.ontouchstart = function(e){
   start = { y: e.touches[0].clientY - pointYc };
 }
 list.ontouchmove = function(e){
   e.preventDefault();
   pointYc = (e.touches[0].clientY- start.y);
   if( list.getBoundingClientRect().top>= e.view.innerHeight/6 && pointYc>=e.view.innerHeight/6){
    pointYc = e.view.innerHeight/6
  }
  if( list.getBoundingClientRect().bottom<= e.view.innerHeight/2 && pointYc<=list.getBoundingClientRect().top){
    pointYc = list.getBoundingClientRect().top
  }
   list.style.transform = "translate(0px,"+pointYc+"px)"
 }


 },[])
 var listItems =  listi.map((d) =>   
 <div onClick={()=>{buy(d.disc,d.price,d.val,d.typ,d.value,d.color)}} key={d.key} style={{backgroundColor:d.color}} className='shopitem'>
   <p id='text'>{d.text}</p>
   <p id='price'>{d.price} {d.val}</p>
 </div>
 )
 function g(){
  if(selc !== 0){
    if(val === "Алмазов" || val === "Алмаза" || val === "Алмаз"){
     if(diams < selc){
      alert("Нехватает Алмазов")
      return
     }
     alert("Успешная покупка")
     diams -= selc
     setDiams(diams)
     socket.emit('buyUser',{"typ":typet,"value":valui,"id":user[0].id,"pric":diams,"valtyp":"diams"});
    }
    if(val === "Монет" || val === "Монеты" || val === "Монета"){
      if(money < selc){
        alert("Нехватает Монет")
        return
      }
      alert("Успешная покупка")
      money -= selc
      setMoney(money)
      socket.emit('buyUser',{"typ":typet,"value":valui,"id":user[0].id,"pric":money,"valtyp":"money"});
    }
   //alert(selc)
  }
 }
 function buy(t,n,v,ty,valu,color){
  if(!canClick){
    return
  }
  if(color !== '#086fc9'){
    return
  }
  selc = n
  val = v
  typet = ty
  valui = valu
  dialog(t,0,g,"Купить")
 }
 var prmon = String(money)
 // <button id='buydiam'>Купить алмазы</button>
 //<button id='addiam'>Посмотреть рекламу за алмазы</button>
  return (
    <div>
      <Navbar/>
      {!loading && <div id="loadiv"><img style={{width:"100px",position:"relative",top:"30%"}} alt="" src={require('../imgs/loading.gif')}></img><p style={{position:"relative",top:"40%",fontSize:"30px"}}>Загрузка</p></div>}
      <div id="notify"></div>
      <div id='shopList'>
        <p id='txtmoney'>{prmon.match(/^-?\d+(?:\.\d{0,1})?/)[0]} Монет</p>
        <p id='txtdiam'>{diams} Алмазов</p>
        {listItems}
      </div>
    </div>
       
    //</div>
  )
}
