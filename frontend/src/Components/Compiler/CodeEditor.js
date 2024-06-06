import CodeMirror from "@uiw/react-codemirror";
import React, {  useState } from "react";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";

const CodeEditor = ({ submitHandler, input }) => {
  const [code, setCode] = useState("// Start typing your code here\n");
  const [language, setLanguage] = useState("c");

  const languageMap = {
    cpp: [cpp()],
    py: [python()],
    c: [cpp()],
  };

  const placeHolder = {
    cpp: "// Start typing your code here\n",
    py: "# Start typing your code here\n",
    c: "// Start typing your code here\n",
  };



  return (
    <div>
      <div style={{ marginBottom: "10px", padding: "10px" }}>
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

        <buutton
          onClick={() => {
            submitHandler(code, input, language);
          }}
          className="run-btn"
        >
          Run
        </buutton>
      </div>
      <CodeMirror
        value={code}
        options={{
          // theme: "night",
          lineNumbers: true,
        }}
        extensions={languageMap[language]}
        onChange={(value, viewUpdate) => {
          setCode(value);
        }}
        minHeight="100vh"
        style={{ overflow: "scroll" }}
      />
    </div>
  );
};

export default CodeEditor;
