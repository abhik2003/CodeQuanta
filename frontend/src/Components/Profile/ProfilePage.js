import React, { useContext, useEffect, useState } from 'react'
import CircularProgress from './CircularProgress'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import { AuthContext } from '../../AuthContextProvider/AuthProvider'
import Footer from '../Footer/Footer'

export default function ProfilePage() {
    const [user, setUser] = useState({
        'email': 'abc@gmail.com',
        'name': 'ABCD',
        'solvedCount': {
            'easy': 0,
            'medium': 0,
            'hard': 0
        },
        'submissions':[],
        'totalProblems':1
    })
    const navigate=useNavigate()

    let percentage = (user.solvedCount.easy + user.solvedCount.medium + user.solvedCount.hard) * 100 / user.totalProblems
    if (percentage === null) {
        percentage = 50
    }

    const { isAuthenticated } = useContext(AuthContext)
    const url = process.env.REACT_APP_API
    

    const getUser = () => {
        if(isAuthenticated[0])
        axios.post(`${url}user-profile`, { 'email': isAuthenticated[1].email }).then((result) => {
            console.log(result.data)
            setUser(result.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        if(!isAuthenticated[0]){
            navigate('/problems')
            return
        }
        getUser()
    }, [isAuthenticated])
    return (
        <>
            <Navbar />
            <div className="flex flex-col lg:flex-row  p-4 bg-gray-100">
                {/* Left Side: User Info */}
                <div className="w-full lg:w-1/3 p-4 bg-gray-200 rounded-lg shadow-md mb-4 lg:mb-0">
                    <div className="flex flex-col items-center">
                        <img
                            src={`${process.env.PUBLIC_URL}/profile.jpg`}
                            alt="Profile"
                            className="rounded-full w-48 h-48 mb-4"
                        />
                        <h1 className="text-2xl font-bold mb-2">{user.name ? user.name:'Krish'}</h1>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                </div>

                {/* Right Side: Solved Questions and Submissions */}
                <div className="w-full lg:w-2/3 flex flex-col space-y-4 lg:ml-8">
                    {/* Upper Part: Number of Questions Solved */}
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-2">Questions Solved</h2>
                        {/* <p className="text-3xl font-semibold text-center">123</p> */}
                        <div className="flex justify-center">
                            <CircularProgress percentage={percentage} />
                            <div className="numbers  flex flex-col items-center justify-center w-1/2">
                                <p className="text-green-500 text-xl font-bold my-2">{user.solvedCount.easy} Easy</p>
                                <p className="text-yellow-500 text-xl font-bold my-2">{user.solvedCount.medium} Medium</p>
                                <p className="text-red-500 text-xl font-bold my-2">{user.solvedCount.hard} Hard</p>
                            </div>
                        </div>

                    </div>

                    {/* Lower Part: Previous Submissions */}
                    <div className="p-4 mt-8 bg-white rounded-lg shadow-md h-96 overflow-auto">
                        <h2 className="text-xl font-bold mb-2">Previous Submissions</h2>

                        <table className='w-full '>
                            <thead className="">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission id</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.submissions.map((sub, index) => (

                                    <tr key={sub.submissionId} className={`hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-100' : ''}`} >
                                        <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xl font-bold text-black-500">{sub.submissionId}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-md font-bold text-${sub.status === 1 ? 'green-500' : 'red-500'}`}>{sub.verdict}</td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>


                    </div>
                </div>
            </div>
            <hr />
            <Footer/>
        </>
    )
}
