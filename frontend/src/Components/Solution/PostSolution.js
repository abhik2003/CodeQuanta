import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthContextProvider/AuthProvider";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";

function PostSolution() {
  const [solution, setSolution] = useState("");
  const [title, setTitle] = useState("");
  const [user_id, setUserId] = useState("");
  const [problem_id, setProblemId] = useState(null);
  const [accpetdUser, setAcceptedUser] = useState(null);

  const params = useParams();
  const { isAuthenticated } = useContext(AuthContext);

  const base_url = process.env.REACT_APP_API;

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const request = {
      problem_id,
      user_id,
      solution,
      title,
    };
    console.log(request);

    const { data } = await axios.post(`${base_url}add-solution`, request);

    toast.success(data?.message);
  };

  //check whether user has accepted submission against this problem or not
    const validateUser = async () => {
        if (!problem_id || !user_id) return;
    const request = {
      problem_id: problem_id,
      user_id: user_id,
    };
    console.log(request);

       axios
      .post(`${base_url}check-accepted-user`, request)
      .then((response) => {
        if (response.status === 200) {
          const { data } = response;
          if (data?.ok) {
            console.log("User verified");
            setAcceptedUser(true);
          } else {
            console.log("User cannot post solution");
            // console.log();
            navigate(`/problem/${problem_id}`);
          }
        } else {
          console.log(response.data, response.status);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    
  };
  useEffect(() => {
    if (params?.id) setProblemId(params?.id);
  }, [params?.id]);

  useEffect(() => {
    console.log(isAuthenticated);
    if (!isAuthenticated) return;
    if (!isAuthenticated[0]) {
      console.log("user not log in");
      //   navigate("/login");
      return;
    } else {
    }
    console.log("Logged success");
    setUserId(isAuthenticated[1]?.id);
    validateUser(isAuthenticated[1]?.id);
  }, [isAuthenticated]);

    useEffect(() => {
        validateUser();
    }, [problem_id, user_id]);
  return (
    <div>
      <Navbar />
      {!isAuthenticated[0] ? (
        <div className="h-48 justify-center items-center">
          <Loader size={96} />
        </div>
      ) : (
        <div>
          <h1>Submit Solution</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="solution">Title:</label>
              <input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your title"
              />
              <br />
              <label htmlFor="solution">Solution:</label>
              <br />
              <textarea
                id="solution"
                name="solution"
                value={solution}
                onChange={(e) => {
                  setSolution(e.target.value);
                }}
                style={{ border: "1px solid black" }}
                required
              />
            </div>
            <button
              type="submit"
              style={{ border: "1px solid black" }}
              onClick={handleSubmit}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostSolution;
