import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api"

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem("user-token");
    if (token){
        config.headers.Authorization = token;
    }
    return config
}, error => {
    return Promise.reject(error);
});

export default apiClient;