import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ring } from "awesome-react-spinners";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/dark.css";
import "../style.css";

function CreatPoll(props) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [date, setDate] = useState(`${new Date()}`);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const onNameChange = (val) => {
    setName(val);
  };
  const createPoll = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://cyon-poll.herokuapp.com/poll",
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

      console.log(response);
      setLoading(false);
      history.push("/create-poll");
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "406":
          setLoading(false);
          toast.error("Poll already exist", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          break;
        case "400":
          setLoading(false);
          toast.error("Fields cannot be empty", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          break;
        case "401":
          setLoading(false);
          toast.error("Session Expired", {
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
  console.log(date);

  return (
    <div className="poll-container">
      {loading ? (
        <p>
          <Ring />
        </p>
      ) : null}
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
            className="register-name input"
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
  const [loading, setLoading] = useState(false);
  const [pollCreated, setPollCreated] = useState(false);

  const history = useHistory();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://cyon-poll.herokuapp.com/poll");
      setLoading(false);
      setPoll(response.data);
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "404":
          toast.error("No Polls Found", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
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
  useEffect(() => {
    if (token === null) {
      history.push("/");
    }
    fetchData();

    //eslint-disable-next-line
  }, []);

  console.log(token);
  return (
    <div className="poll-container ">
      <div className={pollCreated ? "hide" : "poll-container"}>
        <ToastContainer />
        {loading ? <Ring /> : null}
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
          >
            {" "}
            Create Poll
          </button>
        ) : null}
        <h2 style={{ color: "#fff" }}>Polls</h2>
        <div
          className="poll-body"
          style={{
            flexDirection: "column-reverse",

            width: "95%",
          }}
        >
          {poll.map((item) => (
            <div key={item._id} style={{ width: "95%" }}>
              <div className="poll-user-div">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#000",
                    color: "#fff",
                    width: "100%",
                    height: "50px",
                  }}
                >
                  <p style={{ marginLeft: "10px", fontSize: "18px" }}>
                    Poll: {item.name}
                  </p>
                  {new Date(item.deadline) < new Date() ? (
                    <p style={{ color: "red" }}>Expired</p>
                  ) : null}
                  {new Date(item.deadline) < new Date() ? (
                    <button
                      className="poll-create-poll-btn"
                      style={{
                        height: "25px",
                        padding: "3px",
                        marginRight: 0,
                        marginTop: 0,
                        borderRadius: 0,
                      }}
                    >
                      view stats
                    </button>
                  ) : token.adminToken ? (
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
                        localStorage.setItem("pollName", item.name);
                        console.log(localStorage.getItem("pollName"));
                        history.push("/create-poll");
                      }}
                      style={{
                        height: "25px",
                        padding: "3px",
                        marginRight: 0,
                        marginTop: 0,
                        borderRadius: 0,
                        background: "blue",
                      }}
                    >
                      Edit
                    </button>
                  ) : null}
                </div>
                <p>
                  Deadline:{" "}
                  {item.deadline.split("T")[0].split("-").reverse().join("/") +
                    " " +
                    item.deadline.split("T")[1].split(".")[0] +
                    " " +
                    "GMT"}
                </p>
                {new Date(item.deadline) < new Date() ? (
                  token.adminToken ? (
                    <button
                      className="poll-button user"
                      style={{ background: "red" }}
                    >
                      Delete Poll
                    </button>
                  ) : null
                ) : (
                  <button
                    className="poll-button user"
                    onClick={() => {
                      localStorage.setItem("pollName", item.name);
                      history.push("/vote");
                    }}
                    style={{ background: " rgb(61, 187, 61)" }}
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
        <CreatPoll />
      </div>
    </div>
  );
}
