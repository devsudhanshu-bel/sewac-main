import { useEffect } from "react";

const AuthCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("========== AUTH CALLBACK ==========");
    console.log("URL:", window.location.href);
    console.log("TOKEN EXISTS:", !!token);
    console.log("TOKEN LENGTH:", token?.length);

    if (!token) {
      console.error("AUTH CALLBACK: TOKEN MISSING");

      document.body.innerHTML = `
        <div style="
          font-family: Arial;
          text-align: center;
          margin-top: 100px;
          color: red;
        ">
          <h1>Authentication Token Missing</h1>
          <p>CMADS did not provide a JWT token.</p>
        </div>
      `;

      return;
    }

    sessionStorage.setItem("token", token);

    console.log("TOKEN STORED:", !!sessionStorage.getItem("token"));

    // Hard navigation ensures ProtectedRoute starts
    // with the token already present.
    window.location.replace("/dashboard");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial",
        fontSize: "24px",
      }}
    >
      Authenticating...
    </div>
  );
};

export default AuthCallback;
