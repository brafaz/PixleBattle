import React from 'react'
import './Navbar.css';
import { useEffect } from 'react'
import bridge from '@vkontakte/vk-bridge';
import notify from '../utils/notify'
import { NavLink } from 'react-router-dom';
export const Navbar = () => {
 // useEffect(()=>{
 //   const usern = bridge.send('VKWebAppGetUserInfo')
 //   usern.then(function(usert) {
 //     let name = document.getElementById('name');
 //     name.innerHTML = usert.first_name
 //     let ava = document.getElementById('avatar');
 //     ava.src = usert.photo_100
 //     //let famil = document.getElementById('famil');
 //    // famil.innerHTML = usert.last_name
 //     //console.log(usert)
 //  })
 // },[])

 //const rating = () =>{
 //  
 //}
  return (
    <div id='nav'>
     <div className='navel'>
        <img src={require('../imgs/kist.png')} className="navimg"></img>
        <NavLink to="/" className='navtextnav' >Рисовать</NavLink>
     </div>
     <div style={{marginLeft:"33.50%"}} className='navel'>
        <img src={require('../imgs/prize.png')} className="navimg"></img>
        <NavLink to="/shop" className='navtextnav' >Магазин</NavLink>
     </div>
     <div style={{marginLeft:"67%"}} className='navel'>
        <img src={require('../imgs/zvezda.png')} className="navimg"></img>
        <NavLink to="/rating" className='navtextnav' >Рейтинг</NavLink>
     </div>
    </div>
  )
}
