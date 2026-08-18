import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserAuthContextProvider } from "./context/UserAuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <BrowserRouter>
      <UserAuthContextProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </UserAuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
);
