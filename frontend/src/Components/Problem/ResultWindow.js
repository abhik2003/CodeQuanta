import React from 'react'

function ResultWindow({ output, error}) {
  return (
    <div
      style={{ padding: "12px", borderBottom: "1px solid rgb(223, 226, 230)" }}
    >
      <p>Result</p>
      <div>
        <textarea
          value={error ? error : output}
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

export default ResultWindow