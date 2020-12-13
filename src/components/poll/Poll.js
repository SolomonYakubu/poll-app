import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Ring } from "awesome-react-spinners";
import "../style.css";
export default function Poll(props) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [poll, setPoll] = useState([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const createPoll = () => {
    if (!token.adminToken) {
      return toast.error("Only Admins can create a poll");
    }
    props.createPolls();
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3002/poll");
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
      <ToastContainer />
      {loading ? <Ring /> : null}
      <button className="poll-create-poll-btn" onClick={createPoll}>
        {" "}
        Create Poll
      </button>

      <div className="poll-body">
        <h2>Polls</h2>
        {poll.map((item) => (
          <button
            className="poll-button"
            key={item._id}
            onClick={() => {
              props.pollNameSet(item.name);
              history.push("/vote");
            }}
          >
            <p>{item.name}</p>
            <p>
              Deadline:{" "}
              {item.deadline.split("T")[0].split("-").reverse().join("/") +
                " " +
                item.deadline.split("T")[1].split(".")[0] +
                " " +
                "GMT"}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
