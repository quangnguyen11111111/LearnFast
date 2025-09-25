import { useState } from 'react'
import { Link } from 'react-router'
import imgLogin from '~/assets/imgLogin2.jpg'
import Button from '~/components/Button'
import GoogleButton from '~/components/ButtonLoginGoogle'
import Input from '~/components/Input'

// type cho form đăng ký
type RegisterForm = {
  userAccount: string
  userPassword: string
  userName: string
  userEmail: string
  userPhone: string
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    userAccount: '',
    userPassword: '',
    userName: '',
    userEmail: '',
    userPhone: ''
  })

  // cập nhật state
  const handleChange = (key: keyof RegisterForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  // config các field input
  const fields: { key: keyof RegisterForm; id: string; title: string; type: string }[] = [
    { key: 'userAccount', id: 'account', title: 'Tài khoản', type: 'text' },
    { key: 'userPassword', id: 'password', title: 'Mật khẩu', type: 'password' },
    { key: 'userName', id: 'name', title: 'Họ và tên', type: 'text' },
    { key: 'userEmail', id: 'email', title: 'Email', type: 'email' },
    { key: 'userPhone', id: 'phone', title: 'Số điện thoại', type: 'text' }
  ]

  // submit
  const handleSubmit = () => {
    console.log('Submit form:', formData)
    // TODO: gọi API đăng ký ở đây
  }

  return (
    <div className='grid grid-cols-[1fr_1fr] max-lg:grid-cols-[1fr] h-screen w-screen items-center overflow-hidden'>
      {/* Cột ảnh */}
      <div
        className='max-lg:hidden bg-cover h-full bg-no-repeat relative'
        style={{ backgroundImage: `url(${imgLogin})` }}
      >
        <p className='font-bold bg-gradient-to-br from-violet-500 to-green-500 bg-clip-text text-transparent text-[45px] text-center absolute w-xl top-55 left-1/2 -translate-x-1/2'>
          {/* bạn có thể thêm slogan ở đây */}
        </p>
      </div>

      {/* Form */}
      <div className='bg-background h-screen flex flex-col gap-7 items-center p-10 md:px-25 overflow-y-auto'>
        <p className='font-bold text-4xl'>Đăng kí</p>

        {fields.map((field) => (
          <Input
            key={field.id}
            id={field.id}
            valueInput={formData[field.key]}
            setValueInput={(v) => handleChange(field.key, v)}
            title={field.title}
            type={field.type}
          />
        ))}

        <Button className='w-full p-4' onClick={handleSubmit}>
          Đăng kí
        </Button>

        <p>
          Bạn đã có tài khoản?{' '}
          <Link to='/login' className='text-blue-500 cursor-pointer'>
            Đăng nhập
          </Link>
        </p>

        <div className='flex items-center w-full'>
          <div className='flex-1 border-t border-gray-300'></div>
          <span className='px-3 text-gray-600'>hoặc tiếp tục bằng Google</span>
          <div className='flex-1 border-t border-gray-300'></div>
        </div>

        <GoogleButton>Tiếp tục với Google</GoogleButton>
      </div>
    </div>
  )
}

export default RegisterPage
