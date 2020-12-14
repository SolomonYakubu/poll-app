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
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/poll/${localStorage.getItem("pollName")}`,
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

  const voteCandidate = async (val) => {
    setLoading(true);
    for (let x = 0; x < category.length; x++) {
      if (category[x].candidate.map((item) => item._id).includes(val)) {
        await setCategoryId(category[x]._id);
        break;
      }
    }
    console.log(categoryId);
    console.log(val);
    try {
      const response = await axios.post(
        `http://localhost:3002/poll/vote/category/${categoryId}/candidate/${val}`,
        {
          pollName: localStorage.getItem("pollName"),
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
        }
      );

      setCategory([...response.data.categories]);
      setCategoryId("");
      setLoading(false);
      console.log(response);
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "403":
          setLoading(false);
          toast.error("You have already voted in this category", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
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

        case "404":
          setLoading(false);
          toast.success("Click again to vote", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });

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
      {loading ? <Loader style={{ float: "right" }} /> : null}
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
      <ToastContainer />
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

            {item.candidate.map((item) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: "20px",
                }}
                key={item._id}
              >
                <div
                  style={{
                    marginBottom: "2px",
                    fontSize: "16px",
                    marginLeft: "25px",
                  }}
                >
                  {item.name}
                </div>
                <p style={{ marginRight: "20px" }}>Votes: {item.votes}</p>
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
                    item.voters.includes(token.mobile_id) ? "green" : "yellow"
                  }
                  // key={item._id}
                  // value={item._id}
                  onClick={() => voteCandidate(item._id)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
              </div>
            ))}
          </div>
        ))}
        <button
          className="poll-create-poll-btn"
          onClick={() => history.push("/poll")}
        >
          Done
        </button>
      </div>
    </div>
  );
}
