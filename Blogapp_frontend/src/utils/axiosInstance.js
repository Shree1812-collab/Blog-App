import axios from "axios";

// Single axios instance for the entire app
// Change baseURL here once when deploying to production
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
})

export default axiosInstance;