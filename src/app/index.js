import React from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import RouterApp from "./components";
import SinglePageApp from "./components/singlePageApp";
import allReducers from "./reducers";

const store = createStore(allReducers, applyMiddleware(thunk, promise()));

const getContent = () =>
  process.env.PUBLIC_URL ? <SinglePageApp /> : <RouterApp />;

ReactDOM.render(
  <Provider store={store}>{getContent()}</Provider>,
  document.getElementById("root")
);
