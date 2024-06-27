import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ParticularSolution from './ParticularSolution'

export default function AllSolution() {
    const [solutions,setSolutions]=useState([])
    const [solid,setSolId]=useState(-1)
    const params=useParams()
    const url=process.env.REACT_APP_API
    const getAllSolution=async()=>{
        try {
            const result=await axios.post(`${url}get-all-solutions`,{
                'problem_id':params?.id ||0
            })
            // console.log(result.data.solutions)
            setSolutions(result.data.solutions)
        } catch (error) {
            console.log(error)
        }
        
    }

    const handleClick=(id)=>{
         setSolId(id)
    }

    useEffect(()=>{
        getAllSolution()
    },[])
  return (
    <div>
      {solid===-1 && solutions.map((sol,index)=>{
        return (
            <div className={`p-2 flex justify-start ${index%2===0?'bg-white':'bg-gray-100'}`} onClick={()=>{
                handleClick(sol.id)
            }}>
                
                <p className="mx-2">{sol.userName || 'ABC'}</p>
                <p className="mx-2 font-bold">{sol.title?.substring(0,20) || 'title'}</p>
            </div>

        )
      })}
      {solid!==-1 && <ParticularSolution solid={solid} handleClick={handleClick} />}
    </div>
  )
}
