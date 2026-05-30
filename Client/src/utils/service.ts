import axios from "axios";
import { triggerGlobalException } from "../context";

export const service = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 2000,
  withCredentials: true,
});

service.interceptors.request.use((config) => {
  return config;
});

service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the silent client option (Silent) is enabled
    const silent = error.config ? error.config.silent : false;

    if (silent !== true) {
      // Trigger the common extraction handler (toaster)
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "API request execution failed";

      triggerGlobalException(new Error(errorMsg), "normal", "API Interceptor");
    }

    return Promise.reject(error);
  },
);
