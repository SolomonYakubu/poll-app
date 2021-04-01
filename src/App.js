import React from "react";
import Register from "./components/register/Register";
import LogIn from "./components/log-in/LogIn";
import Poll from "./components/poll/Poll";
import CreatePoll from "./components/create-poll/CreatePoll";
import Vote from "./components/vote/Vote";
import Header from "./components/header/Header";
import { HashRouter as Router, Route } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Route exact path="/">
          <LogIn />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/poll">
          <Poll />
        </Route>
        <Route path="/create-poll">
          <CreatePoll />
        </Route>
        <Route path="/vote">
          <Vote />
        </Route>
      </Router>
    </div>
  );
}

export default App;
