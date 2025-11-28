import axiosClient from '../../services/axiosClient'

// LoginResponse: Kiểu dữ liệu phản hồi sau khi đăng nhập
export type LoginResponse = {
  user: { id: string; email: string; name?: string }
  token: string
}

// authAPI.login: Hàm mô phỏng đăng nhập (fake) để test giao diện
// - Nhận email & password
// - Chờ 1s giả lập gọi API thực
// - Trả về token & thông tin user giả
const authAPI = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    console.log('Fake login with:', credentials)
    await new Promise((r) => setTimeout(r, 1000)) // giả lập độ trễ mạng
    return {
      token: 'fake-jwt-token-123',
      user: {
        id: '1',
        name: 'Phúc Dev',
        email: credentials.email
      }
    }
  }
}

// loginWithGoogleApi: Gọi API đăng nhập bằng Google (backend thật)
export const loginWithGoogleApi = (data: any) => axiosClient.post('/api/loginWithGoogle', data)

// refreshTokenApi: Gửi refreshToken để nhận accessToken mới
export const refreshTokenApi = <T>(token: string): Promise<T> =>
  axiosClient.post('/api/refreshToken', { refreshToken: token })

export default authAPI
