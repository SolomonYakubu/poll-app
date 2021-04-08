import React from "react";
import Loader from "react-loader-spinner";
import "../style.css";
export default function Spinner() {
  return (
    <>
      <div style={{ position: "fixed", top: "45%", right: "40%" }}>
        <Loader type="Oval" color="#007fff" height={60} />
      </div>
    </>
  );
}
