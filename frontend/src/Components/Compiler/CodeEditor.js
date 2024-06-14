import CodeMirror from "@uiw/react-codemirror";
import React, {  useState } from "react";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import Loader from "../Loader/Loader";

const CodeEditor = ({ submitHandler, input,loading }) => {
  const placeHolder = {
    cpp: "// Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
    py: "# Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
    c: "// Start typing your code here\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
  };
  const [code, setCode] = useState(placeHolder["c"]);
  const [language, setLanguage] = useState("c");

  const languageMap = {
    cpp: [cpp()],
    py: [python()],
    c: [cpp()],
  };




  return (
    <div className=" border-2 rounded border-gray-500 mt-2 shadow-lg">
      <div className="p-3  bg-gray-300 flex justify-between">
        <label >
          Language:
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(placeHolder[e.target.value]);
            }}
            className="p-1 mx-2 border rounded "
          >
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
        </label>

        <button
          onClick={() => {
            submitHandler(code, input, language);
          }}
          className={`run-btn flex justify-center items-center w-36 ${loading?'loading-now':''}`}
          disabled={loading}
        >
          {loading && <Loader size={24}/>}
          Run
        </button>
        
      </div>
      <div
        style={{ overflow: "scroll" ,  height: "80vh"}}
        className="rounded shadow "
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

export default CodeEditor;
