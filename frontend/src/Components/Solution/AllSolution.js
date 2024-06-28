import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import ParticularSolution from "./ParticularSolution";
import formatTimestamp from "../Problem/formatTimeStamp";

export default function AllSolution() {
  const [solutions, setSolutions] = useState([]);
  const [solid, setSolId] = useState(-1);
  const params = useParams();
  const url = process.env.REACT_APP_API;
  const getAllSolution = async () => {
    try {
      const result = await axios.post(`${url}get-all-solutions`, {
        problem_id: params?.id || 0,
      });
      // console.log(result.data.solutions)
      setSolutions(result.data.solutions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (id) => {
    setSolId(id);
  };

  useEffect(() => {
    getAllSolution();
  }, []);
  return (
    <div>
      {solid === -1 && (
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">User</th>
              <th scope="col">Title</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {solutions.map((sol, index) => {
              return (
                <tr
                  key={index}
                  onClick={() => {
                    handleClick(sol.id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <a
                      href={`/profile/${sol.userName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "red" }}
                    >
                      {sol.userName}
                    </a>
                  </td>

                  <td>{sol.title?.substring(0, 20) || "Title"}</td>
                  <td>{formatTimestamp(sol.timestamp)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {solid !== -1 && (
        <ParticularSolution solid={solid} handleClick={handleClick} />
      )}
    </div>
  );
}
