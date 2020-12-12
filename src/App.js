import React, { useState } from "react";
import Register from "./components/register/Register";
import LogIn from "./components/log-in/LogIn";
import Poll from "./components/poll/Poll";
import CreatePoll from "./components/create-poll/CreatePoll";
import { HashRouter as Router, Route } from "react-router-dom";

import "./App.css";

function App() {
  const [pollCreate, setPollCreate] = useState(false);
  const createPolls = () => {
    setPollCreate(true);
  };
  return (
    <div className="App">
      <Router>
        <Route exact path="/">
          <LogIn />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/poll">
          {pollCreate ? (
            <CreatePoll pollCreate={pollCreate} createPolls={createPolls} />
          ) : (
            <Poll pollCreate={pollCreate} createPolls={createPolls} />
          )}
        </Route>
      </Router>
    </div>
  );
}

export default App;
