import React, { useContext, useEffect, useState } from "react";
import "./Problem.css";
import ProblemStatement from "./ProblemStatement";
import ProblemSubmissions from "./ProblemSubmissions";
import ProblemSolution from "./ProblemSolution";
import ProblemCodeEditor from "./ProblemCodeEditor";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../AuthContextProvider/AuthProvider";
import Loader from "../Loader/Loader";
function Problem() {
  const [problem, setProblem] = useState(null);
  const [problem_id, setProblemId] = useState(null);

  const params = useParams();
  const base_url = process.env.REACT_APP_API;

  const getProblem = async () => {
    const { data } = await axios.post(`${base_url}get-question`, { "id": params.id });
    setProblem(data?.question);
    setProblemId(data?.question?.id);
  }

  const { loaded } = useContext(AuthContext);
  
  useEffect(() => {
    if (params?.id) getProblem();
  }, [params?.id])

  return (
    <>
      {!loaded &&
        <div className="h-48 justify-center items-center">
          <Loader size={96} />
        </div>
      }
      {loaded && <div className="problempage-main">
        <div className="row">
          <div className="col-6 problempage-left">
            <div>
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
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
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
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
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
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
              className="tab-content"
              id="myTabContent"
              style={{ overflowY: "scroll", padding: "20px" }}
            >
              <div
                className="tab-pane fade show active"
                id="statement-tab-pane"
                role="tabpanel"
                aria-labelledby="statement-tab"
                tabindex="0"
                style={{}}
              >
                <ProblemStatement problem={problem} />
              </div>
              <div
                className="tab-pane fade"
                id="submissions-tab-pane"
                role="tabpanel"
                aria-labelledby="submissions-tab"
                tabindex="0"
              >
                <ProblemSubmissions problem_id={problem_id} problem_name={problem?.statement} />
              </div>
              <div
                className="tab-pane fade"
                id="solution-tab-pane"
                role="tabpanel"
                aria-labelledby="solution-tab"
                tabindex="0"
              >
                <ProblemSolution problem_id={problem_id}/>
              </div>
            </div>
          </div>
          <div className="col-6 problempage-right">
            <ProblemCodeEditor problem_id={problem_id} />
          </div>
        </div>
      </div>}
    </>
  );
}

export default Problem;
