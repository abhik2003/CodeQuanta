import React from "react";

function Console({ input, setInput, output, error }) {
  return (
    <div>
      <div>
        <h4>Input</h4>
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              padding: "5px",
              height: "45vh",
              resize: "none",
              overflow: "scroll",
            }}
          />
        </div>
      </div>
      <div>
        <h4>Output</h4>
        <div>
          <textarea
                      value={
                          error ? error : output
            }
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              padding: "5px",
              height: "45vh",
              resize: "none",
              overflow: "scroll",
            }}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default Console;
