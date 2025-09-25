import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import toggleReducer from "../features/actionPage/toggleSlice"
export const store = configureStore({
  reducer: {
    auth: authReducer,
    toggle:toggleReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
