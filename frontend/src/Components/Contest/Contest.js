import React from 'react'
import { useNavigate } from 'react-router-dom';

function Contest() {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
  };

  const messageStyle = {
    fontSize: "24px",
    fontWeight: "bold",
  };
    
    const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <div style={messageStyle}>
        Exciting contests are coming soon! Stay tuned for updates and get ready
              to challenge your coding skills on CodeQuanta.
              <br/>
              <br/>
              <button
                  onClick={()=>navigate(-1)}
                  style={{ border: "1px solid black", padding:"5px"}}
              >Go Back</button>
      </div>
    </div>
  );
}

export default Contest