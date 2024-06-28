import axios from 'axios'
import React, { useEffect, useState } from 'react'
import parse from 'html-react-parser';
import formatTimestamp from '../Problem/formatTimeStamp';


export default function ParticularSolution({ solid, handleClick }) {
    
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
        <button
          className="bg-blue-500 text-white p-2 rounded "
          onClick={() => {
            handleClick(-1);
          }}
        >
          Back
        </button>
      </div>
      <h2 className="text-xl font-bold my-2">{solution.title || "Title"}</h2>
      <p
        className="text-sm my-2"
        style={{ fontStyle: "italic", color: "#808080" }}
      >
        Posted by{" "}
        <a
          href={`/profile/${solution?.userName}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "red" }}
        >
          {solution.userName || "UserName"}
        </a>{" "}
        On {" " + formatTimestamp(solution?.timestamp)}
      </p>
      <hr />
      <br />
      <div>{parse(solution.solution || "hello")}</div>
    </div>
  );
}
