import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

export default function QuestionList({updateId}) {
    const [problems, setProblems] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [problemCount,setProblemCount]=useState(-1)
    const navigate = useNavigate()
    const [loading,setLoading]=useState(true)

    const url = process.env.REACT_APP_API

    const getProblems = () => {
        axios.get(`${url}questions?page=${currentPage}`).then((result) => {
            if(result.data.totalCount!==0)
            setProblemCount(result.data.totalCount)
            setProblems(result.data.questions)
            setLoading(false)
        }).catch((error) => {
            console.log('Some error occured: ', error)
        })
    }

    let lastpage=Math.ceil(problemCount/10)
    console.log(lastpage)

    useEffect(() => {
        window.scrollTo(0,0)
        getProblems()
    }, [currentPage])



    const handlePrevious = () => {
        setLoading(true)
        setCurrentPage(currentPage - 1)

    };

    const handleNext = () => {
        setLoading(true)
        // setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(data.length / itemsPerPage)));
        setCurrentPage(currentPage + 1)
    };
    const diff = {
        'easy': 'text-green-600',
        'hard': 'text-red-600',
        'medium': 'text-yellow-300',
        'Easy': 'text-green-600',
        'Hard': 'text-red-600',
        'Medium': 'text-yellow-300',
    }
    const navigateToProblem = (id) => {
        
        updateId(1,id)
    }
    return (
        <div className="min-h-screen w-1/2 flex items-start justify-center ">
            {loading && 
               <div className="flex justify-center m-2">
                <Loader size={48}/>
               </div>
            }
            
            {!loading && <div className="overflow-x-scroll w-full bg-white rounded-lg p-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>

                        </tr>
                    </thead>
                    
                    <tbody>
                        {problems.map((item, index) => (

                            <tr key={item.id} className={`hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-100' : ''}`} onClick={() => { navigateToProblem(item.id) }}>
                                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-md font-bold text-black-500 cursor-pointer">{item.statement}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>
                {problems.length === 0 &&
                    <div className="text-center p-2 w-full">No more problems found</div>
                }
                <div className="mt-4 flex justify-between w-full items-center">
                    <button
                        onClick={handlePrevious}
                        className={`px-4 py-2 bg-gray-${currentPage === 0 ? '200' : '500'} text-gray-100 rounded `}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>
                    <div>Page {currentPage+1} of {lastpage}</div>
                    <button
                        onClick={handleNext}
                        className={`px-4 py-2 bg-gray-${(problems.length === 0 || currentPage+1===lastpage )? '200' : '500'}  text-gray-100 rounded `}
                        disabled={problems.length === 0 || currentPage+1===lastpage}
                    >
                        Next
                    </button>
                </div>
            </div>}
        </div>
    )
}
