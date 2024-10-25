
import React,{useState} from 'react';
import { useSelector } from "react-redux";

const Profile=()=>{
    console.log('hello')
        const username= useSelector((state)=>state.auth.username);    
    return (
        <>
        <div>
            hello, your name is {username?username:"guest"}
        </div>
        </>
        
    )

}
export default Profile