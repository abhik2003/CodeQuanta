import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostSolution from "../Solution/PostSolution";
import { AuthContext } from "../../AuthContextProvider/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";
import AllSolution from "../Solution/AllSolution";
function ProblemSolution({ problem_id }) {
  const navigate = useNavigate();
  const [showsol, setShowSol] = useState(true)
  const [valid, setValid] = useState(null)
  const [clicked,setClicked]=useState(null)
  const [problemId,setProblem_id]=useState(0)
  const [userId,setUserId]=useState(null)
  const { isAuthenticated,loaded } = useContext(AuthContext);
  const params=useParams()
  const base_url = process.env.REACT_APP_API;

  const validateUser = async () => {
    if (!problemId || !userId ) return;
    if(valid===true){
      console.log('validating but true')
      handleValid(true)
      return
    }
    const request = {
      problem_id: problemId,
      user_id: userId,
    };
    console.log(request);

    axios
      .post(`${base_url}check-accepted-user`, request)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response;
          if (data?.ok) {
            console.log("User verified");
            handleValid(true)
            // setAcceptedUser(true);
          } else {
            console.log("User cannot post solution");
            // console.log();
            handleValid(false)
            
          }
        } else {
          console.log(response.data, response.status);
        }
      })
      .catch((err) => {
        console.log(err);
      });

  };


  const handleValid = (val) => {
    console.log('hello', val)
    if (val === true){
      setValid(true)
      setShowSol(true)

    }
    else{
      if(valid===false){
        toast.error('Submit a successfull solution to add it here')
      }
      else
      setValid(false)
      setShowSol(false)

    }
  }
  console.log(valid)

  useEffect(()=>{
    setProblem_id(params?.id)
    setUserId(isAuthenticated[1]?.id)
    // validateUser()
  },[loaded])
  useEffect(()=>{
    validateUser()
  },[userId,problemId])
  return (
    <div>
      <ul className="nav nav-tabs" id="solTab" role="tablist">
        <li className={`nav-item nav-link ${showsol?'active':''} `} role="presentation" onClick={() => { validateUser() }}>Your Solution</li>
        <li className={`nav-item nav-link ${!showsol?'active':''}`} onClick={()=>{setShowSol(false)}} role="presentation">
          Others Solution
        </li>
      </ul>
      {/* <h1>Solutions</h1>
      <button onClick={() => navigate(`/post-solution/${problem_id}`)}>
        Solution
      </button> */}
      {showsol && <PostSolution handleValid={handleValid} clicked={clicked} />}
      {!showsol && <AllSolution/>}
    </div>
  );
}

export default ProblemSolution;
