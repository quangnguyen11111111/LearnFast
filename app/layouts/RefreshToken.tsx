import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { refreshToken } from '~/features/api/auth/authSlice'
import { useAppDispatch } from '~/store/hook'

const RefreshToken = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('refreshToken')

    // Bỏ qua refresh token nếu đang ở trang login hoặc register
    const guestRoutes = ['/login', '/register']
    if (guestRoutes.includes(location.pathname)) {
      return
    }

    if (token) {
      dispatch(refreshToken(token))
        .unwrap()
        .then((response) => {
          if (response.errCode !== 0) {
            // Xóa token không hợp lệ
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            navigate('/login', { replace: true })
          }
        })
        .catch(() => {
          // Xóa token khi có lỗi
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('accessToken')
          navigate('/login', { replace: true })
        })
    }
  }, [dispatch, navigate, location.pathname])

  return <></>
}
export default RefreshToken
