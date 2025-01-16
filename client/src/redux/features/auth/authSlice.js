import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState ={
    user:null,
    users:null,
    isLoading:false,
    status:null,
}

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({userid})=>{
        try {
            const {data} = await axios.post('/registration',{
                userid
              
            })
           // if(data.token){
           //     window.localStorage.setItem('token', data.token)
           // }
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const getUsers = createAsyncThunk(
    '/users',
    async ()=>{
        try {
            const {data} = await axios.get('/users')
           // if(data.token){
           //     window.localStorage.setItem('token', data.token)
           // }
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({username,password})=>{
        try {
            const {data} = await axios.post('/login',{
                username,
                password,
            })
            if(data.token){
                window.localStorage.setItem('token', data.token)
            }
            return data
        } catch (error) {
            console.log(error)
        }
    },
)


export const setdb = createAsyncThunk(
    'auth/setdb',
    async ({userid,money})=>{
        try {
           // console.log(username,money)
            const {data} = await axios.post('/setdb',{userid,money})
            //if(data.token){
            //    window.localStorage.setItem('token', data.token)
            //}
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers: {
        // Register user
        [registerUser.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        [registerUser.fulfilled]: (state, action) => {
            state.isLoading = false
            state.status = action.payload?.message
            state.user = action.payload.user
            state.autht = action.payload.token
        },
        [registerUser.rejectWithValue]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },
        // Login user
        [getUsers.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        [getUsers.fulfilled]: (state, action) => {
            state.isLoading = false
            state.users = action.payload.users
        },
        [getUsers.rejectWithValue]: (state, action) => {
            state.isLoading = false
            state.users = null
        }

    },
})
export const checkIsAuth = (state) => Boolean(state.auth.token)
export default authSlice.reducer