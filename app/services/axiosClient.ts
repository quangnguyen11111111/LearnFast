import axios from "axios";
import type { AxiosRequestConfig } from "axios";
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
);

// 🟢 wrapper để TS hiểu rằng axiosClient trả về T
const customAxios = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosClient.get<any, T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosClient.post<any, T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    axiosClient.put<any, T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosClient.delete<any, T>(url, config),
};

export default customAxios;
