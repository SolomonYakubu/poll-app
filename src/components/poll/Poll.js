import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "../style.css";

function CreatPoll(props) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [date, setDate] = useState(`${new Date()}`);
  const [name, setName] = useState("");

  const history = useHistory();
  const onNameChange = (val) => {
    setName(val);
  };
  const createPoll = async () => {
    props.load(true);
    try {
      const response = await axios.post(
        "http://192.168.43.244:3002/poll",
        {
          name: name,
          deadline: date,
        },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token.adminToken}`,
          },
        }
      );
      localStorage.setItem("pollName", name);
      localStorage.setItem("pollId", response.data._id);

      props.load(false);
      history.push("/create-poll");
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "406":
          props.load(false);
          toast.error("Poll already exist", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          break;
        case "400":
          props.load(false);
          toast.error("Fields cannot be empty", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          break;
        case "401":
          props.load(false);
          toast.error("Session Expired", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          history.push("/");
          break;
        default:
          props.load(false);
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
      <ToastContainer limit={1} />

      <div className="poll-body">
        <input
          type="text"
          className="input"
          placeholder="Poll Name"
          onChange={(e) => onNameChange(e.target.value)}
          value={name}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignSelf: "flex-start",
            boxSizing: "border-box",
          }}
        >
          <p style={{ margin: "3px" }}>Deadline</p>
          <Flatpickr
            data-enable-time
            value={date}
            className="register-name input flatpickr"
            style={{ fontFamily: "Poppins", fontSize: "20px" }}
            onChange={(date) => {
              setDate(date);
            }}
          />
        </div>
        <button className="register-button input" onClick={createPoll}>
          Create Poll
        </button>
      </div>
    </div>
  );
}

export default function Poll(props) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [poll, setPoll] = useState([]);

  const [pollCreated, setPollCreated] = useState(false);

  const history = useHistory();

  const fetchData = async () => {
    props.load(true);
    try {
      const response = await axios.get("http://192.168.43.244:3002/poll");
      props.load(false);
      setPoll(response.data);
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "404":
          props.load(false);
          toast.error("No Polls Found", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          break;

        default:
          props.load(false);
          toast.error("Network error", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
      }
    }
  };
  useEffect(() => {
    if (token === null) {
      history.push("/");
    }
    fetchData();

    //eslint-disable-next-line
  }, []);

  const deletePoll = async (val) => {
    props.load(true);
    try {
      const response = await axios({
        url: `http://192.168.43.244:3002/poll`,
        method: "DELETE",
        data: { pollId: val },
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token.adminToken}`,
        },
      });
      props.load(false);
      console.log(response);
      window.location.reload();
    } catch (error) {
      props.load(false);
      console.log(error.message);
    }
  };

  return (
    <div className="poll-container ">
      <div className={pollCreated ? "hide" : "poll-container"}>
        <ToastContainer limit={1} />

        {token.adminToken ? (
          <button
            className="poll-create-poll-btn"
            onClick={() => {
              if (!token.adminToken) {
                return toast.error("Only admins can create polls", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: "false",
                });
              }
              setPollCreated(true);
            }}
            style={{ background: "#50c878" }}
          >
            {" "}
            Create Poll
          </button>
        ) : null}
        <h4 style={{ color: "#36454f", marginTop: "20px" }}>Select a poll</h4>
        <div
          style={{
            display: "flex",
            // padding: "20px",
            flexDirection: "column-reverse",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {poll.map((item) => (
            <div
              key={item._id}
              style={{
                width: "90%",
                padding: "25px",
                background: "#fff",
                marginTop: "20px",
                borderRadius: "7px",
              }}
              className="poll-poll-div"
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    // alignItems: "center",

                    color: "#fff",
                    width: "auto",
                    height: "auto",
                  }}
                >
                  <div
                    style={{
                      // marginLeft: "10px",
                      fontSize: "16px",
                      fontFamily: "Poppins",
                      color: "#36454f",
                    }}
                  >
                    {item.name}
                  </div>
                  {new Date(item.deadline) < new Date() ? (
                    <p
                      style={{
                        color: "red",
                        fontWeight: "200",
                        fontSize: "12px",
                      }}
                    >
                      Expired
                    </p>
                  ) : null}
                  {new Date(item.deadline) <
                  new Date() ? null : token.adminToken ? (
                    <button
                      className="poll-create-poll-btn"
                      onClick={() => {
                        if (!token.adminToken) {
                          return toast.error(
                            "Only admins can edit categories",
                            {
                              position: "top-right",
                              autoClose: 3000,
                              hideProgressBar: "false",
                            }
                          );
                        }
                        localStorage.setItem("pollId", item._id);
                        console.log(localStorage.getItem("pollName"));
                        history.push("/create-poll");
                      }}
                      style={{
                        // height: "25px",
                        padding: "5px",
                        marginRight: 0,
                        marginTop: 0,
                        borderRadius: "7px",
                        background: "#ff0063",
                      }}
                    >
                      Edit
                    </button>
                  ) : null}
                </div>
                <p
                  style={{
                    fontSize: "15px",
                    fontFamily: "Poppins",
                    color: "#36454f",
                  }}
                >
                  Deadline:{" "}
                  {item.deadline.split("T")[0].split("-").reverse().join("/") +
                    " " +
                    item.deadline.split("T")[1].split(".")[0] +
                    " " +
                    "GMT"}
                </p>
                {new Date(item.deadline) < new Date() ? (
                  <button
                    className="poll-button user"
                    style={{
                      padding: "5px",
                      marginRight: 0,
                      marginTop: 0,
                      borderRadius: "7px",
                      width: "100%",
                      background: "#ff0063",
                    }}
                    onClick={() => {
                      localStorage.setItem("pollId", item._id);
                      history.push("/stats");
                    }}
                  >
                    View Stats
                  </button>
                ) : null}
                {new Date(item.deadline) < new Date() ? (
                  token.adminToken ? (
                    <button
                      className="poll-button user"
                      style={{
                        // background: "red",
                        marginTop: "20px",
                        padding: "5px",
                        marginRight: 0,

                        borderRadius: "7px",
                        width: "100%",
                        background: "#36454f",
                      }}
                      onClick={() => deletePoll(item._id)}
                    >
                      Delete Poll
                    </button>
                  ) : null
                ) : (
                  <button
                    className="poll-button user"
                    onClick={() => {
                      localStorage.setItem("pollId", item._id);
                      localStorage.setItem("pollName", item.name);
                      history.push("/vote");
                    }}
                    style={{
                      background: "#50c878",
                      padding: "5px",
                      borderRadius: "5px",
                    }}
                  >
                    Enter Poll
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className={pollCreated ? "poll-container" : "hide"}
        style={{ height: "100vh" }}
      >
        <CreatPoll load={props.load} />
      </div>
    </div>
  );
}
