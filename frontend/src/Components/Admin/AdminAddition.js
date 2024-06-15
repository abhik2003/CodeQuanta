import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../AuthContextProvider/AuthProvider'

export default function AdminAddition() {
    const [userBeingAddedEmail, setUserBeingAddedEmail] = useState('')
    const [adminStatus, setAdminStatus] = useState([false])
    const url = process.env.REACT_APP_API
    const changeAdmin = (e) => {
        setUserBeingAddedEmail(e.target.value)
    }
    const {isAuthenticated}=useContext(AuthContext)
    const handleAddAdmin = (e) => {
        e.preventDefault()
        
        axios.post(`${url}add-admin`, {
            userBeingAddedEmail,
            id: isAuthenticated[1].id
        }).then((result) => {
            alert('Admin added successfully')
        }).catch((error) => {
            if (error.response.data.message)
                setAdminStatus([true, error.response.data.message])
            else
                setAdminStatus([true, 'Some error occured'])
        })
    }
    return (
        <div className="form1 my-8 admin-addition p-4 flex  shadow rounded mx-2 md:mx-0">
            <form action="" className='flex flex-col justify-center' onSubmit={handleAddAdmin}>

                <label className='py-2 text-xl font-bold text-center' htmlFor="userBeingAddedEmail">Enter the email of the person you want to add as admin</label>
                <div className="flex flex-col md:flex-row justify-center ">
                    <input
                        type="email"
                        name="userBeingAddedEmail"
                        value={userBeingAddedEmail}
                        onChange={changeAdmin}
                        placeholder="Email"
                        className="w-3/4 h-12 px-3 py-2 rounded border
                                hover:bg-gray-200 mx-auto md:mx-0
                                border-blue-100 focus:outline-none focus:text-black"
                        required
                    />
                    <button className="my-0  mx-auto md:mx-3 p-2 w-1/5 rounded bg-green-500 hover:bg-green-300 text-white" type='submit'>Add</button>
                </div>

                {adminStatus[0] && <p className="my-2 text-red-500 text-center font-bold">{adminStatus[1]}</p>
                }
            </form>
        </div>
    )
}
