import React, { useEffect, useState } from "react";
import "flatpickr/dist/themes/dark.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useHistory } from "react-router-dom";
import axios from "axios";

import { Ring } from "awesome-react-spinners";
import "../style.css";
const Category = (props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [name, setName] = useState("");

  const [candidateName, setCandidateName] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));
  const pollName = localStorage.getItem("pollName");
  const pollId = localStorage.getItem("pollId");

  //getData on load

  useEffect(() => {
    if (!token.adminToken) {
      history.push("/");
    }
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/poll/${pollId}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          }
        );

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
      setLoading(false);
      setCategory([...response.data.categories]);
      setName("");
      console.log(category);
    } catch (error) {
      const err = error.message.split(" ")[5];
      console.log(error.message);

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
          pollId,
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
  const deleteCandidate = async (candidate_id, category_id) => {
    try {
      const response = await axios({
        url: `http://localhost:3002/poll/category/${category_id}/candidate/${candidate_id}`,
        method: "DELETE",
        data: { pollId },
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token.adminToken}`,
        },
      });

      setCategory([...response.data.categories]);
      console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(pollName);
  return (
    <div className="poll-container">
      <ToastContainer limit={1} />
      {loading ? (
        <p>
          <Ring />
        </p>
      ) : null}
      <div className="poll-body">
        <h2 className="create-poll-label heading">
          Poll Name: {localStorage.getItem("pollName")}
        </h2>
        <button
          className="poll-create-poll-btn"
          style={{ alignSelf: "flex-start", marginLeft: 0 }}
          onClick={() => history.push("/poll")}
        >
          Done
        </button>
        <div style={{ display: "flex", flexDirection: "column-reverse" }}>
          {category.map((item) => (
            <div className="create-poll-category" key={item._id}>
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
                {item.candidate.map((obj) => (
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
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        textAlign: "center",
                        border: "none",
                        background: "rgb(255, 60, 11)",
                        color: "#fff",
                        outline: "none",
                      }}
                      onClick={() => deleteCandidate(obj._id, item._id)}
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
export default Category;
