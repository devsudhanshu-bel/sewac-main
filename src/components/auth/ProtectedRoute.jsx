import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  let token = sessionStorage.getItem("token");

  // If token somehow exists in the URL, recover it.
  if (!token) {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      token = urlToken;
      sessionStorage.setItem("token", urlToken);
    }
  }

  console.log("PROTECTED ROUTE TOKEN EXISTS:", !!token);
  console.log("PROTECTED ROUTE PATH:", window.location.pathname);

  if (!token) {
    console.error("PROTECTED ROUTE: NO TOKEN");

    sessionStorage.clear();

    window.location.replace(
      "https://app-authentication-frontend.onrender.com/",
    );

    return null;
  }

  try {
    const decoded = jwtDecode(token);

    console.log("PROTECTED ROUTE JWT:", decoded);

    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      console.error("PROTECTED ROUTE: TOKEN EXPIRED");

      sessionStorage.clear();

      window.location.replace(
        "https://app-authentication-frontend.onrender.com/",
      );

      return null;
    }

    return children;
  } catch (error) {
    console.error("PROTECTED ROUTE JWT ERROR:", error);

    sessionStorage.clear();

    window.location.replace(
      "https://app-authentication-frontend.onrender.com/",
    );

    return null;
  }
};

export default ProtectedRoute;
