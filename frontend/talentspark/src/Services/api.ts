import axios from "axios";

/*
Change only the .env file when deploying.

Development:
VITE_API_URL=http://localhost:8000

Production:
VITE_API_URL=https://your-backend-url.com
*/

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          window.location.reload();
          break;

        case 403:
          alert("Access Denied");
          break;

        case 404:
          console.log("API Not Found");
          break;

        case 500:
          console.log("Internal Server Error");
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default api;