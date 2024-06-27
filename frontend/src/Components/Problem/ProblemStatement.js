import React from 'react'
import parse from 'html-react-parser';

function ProblemStatement({ problem }) {
  const formattedDescription = problem?.description.split("\n").map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));
  
  return (
    <div style={{ height: "100%", overflowY: "scroll" }}>
      <h2 style={{fontSize: "30px", fontWeight:"500"}} className='mb-3'>{problem?.statement}</h2>
      <p>{parse(problem?.description || '')}</p>
    </div>
  );
}

export default ProblemStatement