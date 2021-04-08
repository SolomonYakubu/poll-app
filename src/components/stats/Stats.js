import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useHistory } from "react-router-dom";
import axios from "axios";
export default function Stats(props) {
  const history = useHistory();
  const [data, setData] = useState();
  const pollId = localStorage.getItem("pollId");
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const getData = async () => {
      props.load(true);
      try {
        const response = await axios.get(
          `http://192.168.43.244:3002/poll/stats/${pollId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        setData(response.data);
        props.load(false);
        // setLoading(false);
      } catch (error) {
        const err = error.message.split(" ")[5];
        props.load(false);
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
  let dataToRender;

  if (data) {
    dataToRender = (
      <>
        <div className="stats-voters-count-div">
          <div
            style={{
              color: "#696969",
              fontSize: "17px",
              fontFamily: "poppins",
            }}
          >
            Votes
          </div>
          <div style={{ fontWeight: 600, fontSize: "50px" }}>
            {data.totalVoters}
          </div>
        </div>
        {data.categoryStat.map((item) => (
          <div className="stats-category-div" key={item._id}>
            <div className="stats-category-heading">{item.name}</div>
            <div>
              {item.candidates.map((obj) => (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "92%",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "10px",
                    alignSelf: "center",
                    margin: "10px",
                    borderStyle: "solid",
                    borderColor: "#f4f4f4",
                    borderRadius: "5px",
                    borderWidth: "2px",
                  }}
                  key={obj._id}
                >
                  <div style={{ marginRight: "2px" }}>{obj.name}</div>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: "4px",
                      justifyContent: "flex-start",
                      width: "100%",
                    }}
                  >
                    <progress
                      value={`${(obj.votes / item.totalVoters) * 100}`}
                      max="100"
                      style={{
                        width: "80%",
                        borderWidth: "3px",
                        alignSelf: "start",
                        float: "left",
                        backgroundColor: "#eee",
                        borderRadius: "2px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.25) inset",
                        marginLeft: 0,
                      }}
                    >
                      {(obj.votes / item.totalVoters) * 100}
                    </progress>
                    <div
                      style={{
                        fontSize: "11px",
                        marginLeft: "10px",
                        color: "#696969",
                      }}
                    >
                      {((obj.votes / item.totalVoters) * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div
                    style={{
                      margin: "5px",
                      fontSize: "12px",
                      color: "#a9a9a9",
                      marginBottom: 0,
                    }}
                  >
                    Votes: {obj.votes}
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
      <ToastContainer />
      <h1
        style={{
          color: "#fff",
          background: "#50c878",
          width: "90%",
          borderRadius: "5px",
          marginTop: "15px",
          fontFamily: "poppins",
        }}
      >
        Statistics
      </h1>

      {dataToRender}
    </div>
  );
}
