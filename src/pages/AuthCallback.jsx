import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthCallback loaded");
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    console.log("Token from URL:", token);
    if (!token) {
      console.log("No Token Found");
      window.location.replace("https://app-authentication-frontend.onrender.com");
      return;
    }

    sessionStorage.setItem("token", token);
    console.log("Stored token:", sessionStorage.getItem("token"));

    navigate("/dashboard/admin/overview", {
      replace: true,
    });
  }, [navigate]);

  return (
    <div
      style={{
        fontSize: "40px",
        color: "red",
        padding: "100px",
      }}
    >
      AUTH CALLBACK PAGE
    </div>
  );
};

export default AuthCallback;
