import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3010",
});

export default axiosClient;
