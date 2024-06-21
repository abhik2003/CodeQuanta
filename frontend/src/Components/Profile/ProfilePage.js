import React, { useContext, useEffect, useState } from 'react'
import CircularProgress from './CircularProgress'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import { AuthContext } from '../../AuthContextProvider/AuthProvider'
import Footer from '../Footer/Footer'
import Submissions from '../Submissions/Submissions'
import Loader from '../Loader/Loader';

export default function ProfilePage() {
    const base_url = process.env.REACT_APP_API;
    const params = useParams()

    
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(
        {
            'email': 'abc@gmail.com',
            'name': 'ABCD',
            'solvedCount': {
                'easy': 0,
                'medium': 0,
                'hard': 0
            },
            'submissions': [],
            'totalProblems': 1
        }
    )

    const [user_id, setUserId] = useState("")
    const navigate = useNavigate()

    const [totalProblems, setTotalProblems] = useState(0);
    const [percentage, setPercentage] = useState(0);
    console.log(totalProblems)
    const getTotalProblemsCount = async () => {
        const { data } = await axios.get(`${base_url}total-problems-count`);
        if (data?.totalCount) setTotalProblems(data?.totalCount);
    }
    


    useEffect(() => {
        console.log('came here')
        let val = (user?.solvedCount.easy || 0 + user?.solvedCount.medium || 0 + user?.solvedCount.hard || 0)
        // console.log(val)
        // console.log(totalProblems)
        let percent = ((val) * 100) / totalProblems
        console.log(percent)
        setPercentage(percent.toFixed(2));  //upto 2 decimal places

    }, [totalProblems])



    const { isAuthenticated, loaded } = useContext(AuthContext)
    const url = process.env.REACT_APP_API


    const getUser = async() => {
        
        await axios.post(`${url}user-profile`, { 'userName': params.userName }).then((result) => {
            console.log(result.data)
            console.log("User", result.data)
            setUser(result.data)
            setUserId(result.data.id)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
        })
    }
    console.log(loading)
    const [submissions, setSubmissions] = useState([]);

    const getSubmissions = async () => {
        //   const user_id = user?.user_id; //cuurently for testing purpose, it will be fetched from context
        const { data } = await axios.post(
            `${base_url}get-submissions-user-all`,
            { user_id }
        );
        console.log(data);
        setSubmissions(data?.submissions);
    };

    useEffect(() => {
        if (user_id) getSubmissions();
    }, [user_id])
    console.log(loaded)
    useEffect(() => {
        if (!params.userName)
            navigate('/problems')
        
        getUser();
        getTotalProblemsCount()
        


    }, [loaded])


    return (
        <>
            <Navbar />

            {loading &&
                <div className="h-48 flex justify-center items-center">
                    <Loader size={96} />
                </div>
            }

            {!loading && <div className="flex flex-col lg:flex-row  p-4 bg-gray-100">
                {/* Left Side: User Info */}
                <div className="w-full lg:w-1/3 p-4 bg-gray-200 rounded-lg shadow-md mb-4 lg:mb-0">
                    <div className="flex flex-col items-center">
                        <img
                            src={`${process.env.PUBLIC_URL}/profile.jpg`}
                            alt="Profile"
                            className="rounded-full w-48 h-48 mb-4"
                        />
                        <h1 className="text-2xl font-bold mb-2">{user?.name ? user?.name : 'Krish'}</h1>
                        <p className="text-gray-600">{user?.email}</p>
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
                                <p className="text-green-500 text-xl font-bold my-2">{user?.solvedCount.easy || 0} Easy</p>
                                <p className="text-yellow-500 text-xl font-bold my-2">{user?.solvedCount.medium || 0} Medium</p>
                                <p className="text-red-500 text-xl font-bold my-2">{user?.solvedCount.hard || 0} Hard</p>
                            </div>
                        </div>

                    </div>

                    {/* Lower Part: Previous Submissions */}
                    <div className="p-4 mt-8 bg-white rounded-lg shadow-md h-96 overflow-auto">
                        <h2 className="text-xl font-bold mb-2">Previous Submissions</h2>

                        <Submissions submissions={submissions} />


                    </div>
                </div>
            </div>}
            <hr />
            <Footer />
        </>
    )
}
