import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "npm-font-open-sans/open-sans.css";
import Footer from "./Footer";
import Content from "./Content";

import "../styles/main.css";

const App = props => (
  <div className="wrapper">
    <Content />
    <Footer />
  </div>
);

export { App };
