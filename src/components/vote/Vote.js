import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import "../style.css";
export default function Vote(props) {
  const history = useHistory();
  const [category, setCategory] = useState([]);
  const [data, setData] = useState();

  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    const getData = async () => {
      props.load(true);
      try {
        const response = await axios.get(
          `http://192.168.43.244:3002/poll/${localStorage.getItem("pollId")}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          }
        );
        //eslint-disable-next-line
        if (response.data.categories == 0) {
          toast.error("This Poll is empty", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          setTimeout(() => history.push("/poll"), 3000);
        }
        setData(response.data);
        setCategory([...response.data.categories]);
        props.load(false);
      } catch (error) {
        const err = error.message.split(" ")[5];
        props.load(false);
        switch (err) {
          case "401":
            toast.error("Session expired", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: "false",
            });
            history.push("/");
            break;

          case "405":
            toast.success("Poll Expired", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: "false",
            });
            history.push("/poll");
            break;
          default:
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
  const vote = (candidate_id, category_id) => {
    if (data.voted) {
      return;
    }
    let newCategory = category;

    const catLength = newCategory.length;

    for (let i = 0; i < catLength; i++) {
      if (newCategory[i]._id === category_id) {
        const canLength = newCategory[i].candidates.length;
        if (!data.voted) {
          newCategory[i].voted = false;
        }

        for (let j = 0; j < canLength; j++) {
          newCategory[i].candidates[j].voted = false;

          if (newCategory[i].candidates[j]._id === candidate_id) {
            newCategory[i].voted = true;

            newCategory[i].candidates[j].voted = true;
          }
        }
      }
    }
    setCategory([...newCategory]);
  };
  const voteCandidate = async () => {
    props.load(true);
    if (data.voted) {
      return history.push("/stats");
    }

    try {
      const response = await axios.post(
        `http://192.168.43.244:3002/poll/vote/`,
        {
          pollId: localStorage.getItem("pollId"),
          vote: { categories: category },
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        }
      );
      if (response.status === 200) {
        props.load(false);
        toast.success("You have voted successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: "false",
        });
        history.push("/stats");
      }
    } catch (error) {
      const err = error.message.split(" ")[5];
      console.log(error);
      props.load(false);
      switch (err) {
        case "403":
          toast.error("You have already voted", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          history.push("/stats");
          break;
        case "401":
          toast.error("Session expired", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          history.push("/");

          break;
        default:
          toast.error("Network error", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
      }
    }
  };

  let btn;
  if (data) {
    btn = data.voted ? "View Stats" : "Submit";
  }
  return (
    <div className="poll-container">
      <h5
        style={{
          alignSelf: "start",
          margin: "20px",
          marginTop: "30px",
          fontWeight: "300",
          color: "#36454f",
        }}
      >
        {localStorage.getItem("pollName")}
      </h5>
      <ToastContainer limit={1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignSelf: "center",
          marginTop: "40px",
          borderRadius: 0,
          width: "90%",
          boxSizing: "border-box",
        }}
      >
        {category.map((item) => (
          <div className="create-poll-candidate-div" key={item._id}>
            <p className="create-poll-candidate-label">{item.name}</p>

            {item.candidates.map((obj) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "20px",
                }}
                key={obj._id}
              >
                <div
                  style={{
                    marginBottom: "2px",
                    fontSize: "16px",
                    marginLeft: "25px",
                  }}
                >
                  {obj.name}
                </div>

                <button
                  style={{
                    marginRight: "20px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    textAlign: "center",
                    border: "none",
                    //background: "rgb(61, 187, 61)",
                    // background: "#f4f4f4",
                    color: "#fff",
                    outline: "none",
                  }}
                  className={obj.voted ? "green" : "grey"}
                  // key={item._id}
                  // value={item._id}
                  onClick={() => vote(obj._id, item._id)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
            ))}
          </div>
        ))}
        <button
          className="poll-create-poll-btn"
          style={{ width: "100%", alignSelf: "center", background: " #50c878" }}
          onClick={() => voteCandidate()}
        >
          {btn}
        </button>
      </div>
    </div>
  );
}
