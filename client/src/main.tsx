import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
// import { BrowserRouter, Routes } from "react-router";
// import routes from "./routes.tsx";
import App from "./App.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App/>
      </ClerkProvider>
  </StrictMode>,
);
