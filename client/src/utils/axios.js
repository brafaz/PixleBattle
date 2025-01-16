import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://26.13.71.162/auth',
})

//instance.interceptors.request.use(config =>{
//   // config.headers.Authorization = window.localStorage.getItem('token')
//
//    return config
//})

export default instance