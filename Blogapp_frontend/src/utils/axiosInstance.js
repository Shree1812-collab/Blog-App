import axios from "axios";

// Single axios instance for the entire app
// Change baseURL here once when deploying to production
const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // always send cookies
});

export default axiosInstance;