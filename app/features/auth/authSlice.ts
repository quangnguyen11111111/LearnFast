import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Removed invalid import: RejectWithValue is not exported from @reduxjs/toolkit
import authAPI from "./authAPI";
import {loginWithGoogleApi,refreshTokenApi} from "./authAPI";
import type { LoginResponse } from "./authAPI";

export const login = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  "auth/login",
  async (credentials) => {
    const res = await authAPI.login(credentials);
    return res; // axiosClient đã set interceptor => trả về data luôn
  }
);
// hàm xử lí login with googl
type AuthState = {
  user: null | { userID:number;
    userAccount:string;
    userGmail:string;
    userName:string;
    userPhone?:string;
    refreshToken:string; };
  loading: boolean;
  error?: string;
  accessToken: string | null;
  errCode?: number;
  message?: string;
};
interface LoginGoogleResponse {
  data: any;
  message: string;
  accessToken: string;
  refreshToken: string;
  errCode: number;
}interface LoginGooglePayload {
  userAccount?: string;
  userGmail?: string;
  userName?: string;
  token?: string; // với web có thể chỉ cần token (JWT)
}// Dữ liệu trả về cho Redux store
interface LoginGoogleResult {
  data?: any;
  accessToken?: string;
  message: string;
  errCode: number;
}
interface refreshTokenResult {
  errCode: number;
  accessToken: string;
  data:{
    userID:number;
    userAccount:string;
    userGmail:string;
    userName:string;
    userPhone?:string;
    refreshToken:string;
  }
}
// Thunk để xử lý login với Google
export const loginWithGoogleAccount = createAsyncThunk<
  LoginGoogleResult,       // return type
  LoginGooglePayload,      // args type
  { rejectValue: string }  // reject type
>(
  "user/loginWithGoogleAccount",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginWithGoogleApi(data) as LoginGoogleResponse;
      console.log("data nè",data);
      
      if (res && res.errCode === 0) {
        const { data, message, accessToken, refreshToken, errCode } = res;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        return { data, accessToken, message, errCode };
      } else {
        return rejectWithValue(res.message);
      }
    } catch (e: any) {
      // Directly return rejectWithValue for error handling
      return rejectWithValue(e?.message || "Unknown error");
    }
  }
);
// Thunk để xử lý refresh token
export const refreshToken = createAsyncThunk<
  refreshTokenResult,       // return type
  string,      // args type
  { rejectValue: string }  // reject type 
  >(
  "user/refreshToken",
  async ( token, { rejectWithValue }) => {
    try {
      const res = await refreshTokenApi<refreshTokenResult>(token);
      if (res&& res.errCode === 0) {
      const { errCode, accessToken, data } = res;
      localStorage.setItem("accessToken", accessToken);
      return { errCode,accessToken,data}
      }else{
        return rejectWithValue("khong co dư lieu" );
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Lỗi refresh token");
    }
  });

const initialState: AuthState = {
  user: null,
  loading: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(login.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(login.fulfilled, (state, action) => {
      //   state.user = action.payload.user;
      //   localStorage.setItem("token", action.payload.token);
      //   state.loading = false;
      // })
      // .addCase(login.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.error.message;
      // })
     .addCase(loginWithGoogleAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogleAccount.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginWithGoogleAccount.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.accessToken = action.payload.accessToken||null;
        state.loading = false;
        state.errCode = action.payload.errCode;
        state.message = action.payload.message;
      })
     .addCase(refreshToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.loading = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
        state.errCode = action.payload.errCode;
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
// Removed handleError function since rejectWithValue can be used directly in the catch block

