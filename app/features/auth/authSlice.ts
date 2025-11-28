import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authAPI, { loginWithGoogleApi, refreshTokenApi } from './authAPI'
import type { LoginResponse } from './authAPI'

// login: Thunk đăng nhập (fake) lấy từ authAPI
export const login = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  'auth/login',
  async (credentials) => {
    const res = await authAPI.login(credentials)
    return res // axiosClient interceptor => trả về data
  }
)

// AuthState: Trạng thái quản lý người dùng + token
type AuthState = {
  user: null | {
    userID: number
    userAccount: string
    userGmail: string
    userName: string
    userPhone?: string
    refreshToken: string
  }
  loading: boolean
  error?: string
  accessToken: string | null
  errCode?: number
  message?: string
}

// Các kiểu dữ liệu phục vụ đăng nhập Google
interface LoginGoogleResponse {
  data: any
  message: string
  accessToken: string
  refreshToken: string
  errCode: number
}
interface LoginGooglePayload {
  userAccount?: string
  userGmail?: string
  userName?: string
  token?: string // token JWT
}
interface LoginGoogleResult {
  data?: any
  accessToken?: string
  message: string
  errCode: number
}
interface RefreshTokenResult {
  errCode: number
  accessToken: string
  data: {
    userID: number
    userAccount: string
    userGmail: string
    userName: string
    userPhone?: string
    refreshToken: string
  }
}

// loginWithGoogleAccount: Thunk đăng nhập bằng Google
export const loginWithGoogleAccount = createAsyncThunk<LoginGoogleResult, LoginGooglePayload, { rejectValue: string }>(
  'user/loginWithGoogleAccount',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await loginWithGoogleApi(data)) as LoginGoogleResponse
      if (res && res.errCode === 0) {
        const { data: userData, message, accessToken, refreshToken, errCode } = res
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        return { data: userData, accessToken, message, errCode }
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)

// refreshToken: Thunk lấy accessToken mới từ refreshToken
export const refreshToken = createAsyncThunk<RefreshTokenResult, string, { rejectValue: string }>(
  'user/refreshToken',
  async (token, { rejectWithValue }) => {
    try {
      const res = await refreshTokenApi<RefreshTokenResult>(token)
      if (res && res.errCode === 0) {
        const { errCode, accessToken, data } = res
        localStorage.setItem('accessToken', accessToken)
        return { errCode, accessToken, data }
      }
      return rejectWithValue('Không có dữ liệu')
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Lỗi refresh token')
    }
  }
)

// initialState: Trạng thái khởi tạo của slice
const initialState: AuthState = {
  user: null,
  loading: false,
  accessToken: null
}

// authSlice: Slice quản lý logic auth + xử lý các thunk ở extraReducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // logout: Xóa user khỏi state và token khỏi localStorage
    logout: (state) => {
      state.user = null
      localStorage.removeItem('token')
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogleAccount.pending, (state) => {
        state.loading = true
      })
      .addCase(loginWithGoogleAccount.rejected, (state) => {
        state.loading = false
      })
      .addCase(loginWithGoogleAccount.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.accessToken = action.payload.accessToken || null
        state.loading = false
        state.errCode = action.payload.errCode
        state.message = action.payload.message
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.loading = false
        state.errCode = action.payload.errCode
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
