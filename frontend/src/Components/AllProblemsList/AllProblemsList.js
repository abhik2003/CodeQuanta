import { data } from 'autoprefixer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import Loader from '../Loader/Loader';

export default function AllProblemsList() {
    const [problems, setProblems] = useState([])
    const [currentPage, setCurrentPage] = useState(0);
    const [problemCount, setProblemCount] = useState(-1)

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const url = process.env.REACT_APP_API

    const getProblems = () => {
        axios.get(`${url}questions?page=${currentPage}`).then((result) => {
            setLoading(false)
            if (result.data.totalCount !== 0)
                setProblemCount(result.data.totalCount)
            setProblems(result.data.questions)
        }).catch((error) => {
            console.log('Some error occured: ', error)
        })
    }
    useEffect(() => {
        getProblems()
    }, [currentPage])

    let lastpage = Math.ceil(problemCount / 10)


    const handlePrevious = () => {
        setCurrentPage(currentPage - 1)

    };

    const handleNext = () => {
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
        // navigate(`/problem/${id}`)
        const url = `/problem/${id}`;
        window.open(url, '_blank', 'noopener,noreferrer')
    }


    return (
        <>
            <Navbar />


            <div className="min-h-screen flex items-start justify-center bg-gray-100 pt-8">
                <div className="overflow-x-scroll md:w-3/4 bg-white rounded-lg p-6">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                            </tr>
                        </thead>

                        {!loading && <tbody>
                            {problems.map((item, index) => (

                                <tr key={item.id} className={`hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-100' : ''}`} onClick={() => { navigateToProblem(item.id) }}>
                                    <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-gray-500">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-md font-bold text-black-500 cursor-pointer">{item.statement}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-md font-bold ${diff[item.difficulty]}`}>{item.difficulty}</td>
                                </tr>

                            ))}
                        </tbody>}
                    </table>
                    {loading &&
                        <div className="flex justify-center m-4">
                            <Loader size={96} />
                        </div>
                    }
                    <div className="mt-4 flex justify-between w-full">
                        <button
                            onClick={handlePrevious}
                            className={`px-4 py-2 bg-gray-${currentPage === 0 ? '200' : '500'} text-gray-100 rounded `}
                            disabled={currentPage === 0}
                        >
                            Previous
                        </button>
                        <div>Page {lastpage!==0?currentPage + 1:0} of {lastpage}</div>
                        <button
                            onClick={handleNext}
                            className={`px-4 py-2 bg-gray-${(problems.length === 0 || currentPage+1===lastpage )? '200' : '500'} text-gray-100 rounded `}
                            disabled={problems.length === 0 || currentPage + 1 === lastpage}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <hr />
            <Footer />
        </>
    )
}
