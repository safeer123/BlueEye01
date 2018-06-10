import React from "react";
import ReactDOM from "react-dom";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { App } from "./components";
import allReducers from "./reducers";

const store = createStore(allReducers, applyMiddleware(thunk, promise()));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
