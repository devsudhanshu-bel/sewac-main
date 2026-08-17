import { useEffect } from "react";

const AuthCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("AUTH CALLBACK URL:", window.location.href);
    console.log("AUTH CALLBACK TOKEN:", token);

    if (!token) {
      console.error("NO TOKEN RECEIVED FROM CMADS");
      return;
    }

    // Store the JWT in the SEWAC frontend's own session.
    sessionStorage.setItem("token", token);

    console.log("SEWAC TOKEN STORED:", sessionStorage.getItem("token"));

    // Direct browser navigation.
    window.location.replace("/dashboard/admin/overview");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Authenticating...</p>
    </div>
  );
};

export default AuthCallback;
