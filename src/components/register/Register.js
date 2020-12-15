import React, { useState } from "react";
import axios from "axios";
import "../style.css";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const history = useHistory();

  const onNameChange = (val) => {
    setName(val);
  };

  const onNumberChange = (val) => {
    setNumber(val);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://cyon-poll.herokuapp.com/user/register",
        {
          name: name,
          mobile_id: number,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      history.push("/");
      console.log(response.data);
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "403":
          toast.error("Mobile number is already registered", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          break;
        case "406":
          toast.error("Mobile number not valid", {
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

      console.log(err);
    }
  };

  console.log(name, number);
  return (
    <div className="register-container">
      <ToastContainer />
      <form
        className="register-form"
        method="POST"
        onSubmit={handleSubmit.bind(this)}
      >
        <div className="register-form-div">
          <h2 style={{ color: "#5f5f5f" }}>Register</h2>
          <input
            type="text"
            className="register-name input"
            placeholder="Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />
          <input
            type="number"
            className="register-name input"
            placeholder="Mobile Number"
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            required
          />
          <input
            type="submit"
            value="Register"
            className="register-button input"
          />
        </div>
      </form>
    </div>
  );
}
