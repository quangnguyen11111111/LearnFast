import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import imgLogin from '~/assets/imgLogin2.jpg'
import logo from '~/assets/logo.png'
import Button from '~/components/Button'
import Input from '~/components/Input'
import GoogleButton from '~/components/ButtonLoginGoogle'
import { loginWithGoogleAccount } from '~/features/auth/authSlice'
import { useAppDispatch } from '~/store/hook'
const LoginPage = () => {
  const [valueInputAcc, setValueInputAcc] = useState<string>('')
  const [valueInputPass, setValueInputPass] = useState<string>('')

  console.log(valueInputAcc, valueInputPass)
  return (
    <div className='grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] h-screen w-screen items-center justify-between overflow-hidden relative'>
      <Link to={"/"} className='absolute right-5 top-3'>X</Link>
      <div
        className='max-lg:hidden bg-cover  h-full bg-no-repeat relative'
        style={{ backgroundImage: `url(${imgLogin})` }}
      >
        <p className='font-bold bg-gradient-to-br from-violet-500 to-green-500 bg-clip-text text-transparent text-[45px] text-center absolute w-xl top-55 left-1/2 -translate-x-1/2'></p>
        {/* <img src={logo} alt='' className='size-35 absolute top-2/5 left-1/5' /> */}
      </div>
      <div className=' bg-background h-screen flex flex-col gap-7 justify-center items-center p-10 md:px-25 overflow-y-scroll '>
        <p className='font-bold text-4xl'>Đăng nhập</p>
        <Input id='account' valueInput={valueInputAcc} setValueInput={setValueInputAcc} title='Tài khoản' type='text' />
        <div className='w-full flex flex-col gap-2 items-end'>
          <Input
            id='password'
            valueInput={valueInputPass}
            setValueInput={setValueInputPass}
            title='Mật khẩu'
            type='password'
          />
          <Link to={'/'} className='hover:text-blue-400 font-bold text-blue-500 text-sm'>
            Quên mật khẩu
          </Link>
        </div>
        <Button children='Đăng nhập' className='w-full p-4' />
        <p className='text-center'>Bạn chưa có tài khoản? <Link to={"/register"} className='cursor-pointer text-blue-500 hover:text-blue-700'>Đăng kí tài khoản ngay</Link></p>
        <div className='flex items-center w-full'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-3 text-gray-600'>hoặc dăng nhập bằng google</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>
        <GoogleButton />
      </div>
    </div>
  )
}

export default LoginPage
