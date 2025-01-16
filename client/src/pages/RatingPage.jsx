import React from 'react'
import './RatingPage.css';
import { useEffect,useState } from 'react'
import { Navbar } from '../components/Navbar'
import { NavLink } from 'react-router-dom';
import io from "socket.io-client"
import bridge from '@vkontakte/vk-bridge';
import dialog from '../utils/dialog'
//import socket from '../utils/io'
//import {VKAPI} from 'vkontakte-api';
export const RatingPage = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  //var [loading, setLoad] = useState(false);
  const socket = io("https:///127.0.0.1:5000")
  var goIdClan = '0'
  //const api = new VKAPI({
  //  rps: 20,
  //  accessToken: '713c373f713c373f713c373f1b722e1cf47713c713c373f12812d0dbb28be440257aa47',
  //});
  //api.utils.resolveScreenName({ screen_name: 'brafaz'}).then(console.log);
  socket.on("user",function(data){
    //let name = data.first_name
   // let famil = data.last_name
    let clan = data[0].clan
    bridge.send('VKWebAppGetGroupInfo', {
      group_id: parseInt(clan)
      })
      .then((data) => { 
        if (data.id) {
          let clanname = document.getElementById('clanName')
          clanname.innerHTML = data.name
          let clanimg= document.getElementById('clanimg')
          clanimg.src= data.photo_100
          goIdClan = data.screen_name
        }
      })
    
  })
  socket.emit('getUser',{"id":user[0].id});
  function goClan(){
    if(goIdClan == '0'){
     return
    }
     window.open("https://vk.com/"+goIdClan)
   }
   function g(t){
    //let p = t.replace("https://vk.com/",'')
   // if(t.indexOf("https://vk.com/public") >= 0) {
     // t = t.replace("https://vk.com/public",'')
      bridge.send('VKWebAppGetGroupInfo', {
        group_id: parseInt(t)
        })
        .then((data) => { 
          if (data.id) {
            socket.emit('setUserDat',{"clan":data.id,"id":user[0].id});
            var el = document.getElementById('dialogbckg');
            if(el != null){
             el.remove()
            }
          }
        })
    //  return
    //}else if(t.indexOf("https://vk.com/") >= 0) {
    //   t = t.replace("https://vk.com/",'')
    // }
    //
    // alert(t)
 
   }
   function chngClan(){
    dialog("Введите айди группы клана за который хотите играть (не буквенный)",1,g,"Вступить")
   }
  
  return (
    <div>
      <Navbar/>
      <div id="notify"></div>
      
      <div id='clan'>
        <p id='textClan'>Ваш клан:</p>
        <p onClick={goClan} id='clanName'></p>
        <img alt='' id='clanimg'></img>
        <p onClick={chngClan} id='cnangClan'>Сменить клан</p>
      </div>
      
      <div id='listRati'>
      
      </div>
    </div>
       
    //</div>
  )
}
