import React, { useContext, useEffect, useState } from "react";
import CodingArea from "./CodingArea";
import CustomInput from "./CustomInput";
import ResultWindow from "./ResultWindow";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../AuthContextProvider/AuthProvider";
import { useNavigate } from "react-router-dom";

function ProblemCodeEditor({ problem_id }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [user_id, setUserId] = useState("");
  const base_url = process.env.REACT_APP_API;

  const { isAuthenticated } = useContext(AuthContext);

  const navigate = useNavigate();

  const generateSubmissionId = () => {
    const timestamp = Date.now();
    const randomComponent = Math.random().toString(36).substring(2, 15);
    return `submission_${timestamp}_${randomComponent}`;
  };

  const runHandler = async (code, input, extension) => {
    const request = {
      code,
      input,
      extension,
      submission_id: generateSubmissionId(),
      time_limit: 5,
    };
    // console.log(request);
    const { data } = await axios.post(`${base_url}compile`, request);
    if (data?.status) {
      setOutput(data.verdict);
      setError("");
      console.log("Output set");
      toast.success("Successfully executed");
    } else {
      setOutput("");
      setError(data.verdict);
      toast.error(data.verdict);
    }

    console.log(data);
  };
  const submitHandler = async (code, problem_id, extension) => {
    const request = {
      problem_id,
      code,
      extension,
      user_id
    };
    console.log(request);
    const { data } = await axios.post(`${base_url}submit-answer`, request);
    if (data?.status) {
      toast.success(data.verdict);
    }
    else {
      toast.error(data.verdict);
    }
    console.log(data);
  };

  useEffect(() => {
    if (!isAuthenticated[0]) {
      console.log("here");
      // navigate("/login");
      return;
    }
    setUserId(isAuthenticated[1]?.id);
  }, [isAuthenticated]);

  return (
    <div>
      <CodingArea
        runHandler={runHandler}
        input={input}
        submitHandler={submitHandler}
        problem_id={problem_id}
      />
      <CustomInput setInput={setInput} />
      <ResultWindow output={output} error={error} />
    </div>
  );
}

export default ProblemCodeEditor;
