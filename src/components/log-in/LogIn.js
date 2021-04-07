import React, { useState } from "react";

import { Link } from "react-router-dom";
import "../style.css";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";

export default function LogIn() {
  const history = useHistory();
  const [number, setNumber] = useState("");
  // const [token, setToken] = useState([]);
  const onNumberChange = (val) => {
    setNumber(val);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://192.168.43.244:3002/user/log-in",
        {
          mobile_id: number,
        },
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      // setToken(response);
      const token = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      console.log(token);
      history.push("/poll");
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
        case "404":
          toast.error("Mobile number not registered", {
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

  return (
    <div className="register-container">
      <ToastContainer limit={1} />
      <form className="register-form" onSubmit={handleSubmit.bind(this)}>
        <div className="register-form-div">
          <h2 style={{ color: "#5f5f5f" }}>Login</h2>

          <input
            type="number"
            className="register-name input"
            placeholder="Mobile Number"
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
          />
          <input
            type="submit"
            value="Login"
            className="register-button input"
          />
        </div>
        <p style={{ fontSize: "12px" }}>
          Not yet registered?{" "}
          <Link to="/register" style={{ color: "grey" }}>
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
