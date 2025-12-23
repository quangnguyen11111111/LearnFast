import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { refreshToken } from '~/features/api/auth/authSlice'
import { useAppDispatch, useAppSelector } from '~/store/hook'

const RefreshToken = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('refreshToken')
    if (token) {
      dispatch(refreshToken(token))
        .unwrap()
        .then((response) => {
          if (response.errCode !== 0) {
            navigate('/login', { replace: true })
          }
        })
        .catch(() => {
          navigate('/login', { replace: true })
        })
    }
  }, [dispatch, navigate])

  return <></>
}
export default RefreshToken
