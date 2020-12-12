import React, { useState } from "react";
import "flatpickr/dist/themes/dark.css";
import Flatpickr from "react-flatpickr";
import axios from "axios";
import "../style.css";
export default function CreatPoll(props) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [date, setDate] = useState(`${new Date()}`);
  const [name, setName] = useState("");
  const onNameChange = (val) => {
    setName(val);
  };
  const createPoll = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3002/poll",
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
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(date);

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="register-form-div">
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
    </div>
  );
}
