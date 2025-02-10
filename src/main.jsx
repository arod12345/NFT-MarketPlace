import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import './index.css'
import App from "./App.jsx";
import { AppProvider } from "./context/Context.jsx";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </AppProvider>
);
