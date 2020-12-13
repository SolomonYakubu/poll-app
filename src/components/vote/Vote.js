import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Vote(props) {
  const history = useHistory();
  const token = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/poll/${props.pollName}`,
          {
            headers: {
              Authorization: `Bearer ${token.token}`,
            },
          }
        );
        console.log(response.data);
        if (response.data.categories == 0) {
          toast.error("This Poll is empty", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: "false",
          });
          setTimeout(() => history.push("/poll"), 3000);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getData();
    //eslint-disable-next-line
  }, []);
  console.log(props.pollName);
  return (
    <>
      <ToastContainer />
    </>
  );
}
