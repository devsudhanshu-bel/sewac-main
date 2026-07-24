import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    sessionStorage.clear();
    window.location.replace("http://localhost:5174");
    return null;
  }

  try {
    const decoded = jwtDecode(token);

    // exp is in seconds
    const currentTime = Date.now() / 1000;

    if (decoded.exp && decoded.exp < currentTime) {
      sessionStorage.clear();
      window.location.replace("http://localhost:5174");
      return null;
    }

    return children;
  } catch (error) {
    sessionStorage.clear();
    window.location.replace("http://localhost:5174");
    return null;
  }
};

export default ProtectedRoute;