import React from "react";
import Footer from "./Footer";
import Content from "./Content";
import "../styles/main.scss";

const App = props => {
  return (
    <div className="wrapper">
      <Content />
      <Footer />
    </div>
  );
};

export { App };
