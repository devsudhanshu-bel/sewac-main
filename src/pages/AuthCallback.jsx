import { useEffect } from "react";

const AuthCallback = () => {
  useEffect(() => {
    const authenticate = () => {
      console.log("========== SEWAC AUTH CALLBACK ==========");

      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      console.log("Callback URL:", window.location.href);
      console.log("Token received:", !!token);

      // No JWT received from CMADS
      if (!token) {
        console.error("No JWT token received from CMADS.");

        window.location.replace(
          "https://app-authentication-frontend.onrender.com/",
        );

        return;
      }

      // Store JWT in SEWAC's own sessionStorage
      sessionStorage.setItem("token", token);

      console.log("Token stored:", !!sessionStorage.getItem("token"));

      // Remove JWT from the visible URL
      window.history.replaceState({}, document.title, "/auth/callback");

      // Go directly to SEWAC dashboard
      window.location.replace("/dashboard/admin/overview");
    };

    authenticate();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
      <div className="text-center">
        <div className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />

        <h1 className="text-2xl font-semibold">Authenticating...</h1>

        <p className="mt-2 text-white/60">Securely connecting to SEWAC.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
