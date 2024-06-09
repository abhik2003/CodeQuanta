import React, { useState } from 'react'
import CodingArea from './CodingArea'
import CustomInput from './CustomInput'
import ResultWindow from './ResultWindow'
import axios from 'axios';

function ProblemCodeEditor() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");

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
      const { data } = await axios.post(
        "http://127.0.0.1:5000/compile",
        request
      );
      if (data?.status) {
        setOutput(data.verdict);
        setError("");
        console.log("Output set");
      } else {
        setOutput("");
        setError(data.verdict);
      }

      console.log(data);
    };
  return (
    <div>
      <CodingArea runHandler={runHandler} input={input} />
      <CustomInput setInput={setInput} />
      <ResultWindow output={output} error={error} />
    </div>
  );
}

export default ProblemCodeEditor