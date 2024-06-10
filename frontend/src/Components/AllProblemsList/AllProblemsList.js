import { data } from 'autoprefixer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

export default function AllProblemsList() {
    const [problems, setProblems] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const navigate=useNavigate()

    const url = process.env.REACT_APP_API

    const getProblems = () => {
        axios.get(`${url}questions?page=${currentPage}`).then((result) => {
            setProblems(result.data.questions)
        }).catch((error) => {
            console.log('Some error occured: ', error)
        })
    }
    useEffect(() => {
        getProblems()
    }, [currentPage])



    const handlePrevious = () => {
        setCurrentPage(currentPage - 1)

    };

    const handleNext = () => {
        // setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(data.length / itemsPerPage)));
        setCurrentPage(currentPage + 1)
    };
    const diff = {
        'easy': 'text-green-600',
        'difficult': 'text-red-600',
        'medium': 'text-yellow-600',
        'Easy': 'text-green-600',
        'Difficult': 'text-red-600',
        'Medium': 'text-yellow-600',
    }
    const navigateToProblem=(id)=>{
        navigate(`/problem/${id}`)
    }
    

    return (
        <>
        <Navbar/>
        <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-8">
            <div className="w-3/4 bg-white rounded-lg p-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.No.</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map((item, index) => (

                            <tr key={item.id} className={`hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-100' : ''}`} onClick={()=>{navigateToProblem(item.id)}}>
                                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-500">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-md font-bold text-black-500">{item.statement}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-md font-bold ${diff[item.difficulty]}`}>{item.difficulty}</td>
                            </tr>

                        ))}
                    </tbody>
                </table>
                <div className="mt-4 flex justify-between">
                    <button
                        onClick={handlePrevious}
                        className={`px-4 py-2 bg-gray-400 text-gray-100 rounded ${currentPage === 0 ? '' : 'hover:bg-gray-200'}`}
                        disabled={currentPage === 0}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className={`px-4 py-2 bg-gray-500 text-gray-100 rounded ${problems.length === 0 ? '' : 'hover:bg-gray-200'}`}
                        disabled={problems.length === 0}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}
