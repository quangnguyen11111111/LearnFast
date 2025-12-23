import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '~/store/hook'

interface ProtectedGuestRouteProps {
  children: React.ReactNode
}

/**
 * Component bảo vệ các trang guest (login, register)
 * Nếu user đã đăng nhập, redirect về trang chủ user
 */
export default function ProtectedGuestRoute({ children }: ProtectedGuestRouteProps) {
  const navigate = useNavigate()
  const { user, accessToken } = useAppSelector((state) => state.auth)
  const refreshToken = localStorage.getItem('refreshToken')
  useEffect(() => {
    // Nếu user đã đăng nhập, chuyển hướng về trang chủ user
    if (user && refreshToken) {
      navigate('/latest', { replace: true })
    }
  }, [user, refreshToken, navigate])

  // Chỉ render children nếu user chưa đăng nhập
  if (user || refreshToken) {
    return null
  }

  return <>{children}</>
}
