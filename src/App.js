import React, { useState } from "react";
import Register from "./components/register/Register";
import LogIn from "./components/log-in/LogIn";
import Poll from "./components/poll/Poll";
import CreatePoll from "./components/create-poll/CreatePoll";
import Vote from "./components/vote/Vote";
import Stats from "./components/stats/Stats";
import Header from "./components/header/Header";
import Loader from "./components/loader/Loader";
import Footer from "./components/footer/Footer";
import { HashRouter as Router, Route } from "react-router-dom";

import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const load = (val) => {
    setLoading(val);
  };
  return (
    <div className="App">
      {loading ? <Loader /> : null}
      <div
        style={{
          opacity: loading ? "0.2" : "1",
          pointerEvents: loading ? "none" : "all",
        }}
      >
        <Header />
        <Router>
          <Route exact path="/">
            <LogIn load={load} />
          </Route>
          <Route path="/register">
            <Register load={load} />
          </Route>
          <Route path="/poll">
            <Poll load={load} />
          </Route>
          <Route path="/create-poll">
            <CreatePoll load={load} />
          </Route>
          <Route path="/vote">
            <Vote load={load} />
          </Route>
          <Route path="/Stats">
            <Stats load={load} />
          </Route>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
