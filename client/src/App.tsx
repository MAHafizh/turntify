import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Routes, Route } from "react-router";
import Homepage from "./pages/Homepage";
import AuthCallback from "./pages/AuthCallback";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallback />} />
      </Routes>
    </>
  );
}

export default App;
