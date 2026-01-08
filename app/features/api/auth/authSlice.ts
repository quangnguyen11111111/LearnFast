import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import  { loginLocalApi, loginWithGoogleApi, refreshTokenApi, registerLocalApi } from './authAPI'


// AuthState: Trạng thái quản lý người dùng + token
type AuthState = {
  user: null | {
    userID: string
    email: string
    username: string
    refreshToken: string
    avatar?: string
  }
  loading: boolean
  loadingRefresh?: boolean
  error?: string
  accessToken: string | null
  errCode?: number
  message?: string
}

// Các kiểu dữ liệu phục vụ đăng nhập Google
interface LoginResponse {
  data: any
  message: string
  accessToken: string
  refreshToken: string
  errCode: number
}
// Kiểu dữ liệu payload truyền vào cho các thunk đăng nhập
interface LoginPayload {
  email?: string
  password?: string
  idToken?: string
}
interface LoginResult {
  data?: any
  accessToken?: string
  message: string
  errCode: number
}
interface RefreshTokenResult {
  errCode: number
  accessToken: string
  data: {
    userID: string
    email: string
    username: string
    userPhone?: string
    refreshToken: string
  }
}
interface RegisterPayload {
  email: string
  password: string
  username: string
}
// loginWithLocalAccount: Thunk đăng nhập bằng tài khoản mật khẩu
export const loginWithLocalAccount = createAsyncThunk<LoginResult, LoginPayload, { rejectValue: string }>(
  'user/loginWithLocalAccount',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await loginLocalApi(data)) as LoginResponse
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

// loginWithGoogleAccount: Thunk đăng nhập bằng Google
export const loginWithGoogleAccount = createAsyncThunk<LoginResult, LoginPayload, { rejectValue: string }>(
  'user/loginWithGoogleAccount',
  async (data, { rejectWithValue }) => {
    try {      
      const res = (await loginWithGoogleApi(data)) as LoginResponse
      
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

// registerLocalAccount: Thunk đăng ký bằng tài khoản mật khẩu
export const registerLocalAccount = createAsyncThunk<LoginResult, RegisterPayload, { rejectValue: string }>(
  'user/registerLocalAccount',
  async (data, { rejectWithValue }) => {
    try {
      const res = (await registerLocalApi(data)) as LoginResponse
      if (res && res.errCode === 0) {
        const {  message, errCode } = res
        return { message, errCode }
      }
      return rejectWithValue(res.message)
    } catch (e: any) {
      return rejectWithValue(e?.message || 'Unknown error')
    }
  }
)

// initialState: Trạng thái khởi tạo của slice
const initialState: AuthState = {
  user: null,
  loading: false,
  accessToken: null,
  loadingRefresh: false
}

// authSlice: Slice quản lý logic auth + xử lý các thunk ở extraReducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // logout: Xóa user khỏi state và token khỏi localStorage
    logout: (state) => {
      state.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
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
      .addCase(loginWithLocalAccount.pending, (state) => {
        state.loading = true
      })
      .addCase(loginWithLocalAccount.rejected, (state) => {
        state.loading = false
      })
      .addCase(loginWithLocalAccount.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.accessToken = action.payload.accessToken || null
        state.loading = false
        state.errCode = action.payload.errCode
        state.message = action.payload.message
      })
      .addCase(refreshToken.pending, (state) => {
        state.loadingRefresh = true
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loadingRefresh = false
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.loadingRefresh = false
        state.errCode = action.payload.errCode
      })
      .addCase(registerLocalAccount.pending, (state) => {
        state.loading = true
      })
      .addCase(registerLocalAccount.rejected, (state) => {
        state.loading = false
      })
      .addCase(registerLocalAccount.fulfilled, (state, action) => {
        state.loading = false
        state.errCode = action.payload.errCode
        state.message = action.payload.message
      })
  }
})

export const { logout } = authSlice.actions
export default authSlice.reducer
