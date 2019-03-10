import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "npm-font-open-sans/open-sans.css";
import "font-awesome/css/font-awesome.min.css";
import Content from "./Content";

import "./css/index.css";
import "./css/buttonStyles.css";

const App = props => (
  <div className="wrapper">
    <Content />
  </div>
);

export { App };
