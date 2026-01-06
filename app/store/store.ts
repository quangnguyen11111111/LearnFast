import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/api/auth/authSlice'
import toggleReducer from '../features/actionPage/toggleSlice'
import fileReducer from '../features/api/file/fileSlice'
import folderReducer from '../features/api/folder/folderSlice'
// store: Khởi tạo Redux store gom các slice (auth, toggle)
export const store = configureStore({
  reducer: {
    auth: authReducer,
    toggle: toggleReducer,
    file: fileReducer,
    folder: folderReducer
  }
})

// RootState: Kiểu tổng hợp state toàn bộ
export type RootState = ReturnType<typeof store.getState>
// AppDispatch: Kiểu dispatch cho useDispatch
export type AppDispatch = typeof store.dispatch
