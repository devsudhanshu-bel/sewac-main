import axios from "axios";

const api = axios.create({
  baseURL: "https://sewac-main.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Please log in again.");

      sessionStorage.removeItem("token");

      // Uncomment if you want automatic redirect
      // window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;