import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "npm-font-open-sans/open-sans.css";
import "font-awesome/css/font-awesome.min.css";
import Footer from "./Footer";
import Content from "./Content";

import "./index.css";

const App = props => (
  <div className="wrapper">
    <Content />
    <Footer />
  </div>
);

export { App };