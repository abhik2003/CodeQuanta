import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import formatTimestamp from "./formatTimeStamp";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import Submissions from "../Submissions/Submissions";
import { AuthContext } from "../../AuthContextProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

function ProblemSubmissions({ problem_id, problem_name }) {
  const [submissions, setSubmissions] = useState([]);
  const base_url = process.env.REACT_APP_API;
  const [user_id, setUserId] = useState("");
  
  const { isAuthenticated,loaded } = useContext(AuthContext);

  const navigate = useNavigate();

  const getSubmissions = async () => {
    const { data } = await axios.post(
      `${base_url}get-submissions-user-problem`,
      { problem_id, user_id }
    );
    setSubmissions(data?.submissions);
  };

  useEffect(() => {
    if (problem_id && user_id) getSubmissions();
  }, [problem_id, user_id]);

  useEffect(() => {
    if (loaded && !isAuthenticated[0]) {
      navigate("/problems");
      return;
    }
    
    setUserId(isAuthenticated[1]?.id);
  }, [loaded,isAuthenticated]);

  return (
    <Submissions submissions={submissions}/>
    
  );
}

export default ProblemSubmissions;
