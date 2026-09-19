import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { initNotifications, notifyNewOrder } from "./utils/notify";

initNotifications();

// TEMPORARY test helper: run testNotify() in the console, then delete this line
window.testNotify = () => notifyNewOrder({ address: { name: "Test" }, amount: 100 });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);