import React, { useState } from "react";
import "flatpickr/dist/themes/dark.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Flatpickr from "react-flatpickr";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { Ring } from "awesome-react-spinners";
import "../style.css";
const Category = (props) => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));
  const onNameChange = (val) => {
    setName(val);
  };
  const onCandidateNameChange = (val) => {
    setCandidateName(val);
  };
  const addCategory = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3002/poll/category",
        {
          name: name,
          pollName: props.pollName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.adminToken}`,
          },
        }
      );
      //console.log(response.data);
      setLoading(false);
      setCategory([...response.data.categories]);
      console.log(category);
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "406":
          setLoading(false);
          toast.error("Category already exist", {
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
  const addCandidate = async (val) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3002/poll/candidate/${val}`,
        {
          name: candidateName,
          pollName: props.pollName,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token.adminToken}`,
          },
        }
      );
      setLoading(false);
      setCategory([...response.data.categories]);
      console.log(response);
    } catch (error) {
      const err = error.message.split(" ")[5];

      switch (err) {
        case "406":
          setLoading(false);
          toast.error("Candidate already exist", {
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
    console.log(val);
  };
  const deleteCandidate = async (val) => {
    for (let x = 0; x < category.length; x++) {
      const cat_id = category[x];

      for (let y = 0; y < cat_id.candidate.length; y++) {
        //eslint-disable-next-line
        if (cat_id.candidate[y]._id == val) {
          setCategoryId(category[x]._id);
        }
      }
    }
    try {
      const response = await axios({
        url: `http://localhost:3002/poll/category/${categoryId}/candidate/${val}`,
        method: "DELETE",
        data: { pollName: props.pollName },
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token.adminToken}`,
        },
      });
      setCategoryId("");
      setCategory([...response.data.categories]);
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(candidateName);
  return (
    <div className="poll-container">
      <ToastContainer />
      {loading ? (
        <p>
          <Ring />
        </p>
      ) : null}
      <div className={props.pollCreated ? "poll-body" : "hide"}>
        <h2 className="create-poll-label heading">
          Poll Name: {props.pollName}
        </h2>
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          {category.map((item) => (
            <div className="create-poll-category">
              <p
                className="create-poll-label sub-heading"
                style={{
                  textDecoration: "none",
                  marginBottom: 0,
                  background: "#000",
                  color: "#fff",
                  fontSize: "18px",
                  marginLeft: 0,
                  padding: "10px",
                }}
              >
                Category: {item.name}
              </p>
              <div className="create-poll-candidate-div">
                <p className="create-poll-candidate-label">Candidates:</p>
                {item.candidate.map((item) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        margin: "2px",
                        fontSize: "18px",
                        marginLeft: "20px",
                      }}
                    >
                      {item.name}
                    </p>
                    <button
                      style={{
                        marginRight: "20px",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        textAlign: "center",
                        border: "none",
                        background: "rgb(255, 60, 11)",
                        color: "#fff",
                        outline: "none",
                      }}
                      value={item._id}
                      onClick={(e) => deleteCandidate(e.target.value)}
                    >
                      x
                    </button>
                  </div>
                ))}

                <input
                  type="text"
                  className="input"
                  style={{
                    width: "90%",
                    marginBottom: 0,
                    borderRadius: "0",
                    borderBottomRightRadius: "8px",
                  }}
                  onChange={(e) => onCandidateNameChange(e.target.value)}
                />
                <button
                  value={item._id}
                  key={item._id}
                  className="poll-create-poll-btn"
                  style={{
                    marginTop: 0,

                    float: "right",
                    borderRadius: "0",
                  }}
                  onClick={(e) => addCandidate(e.target.value)}
                >
                  Add Candidate
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              alignSelf: "flex-end",
              boxSizing: "border-box",
              width: "100%",
              marginRight: 0,
            }}
          >
            <input
              type="text"
              className="input"
              placeholder="Category name"
              onChange={(e) => onNameChange(e.target.value)}
              value={name}
              style={{
                marginRight: 0,
                marginBottom: 0,
                borderRadius: 0,
              }}
            />
            <button
              className="poll-create-poll-btn"
              onClick={addCategory}
              style={{
                marginRight: 0,
                marginTop: 0,
                borderRadius: 0,
              }}
            >
              Add category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function CreatPoll(props) {
  const token = JSON.parse(localStorage.getItem("token"));
  const [date, setDate] = useState(`${new Date()}`);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [pollCreated, setPollCreated] = useState(false);
  const history = useHistory();
  const onNameChange = (val) => {
    setName(val);
  };
  const createPoll = async () => {
    setLoading(true);
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
      setPollCreated(true);
      console.log(response);
      setLoading(false);
      // window.location.reload();
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
      <div className={pollCreated ? "hide" : "poll-body"}>
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

      <Category pollCreated={pollCreated} pollName={name} />
    </div>
  );
}
