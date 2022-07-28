import React from "react";
import ReactDOM from "react-dom";
import "./i18n";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import RoutesApp from "./routes";
import Providers from "./services/providers";

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <RoutesApp />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
