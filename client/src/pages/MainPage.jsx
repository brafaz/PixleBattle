import React from 'react'
import './MainPage.css';
import { useEffect,useState } from 'react'
import { Navbar } from '../components/Navbar'
import { NavLink } from 'react-router-dom';
import io from "socket.io-client"
import bridge from '@vkontakte/vk-bridge';
import notify from '../utils/notify'
//import socket from '../utils/io'
export const MainPage = () => {
  var [user, setUser] = useState([]);
  var [loading, setLoad] = useState(false);
  var [px, setPx] = useState(0);
  const socket = io("http://127.0.0.1:5000")
function uuidv4() {
   return Math.random().toString(16).slice(2)
}
useEffect(()=>{
		const usern = bridge.send('VKWebAppGetUserInfo')
    usern.then(function(usert) {
        setUser({"id":usert.id,"first_name":usert.first_name,"last_name":usert.last_name,"regtype":"VK"})
  })
  
},[])
socket.on("getUserCountPole",function(count){
  setPx(count)
  setLoad(true)
})
localStorage.setItem('user', [])
    localStorage.setItem('user',JSON.stringify(user));
useEffect(()=>{
  
  if(user.id){
   
   //socket.emit('getUser',user);
   //socket.on("user",function(data){
   // //console.log(data)
   //  if(data.length <=0){
   //   socket.emit('newreg',user);
   //  // console.log(user)
   //   let urs = []
   //   urs.push(user)
   //   localStorage.setItem('user', [])
   //   localStorage.setItem('user', JSON.stringify(urs));
   //  }
   //  if(data.length >0){
   //    setUser(data)
   //    localStorage.setItem('user', [])
   //    localStorage.setItem('user', JSON.stringify(data));
   //   }
   //   
   //   socket.emit('getUserPixsPole',user.id)
   //})
   
  }
},[user])

const matrica = () =>{
  notify("Нету")
}
const stena = () =>{
  notify("Нету")
}
 var prpx = String(px/2)
  return (
    <div>
      <Navbar/>
      {!loading && <div id="loadiv"><img style={{width:"100px",position:"relative",top:"30%"}} alt="" src={require('../imgs/loading.gif')}></img><p style={{position:"relative",top:"40%",fontSize:"30px"}}>Загрузка</p></div>}
          <div id="notify"></div>
      <div id='centr'>
        <p>Вы получаете в минуту:</p>
        <p id='textvmin'>{prpx.match(/^-?\d+(?:\.\d{0,1})?/)[0]} монет ({px}px)</p>
        <div  className='elsdraw'>
          <img className='elimgdrw' src={require('../imgs/holst.png')} alt=""></img>
          <NavLink to="/holst" className='eldrawnamenav' >Холст</NavLink>
          <p className='eldrawdisc'>Холст для рисования</p>
        </div>
        <div className='elsdraw'>
          <img className='elimgdrw' src={require('../imgs/pole.png')}alt=""></img>
          <NavLink to="/pole" className='eldrawnamenav' >Поле боя</NavLink>
          <p className='eldrawdisc'>Захват территорий</p>
        </div>
        <div onClick={matrica} className='elsdraw'>
           <img className='elimgdrw' src={require('../imgs/matrica.png')}alt=""></img>
           <p className='eldrawname'>Матрица</p>
           <p className='eldrawdisc'>Обложка паблика игры</p>
        </div>
        <div onClick={stena} className='elsdraw'>
          <img className='elimgdrw' src={require('../imgs/stena.png')}alt=""></img>
          <p className='eldrawname'>Стена</p>
          <p className='eldrawdisc'>1 Пиксель - 50 монет</p>
        </div>
      </div>
    </div>
       
    //</div>
  )
}
