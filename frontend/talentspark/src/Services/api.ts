import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically attach the Bearer token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Clear invalid token and refresh app on 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };