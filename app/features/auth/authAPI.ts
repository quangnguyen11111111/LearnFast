import axiosClient from '../../services/axiosClient'

// loginLocalApi: Gọi API đăng nhập bằng tài khoản mật khẩu (backend thật)
export const loginLocalApi = (data: any) => axiosClient.post('/api/loginLocal', data)

// loginWithGoogleApi: Gọi API đăng nhập bằng Google (backend thật)
export const loginWithGoogleApi = (data: any) => axiosClient.post('/api/loginWithGoogle', data)

// refreshTokenApi: Gửi refreshToken để nhận accessToken mới
export const refreshTokenApi = <T>(token: string): Promise<T> =>
  axiosClient.post('/api/refreshToken', { refreshToken: token })

// registerLocalApi: Gọi API đăng ký bằng tài khoản mật khẩu
export const registerLocalApi = (data:{
  email: string
  password: string
  username: string
}) => axiosClient.post('/api/createNewUser', data)