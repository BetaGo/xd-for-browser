import "./reactions/reactions";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { listenKeyboardEvents } from "./keyboard";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

listenKeyboardEvents();
