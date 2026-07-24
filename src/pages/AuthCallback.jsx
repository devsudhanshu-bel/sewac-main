import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      window.location.replace("http://localhost:5174");
      return;
    }

    sessionStorage.setItem("token", token);

    navigate("/dashboard/admin/overview", {
      replace: true,
    });
  }, [navigate]);

  return <h1>Signing you in...</h1>;
};

export default AuthCallback;