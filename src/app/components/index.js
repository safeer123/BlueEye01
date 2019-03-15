import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "npm-font-open-sans/open-sans.css";
import "font-awesome/css/font-awesome.min.css";
import Content from "./Content";
import Home from "./Home";

import "./css/index.css";
import "./css/buttonStyles.css";

const publicUrl = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "";

const App = () => (
  <Router>
    <div className="wrapper">
      <Route path={`${publicUrl}/`} exact component={Home} />
      <Route path={`${publicUrl}/sample/:viewIndex`} component={Content} />
    </div>
  </Router>
);

export { App };
