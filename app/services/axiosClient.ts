import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

// axiosClient: Instance cấu hình sẵn baseURL + header JSON
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ||'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
})
axios.defaults.withCredentials = true

// Interceptor request: Gắn Authorization Bearer token nếu có trong localStorage
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor response: Trả về trực tiếp phần data hoặc reject lỗi
axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
)

// customAxios: Wrapper generic giúp TypeScript suy luận kiểu trả về T cho mỗi phương thức
const customAxios = {
  get: <T>(url: string, config?: AxiosRequestConfig) => axiosClient.get<any, T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => axiosClient.post<any, T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => axiosClient.put<any, T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => axiosClient.delete<any, T>(url, config)
}

export default customAxios
