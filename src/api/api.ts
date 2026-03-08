import axios, { AxiosHeaders } from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const headers = config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url ?? "");
    const message = String(error?.response?.data?.message ?? "").toLowerCase();
    const isLoginRequest = url.includes("/api/accounts/login");
    const isTokenError =
      message.includes("token") ||
      message.includes("jwt") ||
      message.includes("expired") ||
      message.includes("inválido") ||
      message.includes("invalido");

    if (status === 401 && !isLoginRequest && isTokenError) {
      localStorage.removeItem("authToken");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  },
);
