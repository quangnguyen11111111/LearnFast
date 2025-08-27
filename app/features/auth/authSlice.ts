import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "./authAPI";
import type { LoginResponse } from "./authAPI";

export const login = createAsyncThunk<LoginResponse, { email: string; password: string }>(
  "auth/login",
  async (credentials) => {
    const res = await authAPI.login(credentials);
    return res; // axiosClient đã set interceptor => trả về data luôn
  }
);

type AuthState = {
  user: null | { id: string; email: string };
  loading: boolean;
  error?: string;
};

const initialState: AuthState = {
  user: null,
  loading: false,
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
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
