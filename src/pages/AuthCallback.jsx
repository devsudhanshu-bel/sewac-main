import { useEffect } from "react";

const AuthCallback = () => {
  useEffect(() => {
    console.log("========== SEWAC CALLBACK ==========");
    console.log("FULL URL:", window.location.href);
    console.log("QUERY:", window.location.search);

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("TOKEN RECEIVED:", token);
    console.log("TOKEN LENGTH:", token?.length);

    if (!token) {
      document.body.innerHTML =
        "<h1 style='color:red;text-align:center;margin-top:100px'>NO TOKEN RECEIVED</h1>";
      return;
    }

    sessionStorage.setItem("token", token);

    console.log("TOKEN STORED:", sessionStorage.getItem("token"));

    window.location.replace("/dashboard/admin/overview");
  }, []);

  return <h1>Authenticating...</h1>;
};

export default AuthCallback;
