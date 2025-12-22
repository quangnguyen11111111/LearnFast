import { useRef, useState, type RefObject } from 'react'
import { Link, useNavigate } from 'react-router'
import imgLogin from '~/assets/imgLogin2.jpg'
import Button from '~/components/button/Button'
import GoogleButton from '~/components/button/ButtonLoginGoogle'
import Input from '~/components/input/Input'
import { registerLocalAccount } from '~/features/auth/authSlice'
import { useAppDispatch } from '~/store/hook'
import { toast } from 'react-toastify'

// type cho form đăng ký
type RegisterForm = {
  userPassword: string
  userName: string
  userEmail: string
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    userPassword: '',
    userName: '',
    userEmail: ''
  })

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  // cập nhật state
  const handleChange = (key: keyof RegisterForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  // config các field input
  const fields: {
    key: keyof RegisterForm
    id: string
    title: string
    type: string
    ref?: RefObject<HTMLInputElement | null>
  }[] = [
    { key: 'userEmail', id: 'email', title: 'Email', type: 'email', ref: emailRef },
    { key: 'userPassword', id: 'password', title: 'Mật khẩu', type: 'password', ref: passwordRef },
    { key: 'userName', id: 'name', title: 'Họ và tên', type: 'text', ref: nameRef }
  ]

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const validateForm = () => {
    const email = formData.userEmail.trim()
    const password = formData.userPassword
    const name = formData.userName.trim()


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email === '') {
      toast.error('Email không được để trống')
      emailRef.current?.focus()
      return false
    }

    if (!emailPattern.test(email)) {
      toast.error('Email phải đúng định dạng')
      emailRef.current?.focus()
      return false
    }

    if (email.length > 60) {
      toast.error('Email không được vượt quá 60 ký tự')
      emailRef.current?.focus()
      return false
    }

    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      passwordRef.current?.focus()
      return false
    }

    if (password.includes(' ')) {
      toast.error('Mật khẩu không được chứa dấu cách')
      passwordRef.current?.focus()
      return false
    }

    if (name === '') {
      toast.error('Họ và tên không được để trống')
      nameRef.current?.focus()
      return false
    }
    return true
  }
  // submit
  const handleSubmit = async () => {
    console.log('Submit form:', formData)
    // TODO: gọi API đăng ký ở đây
    if (!validateForm()) return

    try {
      const response = await dispatch(
        registerLocalAccount({
          email: formData.userEmail,
          password: formData.userPassword,
          username: formData.userName
        })
      ).unwrap()
      if (response.errCode === 0) {
        toast.success(response.message || 'Tạo tài khoản thành công')
        navigate(-1)
      } else {
        toast.error(response.message || 'Tạo tài khoản thất bại')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Unknown error')
    }
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
            inputRef={field.ref}
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
