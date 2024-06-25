import axios from 'axios'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';

export default function ParticularSolution({solid,handleClick}) {
    const [solution,setSolution]=useState(0)
    const url=process.env.REACT_APP_API
    const handleQuestion=async()=>{
        console.log(solid)
        const result=await axios.post(`${url}get-one-solution`,{
            'solution_id':solid
        })
        console.log(result.data?.solution)
        setSolution(result.data.solution)
    }
    useEffect(()=>{
        handleQuestion()
    },[])
  return (
    <div>
      <div className="flex my-2">
        <button className="bg-blue-500 text-white p-2 rounded " onClick={()=>{handleClick(-1)}}>Back</button>
      </div>
      <h1 className="text-xl my-2">Solution posted by {solution.userName || 'UserName'}</h1>
      <hr />
      <p className="text-md font-bold my-2">{solution.title || 'Title'}</p>
      <div>
        {parse(solution.solution || 'hello')}
      </div>
      
    </div>
  )
}
