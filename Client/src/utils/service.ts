import axios from "axios";
import { triggerGlobalException } from "../context";
import { config } from "../core/config";

export const service = axios.create({
  baseURL: config.BASE_URL,
  timeout: 2000,
  withCredentials: true,
});

service.interceptors.request.use((request) => {
  request.headers["x-api-key"] = config.API_KEY;
  request.headers["x-application-key"] = config.APPLICATION_KEY;
  if (localStorage.getItem("token")) {
    request.headers["authorization"] =
      `Bearer ${localStorage.getItem("token")}`;
  }
  return request;
});

service.interceptors.response.use(
  (response) => {
    if (response.headers["new-token"]) {
      localStorage.setItem("token", response.headers["new-token"]);
    }
    return response;
  },
  (error) => {
    // Check if the silent client option (Silent) is enabled
    const silent = error.config ? error.config.silent : false;

    if (silent !== true) {
      // Trigger the common extraction handler (toaster)
      console.log("HERE CALLING ", error.response);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "API request execution failed";

      triggerGlobalException(new Error(errorMsg), "normal", "API Interceptor");
    }

    return Promise.reject(error);
  },
);
