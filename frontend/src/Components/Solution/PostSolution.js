import React, { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../AuthContextProvider/AuthProvider";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";

function PostSolution({handleValid,clicked}) {
  const [solution, setSolution] = useState("");
  const [title, setTitle] = useState("");
  const [user_id, setUserId] = useState("");
  const [problem_id, setProblemId] = useState(null);
  const [accpetdUser, setAcceptedUser] = useState(null);
  const editor = useRef(null);


  const params = useParams();
  const { isAuthenticated } = useContext(AuthContext);

  const base_url = process.env.REACT_APP_API;

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (solution.length === 0) {
      toast.error('Solution should not be empty')
      return
    }
    const request = {
      problem_id,
      user_id,
      solution,
      title,
    };
    console.log(request);
    // toast.success('hi')
    // return

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
            handleValid(true)
            setAcceptedUser(true);
          } else {
            console.log("User cannot post solution");
            // console.log();
            handleValid(false)
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

  // useEffect(() => {
  //   validateUser();
  // }, [user_id,problem_id]);
  return (
    <div>
      {/* <Navbar /> */}
      {!isAuthenticated[0] ? (
        <div className="h-48 justify-center items-center">
          <Loader size={96} />
        </div>
      ) : (
        <div>
          <h1 className="text-xl font-bold my-2">Your Solution</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="text-xl font-bold " htmlFor="title">Title:</label>
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => { setTitle(e.target.value) }}
                placeholder="Title of your solution"
                className="w-full h-12 px-3 py-2 rounded border
                                hover:bg-gray-200 mx-auto md:mx-0
                                border-blue-100 focus:outline-none focus:text-black my-2"
                required
              />

              <br />
              <label className="text-xl font-bold my-2" htmlFor="solution">Solution:</label>
              <br />
              <JoditEditor
                ref={editor}
                value={solution}
                id='solution'
                onChange={newContent => setSolution(newContent)}
              />
              {/* <textarea
                id="solution"
                name="solution"
                value={solution}
                onChange={(e) => {
                  setSolution(e.target.value);
                }}
                style={{ border: "1px solid black" }}
                required
              /> */}
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-green-500 text-white font-bold p-2 my-2 rounded"
                onClick={handleSubmit}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostSolution;
