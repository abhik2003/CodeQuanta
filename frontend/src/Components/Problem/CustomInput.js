import React from "react";

function CustomInput({input, setInput}) {
  return (
    <div
      style={{ padding: "12px", borderBottom: "1px solid rgb(223, 226, 230)" }}
    >
      <p>Test against custom input</p>
      <div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            width: "100%",
            padding: "5px",
            height: "120px",
            resize: "none",
            overflow: "auto",
            border: "1px solid rgb(223, 226, 230)",
          }}
        />
      </div>
    </div>
  );
}

export default CustomInput;
