import { useEffect } from "react";

const AuthCallback = () => {
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    console.log("========== CALLBACK ==========");
    console.log("URL:", window.location.href);
    console.log("TOKEN EXISTS:", !!token);

    if (!token) {
      document.body.innerHTML =
        "<h1 style='text-align:center;margin-top:100px;color:red'>CALLBACK RECEIVED NO TOKEN</h1>";
      return;
    }

    sessionStorage.setItem("token", token);

    console.log("TOKEN STORED:", sessionStorage.getItem("token"));

    // IMPORTANT:
    // Do NOT navigate anywhere yet.
    // This tells us whether the callback itself works.
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
      }}
    >
      CALLBACK REACHED
    </div>
  );
};

export default AuthCallback;
