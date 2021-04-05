import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Loader from "../loader/Loader";
import axios from "axios";
import "../style.css";
export default function Vote(props) {
  const history = useHistory();
  const [category, setCategory] = useState([]);

  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/poll/${localStorage.getItem("pollId")}`,
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
        setCategory([...response.data.categories]);
        setLoading(false);
      } catch (error) {
        const err = error.message.split(" ")[5];
        switch (err) {
          case "401":
            setLoading(false);
            toast.error("Session expired", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: "false",
            });
            history.push("/");
            break;

          case "404":
            setLoading(false);
            toast.success("Click again to vote", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: "false",
            });

            break;
          case "405":
            setLoading(false);
            toast.success("Poll Expired", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: "false",
            });
            history.push("/poll");
            break;
          default:
            setLoading(false);
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
    let newCategory = category;

    const catLength = newCategory.length;

    for (let i = 0; i < catLength; i++) {
      if (newCategory[i]._id === category_id) {
        const canLength = newCategory[i].candidate.length;
        for (let j = 0; j < canLength; j++) {
          newCategory[i].candidate[j].voted = false;

          if (newCategory[i].candidate[j]._id === candidate_id) {
            newCategory[i].candidate[j].voted = true;
          }
        }
      }
    }
    setCategory([...newCategory]);
  };
  const voteCandidate = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3002/poll/vote/`,
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
        setLoading(false);
        toast.success("You have voted successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: "false",
        });
        history.push("/stats");
      }
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "403":
          setLoading(false);
          toast.error("You have already voted", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          history.push("/stats");
          break;
        case "401":
          setLoading(false);
          toast.error("Session expired", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          history.push("/");

          break;
        default:
          setLoading(false);
          toast.error("Network error", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
      }
    }
  };

  return (
    <div className="poll-container">
      {loading ? <Loader style={{ position: "fixed" }} /> : null}
      <h3
        style={{
          alignSelf: "flex-start",
          marginLeft: "20px",
          color: "#fff",
          fontSize: "18px",
          borderBottomStyle: "solid",
          borderWidth: "5px",
          padding: "5px",
        }}
      >
        Poll Name: {localStorage.getItem("pollName")}
      </h3>
      <ToastContainer limit={1} />
      <div
        className="poll-body"
        style={{
          justifyContent: "center",
          alignSelf: "center",
          marginTop: "40px",
          borderRadius: 0,
        }}
      >
        {category.map((item) => (
          <div className="create-poll-candidate-div" key={item._id}>
            <p className="create-poll-candidate-label">Category: {item.name}</p>

            {item.candidate.map((obj) => (
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
                <p style={{ marginRight: "20px" }}>Votes: {obj.votes}</p>
                <button
                  style={{
                    marginRight: "20px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    textAlign: "center",
                    border: "none",
                    //background: "rgb(61, 187, 61)",
                    color: "#fff",
                    outline: "none",
                  }}
                  className={
                    obj.voted || obj.voters.includes(token.mobile_id)
                      ? "green"
                      : "yellow"
                  }
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
          onClick={() => voteCandidate()}
        >
          Done
        </button>
      </div>
    </div>
  );
}
