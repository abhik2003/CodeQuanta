import React, { useContext, useState } from 'react'
import { AuthContext } from '../../AuthContextProvider/AuthProvider'
import axios from 'axios'

export default function Login() {
    const [data,setData]=useState({
        'email':'krish120@gmail.com',
        'password':'krish'
    })
    const { isAuthenticated, login, logout } = useContext(AuthContext)
    const handleclicklogin=()=>{
        console.log('hello')
        axios.post('http://127.0.0.1:5000/login',data).then((result)=>{
            // console.log(result)
            login(result.data.user)
        }).catch((error)=>{
            console.log(error)
        })

    }

    const handlelogout=()=>{
        logout()
    }
    return (
        <div>
            {!isAuthenticated[0] &&
                <h1>Not Logged in</h1>
            }
            {isAuthenticated[0] &&
                <>
                <h1>Logged In</h1>
                <h2>{isAuthenticated[1].name}</h2>
                </>
            }

            {!isAuthenticated[0] &&
                <button onClick={handleclicklogin}>Login</button>
            }
            {isAuthenticated[0] &&
                <button onClick={handlelogout}>Logout</button>
            }
        </div>
    )
}
