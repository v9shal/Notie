import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { act } from 'react';

interface AuthState{
    isAuthenticated:boolean
    token:string|null;
    username:string|null
}
const initialState:AuthState={
    isAuthenticated:false,
    token:null,
    username:null
}
const authSlice = createSlice({
    name: 'auth',
   initialState,
   reducers:{
    setCredentials:(state,action:PayloadAction<{token:string,username:string}>)=>{
        state.token=action.payload.token;
        state.isAuthenticated=true
        state.username=action.payload.username
    },
    logout:(state)=>{
        state.token=null
        state.isAuthenticated=false
        state.username=null
    }
   }
});
export const {setCredentials,logout}=authSlice.actions;
export default authSlice.reducer;