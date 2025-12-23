import { store } from '../store/store'
import { Navigate } from 'react-router'

// Kiểm tra xem user đã đăng nhập chưa
export const isUserLoggedIn = (): boolean => {
  const state = store.getState()
  return !!state.auth.user && !!state.auth.accessToken
}

// Kiểm tra xem user chưa đăng nhập
export const isUserLoggedOut = (): boolean => {
  return !isUserLoggedIn()
}
