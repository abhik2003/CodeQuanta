import React from 'react'

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
      <p>{formattedDescription}</p>
    </div>
  );
}

export default ProblemStatement