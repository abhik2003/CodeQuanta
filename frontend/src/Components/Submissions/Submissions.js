import React, { useState } from 'react'
import formatTimestamp from '../Problem/formatTimeStamp';
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";


function Submissions({ submissions }) {
    const [viewSub, setViewSub] = useState("");

    const [clipboardValue, setClipboardValue] = useState("");
    const handleCopy = () => {
      toast.success("Source code copied to cloipboard");
    };

    const languageMap = {
      cpp: "C++",
      py: "Python",
      c: "C",
    };

  return (
    <div>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Language</th>
            <th scope="col">Status</th>
            <th scope="col">Time</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => (
            <tr
              key={submission.id}
              onClick={() => {
                // console.log(submission.id);
                setViewSub(submission);
                setClipboardValue(submission.code);
              }}
              style={{ cursor: "pointer" }}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <td>{index + 1}</td>
              <td>{languageMap[submission.extension]}</td>
              {submission.status ? (
                <td style={{ color: "green" }}>{submission.verdict}</td>
              ) : (
                <td style={{ color: "red" }}>{submission.verdict}</td>
              )}
              <td>{formatTimestamp(submission.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" style={{ maxWidth: "80vw" }}>
          <div
            class="modal-content"
            style={{
              width: "max-content",
              maxWidth: "100%",
              overflowX: "auto",
              margin: "auto",
            }}
          >
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Problem : {` ${viewSub?.problem_name}, `}
                Status :{" "}
                {viewSub?.status ? (
                  <span style={{ color: "green" }}>{viewSub?.verdict}</span>
                ) : (
                  <span style={{ color: "red" }}>{viewSub?.verdict}</span>
                )}
                {`,  Language : ${languageMap[viewSub?.extension]}`}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <pre>{viewSub?.code}</pre>
            </div>
            <div class="modal-footer">
              <CopyToClipboard text={clipboardValue} onCopy={handleCopy}>
                <button className="btn copy-btn">Copy</button>
              </CopyToClipboard>
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Submissions