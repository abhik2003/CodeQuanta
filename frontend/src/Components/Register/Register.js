import React, { useContext, useState } from 'react'
import { AuthContext } from '../../AuthContextProvider/AuthProvider'
import axios from 'axios'
import { LockClosedIcon, MailIcon, EyeIcon, EyeOffIcon,UserIcon } from '@heroicons/react/solid';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

export default function Register() {
    const [pwd, setPwd] = useState(true)
    const [status, setStatus] = useState([false, ''])
    const [loading, setLoading] = useState(false)
    const url=process.env.REACT_APP_API
    const [details, setDetails] = useState({
        'email': '',
        'password': '',
        'name':'',
        'userName':''
    })
    const { login, isAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()
    const handleChange = (e) => {
        // console.log(e.target.name)
        setDetails((dt) => {
            return { ...dt, [e.target.name]: e.target.value }
        })
    }

    const passwordCheckLogic = () => {
        console.log('here')
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@]).+$/;

        if (details.password.length < 8 || details.password.length > 16) {
            if (details.password.length < 8) {
                setStatus([true, 'Password should be between 8-16 characters'])
                return true
            }
            else {
                setStatus([true, 'Password should be between 8-16 characters'])
                return true

            }
        }
        if (!regex.test(details.password)) {
            setStatus([true, 'Password should contain letters, digits and "@"'])
            return true

        }
        setStatus([false, ''])
        return false
    }
    console.log(isAuthenticated)
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('reached here')
        
        setLoading(true)
        if (passwordCheckLogic()) {
            setLoading(false)
            return
        }
        axios.post(`${url}register`, {
            email: details.email,
            password: details.password,
            name:details.name,
            userName:details.userName
        }).then((result) => {
            console.log(result.status)
            if (result.status === 200) {
                setLoading(false)
                
                navigate('/login')
                
            }
            else {
                const data = result.data
                setStatus([true, data.message])
            }


        }).catch((error) => {
            console.log(error)
            setLoading(false)

            if (error.response.data)
                setStatus([true, error.response.data])
            else
                setStatus([true, error.message])

        })
    }

    const togglePwd = () => {
        setPwd(pwd => !pwd)
    }
    return (
        <div className=" py-16 md:py-0 w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-white">
            <div className="bg-blue-700 rounded-lg shadow-lg w-3/4 md:w-1/2 xl:w-1/3 max-w-4xl flex flex-col md:flex-row">
                <div className="w-full bg-white p-4  rounded-lg flex items-center flex-col">
                    {/* <h1 className="text-2xl  mb-6 text-center">Sign Up</h1> */}
                    {/* <hr className="bg-white w-full mb-6" /> */}
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} className='mb-8' height={150} width={150} alt="here" />


                    <form className="w-full flex flex-col items-center" onSubmit={handleSubmit}>

                    <div className="mb-8 w-full flex pl-4 items-center">
                            <label className="block text-white mb-2 text-xl" htmlFor="email">
                                <UserIcon className="h-7 w-7 text-gray-500 inline-block mr-2 " />
                            </label>
                            <input
                                type="text"
                                name="userName"
                                value={details.userName}
                                onChange={handleChange}
                                placeholder="username"
                                className="w-3/4 h-12 px-3 py-2 rounded border
                                hover:bg-gray-200
                                border-blue-100 focus:outline-none focus:text-black"
                                required
                            />
                        </div>

                    <div className="mb-8 w-full flex pl-4 items-center">
                            <label className="block text-white mb-2 text-xl" htmlFor="email">
                                <UserIcon className="h-7 w-7 text-gray-500 inline-block mr-2 " />
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={details.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="w-3/4 h-12 px-3 py-2 rounded border
                                hover:bg-gray-200
                                border-blue-100 focus:outline-none focus:text-black"
                                required
                            />
                        </div>
                        <div className="mb-8 w-full flex pl-4 items-center">
                            <label className="block text-white mb-2 text-xl" htmlFor="email">
                                <MailIcon className="h-7 w-7 text-gray-500 inline-block mr-2 " />
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={details.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-3/4 h-12 px-3 py-2 rounded border
                                hover:bg-gray-200
                                border-blue-100 focus:outline-none focus:text-black"
                                required
                            />
                        </div>
                        <div className="mb-4 w-full flex pl-4 items-center">
                            <label className="block text-white mb-2 text-xl" htmlFor="password">
                                <LockClosedIcon className="h-7 w-7 inline-block mr-2 text-gray-500" />
                            </label>
                            <input
                                type={pwd ? 'password' : 'text'}
                                name="password"
                                value={details.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-3/4 px-3 
                                border h-12
                                py-2 rounded 
                                hover:bg-gray-200   border-blue-100 focus:outline-none focus:border-blue-400"
                                required
                            />
                            <div className="pl-4 flex items-center cursor-pointer" onClick={togglePwd}>
                                {pwd ? <EyeIcon className="h-5 w-5 inline-block mr-2 text-black" /> : <EyeOffIcon className="h-5 w-5 inline-block mr-2 text-black" />}
                            </div>
                        </div>

                        <div className={`status mb-4 text-center text-${status[0] ? 'red-900' : 'green-600'} h-8`}>
                            {status[1]}
                        </div>
                        <div className="flex justify-center w-full px-8">
                            <button
                                type="submit"
                                className="w-1/2 text-xl
                                
                                bg-gradient-to-r
                                from-gray-700 to-gray-500
                                text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 flex items-center justify-center"
                            >
                                {loading && <Loader size={24} />} 
                                Sign Up
                            </button>
                        </div>

                        <div className="link flex text-gray-500  mt-4 text-md pl-4">
                            Already have an account? <Link className="text-indigo-700 underline hover:text-indigo-300 ml-1" to="/login">Sign In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
