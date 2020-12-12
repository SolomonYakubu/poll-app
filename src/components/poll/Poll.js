import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style.css";
export default function Poll(props) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [poll, setPoll] = useState([]);
  const history = useHistory();
  const createPoll = () => {
    if (!token.adminToken) {
      return toast.error("Only Admins can create a poll");
    }
    props.createPolls();
  };
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3002/poll");

      setPoll(response.data);
    } catch (error) {
      console.log(error.message);
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
    <div className="poll-container">
      <ToastContainer />
      <button className="poll-create-poll-btn" onClick={createPoll}>
        {" "}
        Create Poll
      </button>
      <div className="poll-body">
        <h2>Polls</h2>
        {poll.map((item) => (
          <button className="poll-button" key={item._id}>
            <p>{item.name}</p>
            <p>Deadline: {item.deadline.toString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
