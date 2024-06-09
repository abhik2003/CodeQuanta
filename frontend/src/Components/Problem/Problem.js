import React from "react";
import "./Problem.css";
import ProblemStatement from "./ProblemStatement";
import ProblemSubmissions from "./ProblemSubmissions";
import ProblemSolution from "./ProblemSolution";
import ProblemCodeEditor from "./ProblemCodeEditor";
function Problem() {
  return (
    <div class="problempage-main">
      <div class="row">
        <div className="col-6 problempage-left">
          <div>
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link active"
                  id="statement-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#statement-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="statement-tab-pane"
                  aria-selected="true"
                >
                  Statement
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="submissions-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#submissions-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="submissions-tab-pane"
                  aria-selected="false"
                >
                  Submissions
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  id="solution-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#solution-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="solution-tab-pane"
                  aria-selected="false"
                >
                  Solution
                </button>
              </li>
            </ul>
          </div>
          <div
            class="tab-content"
            id="myTabContent"
            style={{ overflowY: "scroll", padding: "20px" }}
          >
            <div
              class="tab-pane fade show active"
              id="statement-tab-pane"
              role="tabpanel"
              aria-labelledby="statement-tab"
              tabindex="0"
              style={{}}
            >
              <ProblemStatement />
            </div>
            <div
              class="tab-pane fade"
              id="submissions-tab-pane"
              role="tabpanel"
              aria-labelledby="submissions-tab"
              tabindex="0"
            >
              <ProblemSubmissions />
            </div>
            <div
              class="tab-pane fade"
              id="solution-tab-pane"
              role="tabpanel"
              aria-labelledby="solution-tab"
              tabindex="0"
            >
              <ProblemSolution />
            </div>
          </div>
        </div>
        <div className="col-6 problempage-right">
          <ProblemCodeEditor />
        </div>
      </div>
    </div>
  );
}

export default Problem;
