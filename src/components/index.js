import React from "react";
import Footer from "./Footer";
import Content from "./Content";

require("../styles/main.css");

const App = props => {
  return (
    <div className="wrapper">
      <Content />
      <Footer />
    </div>
  );
};

export { App };
