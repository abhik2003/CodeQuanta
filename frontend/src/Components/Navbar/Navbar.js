import React, { useContext, useEffect, useState } from 'react'
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../AuthContextProvider/AuthProvider'
import Hashids from 'hashids';
import base64url from 'base64url';
import { Buffer } from 'buffer';
export default function Navbar() {
    global.Buffer = Buffer;
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation()
    console.log(location.pathname)
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };
    const { logout, isAuthenticated, loaded } = useContext(AuthContext)

   

    
    console.log(isAuthenticated)
    const navigate = useNavigate()


    const handleNavigateLogin = () => {
        console.log('here')
        navigate('/login')
    }

    const handleLogout = () => {

        console.log('logged out')
        logout()
        navigate('/login')
    }

    

    useEffect(() => {
        if (loaded && location.pathname === '/admin') {
            if (!isAuthenticated[0] || isAuthenticated[1].admin === 0)
                navigate('/problems')

        }
        if(loaded)
            console.log(isAuthenticated[1]?.admin)
        
    }, [location, loaded])
    return (
        <>
            <nav className="bg-gray-800 text-white py-2 px-4  w-full z-50">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo and Company Name */}
                    <Link to={`/problems`}>
                        <div className="flex items-center text-white">

                            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Company Logo"
                                height={50} width={50} className=" mr-2 rounded-full" />
                            {/* <span className="text-lg font-semibold">ShopNest</span> */}
                        </div>
                    </Link>

                    {/* Navbar Items for Desktop */}
                    <div className="hidden md:flex space-x-6 items-center text-xl">

                        <Link to="/problems" className={`text-gray-400 hover:text-white ${location.pathname === '/problems' ? "border-b-2 " : ""}`}>Problems</Link>

                        <Link to="/contest" className={`text-gray-400 hover:text-white ${location.pathname === '/contest' ? "border-b-2 " : ""}`}>Contest</Link>

                        {isAuthenticated[0] && isAuthenticated[1].admin === 1 &&
                            <Link to="/admin" className={`text-gray-400 hover:text-white ${location.pathname === '/admin' ? "border-b-2 " : ""}`}>Admin</Link>
                        }

                        <Link to="/compiler" className={`text-gray-400 hover:text-white ${location.pathname === '/compiler' ? "border-b-2 " : ""}`}>Compiler</Link>

                    </div>

                    {/* Login Button for Desktop */}
                    <div className="hidden md:flex items-center">

                        {!isAuthenticated[0] && <button className="text-white bg-green-500 hover:bg-green-400 px-4 py-2 rounded" onClick={handleNavigateLogin}>
                            Login
                        </button>}
                        {isAuthenticated[0] &&
                            <Link to={`/profile/${isAuthenticated[1].userName}`} className='h-12 w-12 rounded-full bg-red-800 flex items-center justify-center mx-2'>
                                {isAuthenticated[1].name !== null ? isAuthenticated[1].name[0] : 'Z'}
                                { }
                            </Link>
                        }
                        {isAuthenticated[0] && <button className="text-white bg-red-500 hover:bg-green-400 px-4 py-2 rounded" onClick={() => { handleLogout() }}>
                            Logout
                        </button>}
                    </div>

                    {/* Hamburger Menu Icon for Mobile */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleNavbar} className="text-white focus:outline-none">
                            {isOpen ? (
                                <XIcon className="h-6 w-6" />
                            ) : (
                                <MenuIcon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="  md:hidden mt-4">
                        <Link to="/problems" className="text-gray-400  hover:text-white">
                            <div className='p-2'> Problems</div>
                        </Link>
                        <hr />

                        <Link to="/contest" className="text-gray-400  hover:text-white ">
                            <div className='p-2'>Contest</div>
                        </Link>


                        <hr />
                        {
                            isAuthenticated[0] &&
                            <>
                                <Link to="/profile" className="text-gray-400  hover:text-white ">
                                    <div className='p-2'>Profile</div>
                                </Link>
                                <hr />
                            </>
                        }


                        {!isAuthenticated[0] && <button className="text-white bg-green-500 hover:bg-green-400 m-2 px-4 py-2 rounded" onClick={handleNavigateLogin}>
                            Login
                        </button>}




                        {isAuthenticated[0] && <button className="text-white bg-red-500 hover:bg-green-400 px-4 py-2 my-2 rounded" onClick={handleLogout}>
                            Logout
                        </button>}
                    </div>
                )}
            </nav>
        </>
    )
}
