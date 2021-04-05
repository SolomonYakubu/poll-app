import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useHistory } from "react-router-dom";
import axios from "axios";
export default function Stats() {
  const history = useHistory();
  const [data, setData] = useState();
  const pollId = localStorage.getItem("pollId");
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/poll/stats/${pollId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        setData(response.data);
        console.log(response.data);
        // setLoading(false);
      } catch (error) {
        const err = error.message.split(" ")[5];
        switch (err) {
          case "401":
            // setLoading(false);
            toast.error("Session expired", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: "false",
            });
            history.push("/");
            break;

          default:
            // setLoading(false);
            toast.error("Network error", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: "false",
            });
        }
      }
    };
    getData();

    //eslint-disable-next-line
  }, []);
  console.log(data);
  let dataToRender;

  if (data) {
    dataToRender = (
      <>
        <div className="stats-voters-count-div">
          <div style={{ color: "#696969" }}>Votes</div>
          <div style={{ fontWeight: 600, fontSize: "50px" }}>
            {data.totalVoters}
          </div>
        </div>
        {data.categoryStat.map((item) => (
          <div className="stats-category-div">
            <div className="stats-category-heading">{item.name}</div>
            <div>
              {item.candidates.map((obj) => (
                <div
                  style={{
                    display: "flex",
                    width: "90%",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    paddingLeft: "20px",
                    margin: "10px",
                  }}
                >
                  <div>{obj.name}</div>
                  <div style={{ display: "flex" }}>
                    <progress
                      value={`${(obj.votes / item.totalVoters) * 100}`}
                      max="100"
                    >
                      {(obj.votes / item.totalVoters) * 100}
                    </progress>
                    <div style={{ fontSize: "11px", marginLeft: "10px" }}>
                      {((obj.votes / item.totalVoters) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="stats-container">
      <h1
        style={{
          color: "#fff",
          background: "rgb(61, 187, 61)",
          width: "90%",
          borderRadius: "5px",
        }}
      >
        Statistics
      </h1>

      {dataToRender}
    </div>
  );
}
