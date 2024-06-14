import React from "react";

function Console({ input, setInput, output, error }) {
  return (
    <div className=" border-2 border-gray-500 mt-2 rounded ">
      <div className="  p-2 my-2 border-b-2 border-gray-500 ">
        <h4 className="text-xl font-bold text-center  p-2 rounded-top  ">Input</h4>
        <div className="flex justify-center p-1  ">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              width: "100%",
              padding: "5px",
              height: "34vh",
              resize: "none",
              overflow: "scroll",
              background:"transparent",
              }
            }
            className="border-2 border-gray-500"
            
          />
        </div>
      </div>
      <div className="p-2  my-2">
        <h4 className="text-xl font-bold text-center p-2 rounded-top ">Output</h4>
        <div className="flex justify-center p-1  ">
          <textarea
            value={error ? error : output}
            style={{
              width: "100%",
              padding: "5px",
              height: "33vh",
              resize: "none",
              overflow: "scroll",
              background:"transparent",
              
            }}
            className={`border-2 border-gray-500 text-${error?'red-500':'black'}`}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default Console;
