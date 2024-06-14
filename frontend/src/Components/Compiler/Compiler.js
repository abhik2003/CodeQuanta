import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import "./Compiler.css";
import axios from "axios";
import Console from "./Console";
import Navbar from "../Navbar/Navbar";
function Compiler() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading,setLoading]=useState(false)
  const base_url = process.env.REACT_APP_API;

  const generateSubmissionId = () => {
    const timestamp = Date.now();
    const randomComponent = Math.random().toString(36).substring(2, 15);
    return `submission_${timestamp}_${randomComponent}`;
  };

  const submitHandler = async (code, input, extension) => {
    setLoading(true)
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
      setLoading(false)
      // console.log("Output set");
    } else {
      setOutput("");
      setError(data.verdict);
      setLoading(false)

    }

    console.log(data);
  };
  return (
    <>
      <Navbar />
      <div class="compiler-main w-full">
        <div class="flex justify-center bg-gray-100 p-1">
          <div className="w-3/4 compiler-left ">
            <CodeEditor submitHandler={submitHandler} input={input} loading={loading} />
          </div>
          <div className="w-1/4 compiler-right">
            <Console
              input={input}
              setInput={setInput}
              output={output}
              error={error}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Compiler;
