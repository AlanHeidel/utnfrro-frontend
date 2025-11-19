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


