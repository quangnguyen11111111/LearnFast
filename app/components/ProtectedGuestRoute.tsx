import { useEffect, useState } from 'react'
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
  const { user } = useAppSelector((state) => state.auth)
  const [isChecking, setIsChecking] = useState(true)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken')

    // Nếu user đã đăng nhập, chuyển hướng về trang chủ user
    if (user && refreshToken) {
      navigate('/latest', { replace: true })
    } else if (!refreshToken) {
      // Không có refreshToken -> user chưa đăng nhập -> render trang guest
      setShouldRender(true)
    } else {
      // Có refreshToken nhưng chưa có user -> đợi RefreshToken component xử lý
      // Nếu sau 1 giây vẫn chưa có user, cho phép render (token có thể đã hết hạn)
      const timeout = setTimeout(() => {
        const currentRefreshToken = localStorage.getItem('refreshToken')
        if (!currentRefreshToken) {
          setShouldRender(true)
        } else {
          // Vẫn có token nhưng không có user -> redirect để refresh token component xử lý
          navigate('/latest', { replace: true })
        }
      }, 500)
      return () => clearTimeout(timeout)
    }
    setIsChecking(false)
  }, [user, navigate])

  // Hiển thị loading trong khi kiểm tra
  if (isChecking && !shouldRender) {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-background'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  // Chỉ render children nếu đã xác nhận user chưa đăng nhập
  if (!shouldRender) {
    return (
      <div className='h-screen w-screen flex items-center justify-center bg-background'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    )
  }

  return <>{children}</>
}
