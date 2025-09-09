import { useState } from 'react';
import imgLogin from '~/assets/imgLogin.jpg'
import logo from '~/assets/logo.png';
import Input from '~/components/Input';
const LoginPage = () => {
  const [valueInput, setValueInput] = useState<string>('');
  console.log(valueInput);
  
  return (
    <div className='flex h-screen w-screen items-center justify-between overflow-hidden'>
      <div className='max-lg:hidden bg-cover flex flex-1 h-full bg-no-repeat relative' style={{ backgroundImage: `url(${imgLogin})` }}>
        <p className='font-bold bg-gradient-to-r from-violet-500 to-green-500 bg-clip-text text-transparent h-full text-5xl absolute w-md top-48 left-1/2 -translate-x-1/2'>Ghi nhớ nhanh chóng mà lâu dài</p>
        <img src={logo} alt="" className='size-35 absolute top-2/5 left-1/5'/>
        <img src={logo} alt="" className='size-35 absolute top-2/5 left-2/5' />
        <img src={logo} alt="" className='size-35 absolute top-2/5 left-3/5' />
      </div>
      <div className='flex-1 bg-background h-screen flex flex-col justify-center items-center'>
      <Input id='username' valueInput={valueInput} setValueInput={setValueInput} title='Nhap ten' type='text'/>
      </div>
    </div>
  )
}

export default LoginPage
