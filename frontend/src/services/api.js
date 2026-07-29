const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5003"; // <-- your local CMADS backend

export const SEWAC_MAIN_URL =
  "http://localhost:5173"; // <-- your local sewac-main frontend
  // Change back to Render URL when deploying

export default API_BASE_URL;