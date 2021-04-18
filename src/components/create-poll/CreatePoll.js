import React, { useEffect, useState } from "react";
import "flatpickr/dist/themes/dark.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useHistory } from "react-router-dom";
import axios from "axios";

import "../style.css";
const CreatePoll = (props) => {
  const history = useHistory();

  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");

  const [candidateName, setCandidateName] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));

  const pollId = localStorage.getItem("pollId");

  //getData on load

  useEffect(() => {
    if (!token.adminToken) {
      history.push("/");
    }
    const getData = async () => {
      props.load(true);
      try {
        const response = await axios.get(
          `http://192.168.43.244:3002/poll/${pollId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

        setCategory([...response.data.categories]);
        props.load(false);
      } catch (error) {
        const err = error.message.split(" ")[5];
        props.load(false);
        switch (err) {
          case "401":
            toast.error("Session expired", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: "false",
            });
            history.push("/");
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
    getData();
    //eslint-disable-next-line
  }, []);

  const onNameChange = (val) => {
    setName(val);
  };
  const onCandidateNameChange = (val) => {
    setCandidateName(val);
  };
  const addCategory = async () => {
    if (name <= 0) {
      return toast.error("Fields cannot be empty", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: "false",
      });
    }
    props.load(true);
    try {
      const response = await axios.post(
        "http://192.168.43.244:3002/poll/category",
        {
          name: name,
          pollId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.adminToken}`,
          },
        }
      );
      //console.log(response.data);
      props.load(false);
      setCategory([...response.data.categories]);
      setName("");
      console.log(category);
    } catch (error) {
      const err = error.message.split(" ")[5];
      console.log(error.message);
      props.load(false);
      switch (err) {
        case "406":
          toast.error("Category already exist", {
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
  const addCandidate = async (val) => {
    if (candidateName <= 0) {
      return toast.error("Fields cannot be empty", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: "false",
      });
    }
    props.load(true);
    try {
      const response = await axios.post(
        `http://192.168.43.244:3002/poll/candidate/${val}`,
        {
          name: candidateName,
          pollId,
        },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token.adminToken}`,
          },
        }
      );
      props.load(false);
      setCategory([...response.data.categories]);
      setCandidateName("");
    } catch (error) {
      const err = error.message.split(" ")[5];
      props.load(false);
      switch (err) {
        case "406":
          toast.error("Candidate already exist", {
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
  const deleteCandidate = async (candidate_id) => {
    props.load(true);
    try {
      const response = await axios({
        url: `http://192.168.43.244:3002/poll/candidate/${candidate_id}`,
        method: "DELETE",
        data: { pollId },
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token.adminToken}`,
        },
      });

      setCategory([...response.data.categories]);
      props.load(false);
    } catch (error) {
      props.load(false);
    }
  };

  return (
    <div className="poll-container">
      <ToastContainer limit={1} />

      <div className="poll-body" style={{ background: "none", width: "95%" }}>
        <h2 className="create-poll-label heading">
          {localStorage.getItem("pollName")}
        </h2>
        <button
          className="poll-create-poll-btn"
          style={{ alignSelf: "flex-start", marginLeft: 0 }}
          onClick={() => history.push("/poll")}
        >
          Done
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          {category.map((item) => (
            <div className="create-poll-category" key={item._id}>
              <div
                className="create-poll-label sub-heading"
                style={{
                  marginBottom: 0,

                  color: "#090909",
                  fontSize: "18px",
                  marginLeft: 0,
                  // padding: "10px",
                }}
              >
                {item.name}
              </div>
              <div className="create-poll-candidate-div">
                <p className="create-poll-candidate-label">Candidates</p>
                {item.candidates.map((obj) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    key={obj._id}
                  >
                    <p
                      style={{
                        margin: "2px",
                        fontSize: "18px",
                        marginLeft: "20px",
                      }}
                    >
                      {obj.name}
                    </p>
                    <button
                      style={{
                        marginRight: "20px",
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",

                        textAlign: "center",
                        border: "none",
                        background: "#ff0063",
                        color: "#fff",
                        outline: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => deleteCandidate(obj._id)}
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
                  className="poll-create-poll-btn"
                  style={{
                    marginTop: 0,

                    float: "right",
                    borderRadius: "0",
                  }}
                  onClick={() => addCandidate(item._id)}
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
              background: "#fff",
              padding: "15px",
              borderRadius: "7px",
              marginBottom: "30px",
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
export default CreatePoll;
