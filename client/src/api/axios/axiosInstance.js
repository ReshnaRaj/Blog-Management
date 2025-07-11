import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Instance for public endpoints (no auth required)
export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance for protected endpoints (auth required)
export const privateAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token only to private instance
privateAxios.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("authState"))?.token;
    if (!token) {
      return Promise.reject("No token available");
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const responseInterceptor = (response) => response;
const errorInterceptor = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem("authState");
    window.location.href = "/login";
  }
  return Promise.reject(error.response?.data || error);
};

publicAxios.interceptors.response.use(responseInterceptor, errorInterceptor);
privateAxios.interceptors.response.use(responseInterceptor, errorInterceptor);
