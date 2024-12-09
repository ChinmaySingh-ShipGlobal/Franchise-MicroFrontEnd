import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="franchise">
      <Suspense fallback={<h2>Loading...</h2>}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
);
