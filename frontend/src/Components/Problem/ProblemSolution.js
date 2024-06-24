import React from "react";
import { useNavigate } from "react-router-dom";

function ProblemSolution({ problem_id }) {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Solutions</h1>
      <button onClick={() => navigate(`/post-solution/${problem_id}`)}>
        Solution
      </button>
    </div>
  );
}

export default ProblemSolution;
