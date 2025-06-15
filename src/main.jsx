import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { LoadingProvider } from "./context/LoadingContext";
import LoadingOverlay from "./components/LoadingOverlay";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <LoadingOverlay />
      <App />
    </LoadingProvider>
  </StrictMode>
);
