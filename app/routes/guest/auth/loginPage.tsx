import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import imgLogin from '~/assets/imgLogin2.jpg'
import Button from '~/components/button/Button'
import Input from '~/components/input/Input'
import GoogleButton from '~/components/button/ButtonLoginGoogle'
import { useAppDispatch } from '~/store/hook'
import { loginWithLocalAccount } from '~/features/auth/authSlice'

type LoginForm = {
  account: string
  password: string
}

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginForm>({
    account: '',
    password: ''
  })
    const dispatch = useAppDispatch();
  const navigate = useNavigate()
  // cập nhật state
  const handleChange = (key: keyof LoginForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  // submit form
  const handleSubmit = async() => {
    try {
          const response = await dispatch(
            loginWithLocalAccount({ email: formData.account, password: formData.password })
          ).unwrap();
          if (response.errCode === 0) {
            alert( response.message);
            navigate("/latest", { replace: true });
          } else {
            alert( response.message);
          }
        } catch (error) {
          alert( "Hệ thống bị mất kết nối");
          console.error("đây là lỗi login",error);
        }
  }

  return (
    <div className='grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] h-screen w-screen items-center overflow-hidden'>
      {/* Cột ảnh */}
      <div
        className='max-lg:hidden bg-cover h-full bg-no-repeat relative'
        style={{ backgroundImage: `url(${imgLogin})` }}
      >
        {/* Bạn có thể thêm slogan hoặc logo */}
      </div>

      {/* Form */}
      <div className='bg-background h-screen flex flex-col gap-7 justify-center items-center p-10 md:px-25 overflow-y-auto'>
        <p className='font-bold text-4xl'>Đăng nhập</p>

        <Input
          id='account'
          valueInput={formData.account}
          setValueInput={(v) => handleChange('account', v)}
          title='Tài khoản'
          type='text'
        />

        <div className='w-full flex flex-col gap-2 items-end'>
          <Input
            id='password'
            valueInput={formData.password}
            setValueInput={(v) => handleChange('password', v)}
            title='Mật khẩu'
            type='password'
          />
          <Link to='/' className='hover:text-blue-400 font-bold text-blue-500 text-sm'>
            Quên mật khẩu?
          </Link>
        </div>

        <Button className='w-full p-4' onClick={handleSubmit}>
          Đăng nhập
        </Button>

        <p className='text-center'>
          Bạn chưa có tài khoản?{' '}
          <Link to='/register' className='cursor-pointer text-blue-500 hover:text-blue-700'>
            Đăng kí tài khoản ngay
          </Link>
        </p>

        <div className='flex items-center w-full'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-3 text-gray-600'>hoặc đăng nhập bằng Google</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>

        <GoogleButton />
      </div>
    </div>
  )
}

export default LoginPage
