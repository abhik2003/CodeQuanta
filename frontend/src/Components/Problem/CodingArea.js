import CodeMirror from "@uiw/react-codemirror";
import React, { useState } from "react";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";


const CodingArea = ({ runHandler, submitHandler, input, problem_id }) => {
  const placeHolder = {
    cpp: "// Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
    py: "# Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
    c: "// Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
  };
  const [code, setCode] = useState(placeHolder["c"]);
  const [language, setLanguage] = useState("c");

  const languageMap = {
    cpp: [cpp()],
    py: [python()],
    c: [cpp()],
  };

  return (
    <div>
      <div
        style={{
          padding: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label>
          Language:
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(placeHolder[e.target.value]);
            }}
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
        </label>
        <div style={{ display: "inline-block" }}>
          <buutton
            onClick={() => {
              runHandler(code, input, language);
            }}
            id="problem-run-btn"
          >
            Run
          </buutton>
          <buutton
            onClick={() => {
              submitHandler(code, problem_id, language);
            }}
            id="problem-submit-btn"
          >
            Submit
          </buutton>
        </div>
      </div>
      <div
        style={{
          overflow: "scroll",
          height: "50vh",
          border: "1px solid rgb(223, 226, 230)",
        }}
      >
        <CodeMirror
          value={code}
          extensions={languageMap[language]}
          onChange={(value, viewUpdate) => {
            setCode(value);
          }}
        />
      </div>
    </div>
  );
};

export default CodingArea;
