import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // ✅ Automatically handle JSON or FormData
  if (config.data instanceof FormData) {
    // Let the browser set the correct multipart/form-data boundary
    delete config.headers["Content-Type"];
  } else {
    // For JSON, set explicitly
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});
