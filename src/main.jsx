import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Maintenance from "./Maintenance.jsx";

const isMaintenance = true; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isMaintenance ? <Maintenance /> : <App />}
  </StrictMode>
);
