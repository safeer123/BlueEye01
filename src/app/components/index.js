import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Content from "./Content";
import Home from "./Home";
import "./css";

const navigateToPage = i => {
  window.location = `/sample/${i}`;
};

const navigateToHome = () => {
  window.location = "/";
};

const App = () => (
  <Router>
    <div className="wrapper">
      <Route
        path="/"
        exact
        render={() => <Home navigateToPage={navigateToPage} />}
      />

      <Route
        path="/sample/:viewIndex"
        render={props => <Content {...props} navigateToHome={navigateToHome} />}
      />
    </div>
  </Router>
);

export default App;
