import {Layout} from './components/Layout.jsx'
import {Routes,Route} from 'react-router-dom'
import {MainPage} from './pages/MainPage'
import {HolstPage} from './pages/HolstPage'
import {PolePage} from './pages/PolePage'
import {RatingPage} from './pages/RatingPage'
import {ShopPage} from './pages/ShopPage'

import { useEffect } from 'react'
import socket from './utils/io'
import bridge from '@vkontakte/vk-bridge';
import './App.css';


///////////////////////////////////////////////////////////
//"start": "react-scripts start", вернуть назад не https//
//////////////////////////////////////////////////////////
bridge.send("VKWebAppInit");
function App() {
 
//  useEffect(()=>{
//  
//    
//
//  },[])
// 
//  
//  socket.on("connect", () => {
//     const usern = bridge.send('VKWebAppGetUserInfo')
//    usern.then(function(usert) {
//      //console.log("Подключён ");
//      let dat = {"socketid":socket.id,"userid":usert.id,"name":usert.first_name}
//      socket.emit('ClientConn',JSON.stringify(dat));
//     }) 
//  });
//
  
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<MainPage/>}/>
        <Route path='holst' element={<HolstPage/>}/>
        <Route path='pole' element={<PolePage/>}/>
        <Route path='rating' element={<RatingPage/>}/>
        <Route path='shop' element={<ShopPage/>}/>
      </Routes>
    </Layout>
  );
}

export default App;
