import { useState } from 'react'
import { Link } from 'react-router'
import imgLogin from '~/assets/imgLogin2.jpg'
import Button from '~/components/Button'
import GoogleButton from '~/components/ButtonLoginGoogle'
import Input from '~/components/Input'
const RegisterPage = () => {
  const [listInput, setListInput] = useState<{
    userAccount: string
    userPassword: string
    userName: string
    userGmail: string
    userPhone: string
  }>({
    userAccount: '',
    userPassword: '',
    userName: '',
    userGmail: '',
    userPhone: ''
  })
  console.log(listInput)

  // hàm cập nhật state cho từng field
  const handleChange = (key: keyof typeof listInput, value: string) => {
    setListInput((prev) => ({
      ...prev,
      [key]: value
    }))
  }
  return (
    <div className='grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] h-screen w-screen items-center justify-between overflow-hidden'>
      <div
        className='max-lg:hidden bg-cover  h-full bg-no-repeat relative'
        style={{ backgroundImage: `url(${imgLogin})` }}
      >
        <p className='font-bold bg-gradient-to-br from-violet-500 to-green-500 bg-clip-text text-transparent text-[45px] text-center absolute w-xl top-55 left-1/2 -translate-x-1/2'></p>
        {/* <img src={logo} alt='' className='size-35 absolute top-2/5 left-1/5' /> */}
      </div>
      <div className=' bg-background h-screen flex flex-col gap-7 justify-start items-center p-10 md:px-25 overflow-y-scroll'>
        <p className='font-bold text-4xl'>Đăng kí</p>
        <Input
          id='account'
          valueInput={listInput.userAccount}
          setValueInput={(value) => handleChange('userAccount', value)}
          title='Tài khoản'
          type='text'
        />
        <Input
          id='password'
          valueInput={listInput.userPassword}
          setValueInput={(value) => {
            handleChange('userPassword', value)
          }}
          title='Mật khẩu'
          type='password'
        />
        <Input
          id='name'
          valueInput={listInput.userName}
          setValueInput={(value) => {
            handleChange('userName', value)
          }}
          title='Họ và tên'
          type='text'
        />
        <Input
          id='gmail'
          valueInput={listInput.userGmail}
          setValueInput={(value) => {
            handleChange('userGmail', value)
          }}
          title='Gmail'
          type='text'
        />
        <Input
          id='phone'
          valueInput={listInput.userPhone}
          setValueInput={(value) => {
            handleChange('userPhone', value)
          }}
          title='Số điện thoại'
          type='text'
        />
        <Button children='Đăng kí' className='w-full p-4' />
        <p>Bạn đã có tài khoản? <Link to={"/login"} className='text-blue-500 cursor-pointer '>Đăng nhập</Link></p>
        <div className='flex items-center w-full'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-3 text-gray-600'>hoặc tiếp tục bằng google</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>
        <GoogleButton children='Tiếp tục với google' />
      </div>
    </div>
  )
}
export default RegisterPage
