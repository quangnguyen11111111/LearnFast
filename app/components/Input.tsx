import { EyeDropperIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface InputProps {
  valueInput: string
  title: string
  id: string
  type: string
  setValueInput: (value: string) => void
  placeholder?: string
}
const Input = ({ valueInput, title, id, type, setValueInput, placeholder=" " }: InputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueInput(e.target.value)
  }
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  return (
    <>
      <div className='relative w-full'>
        <input
          type={type == 'password' ? (showPassword ? 'text' : type) : type}
          value={valueInput}
          onChange={handleChange}
          onFocus={() => {
            setIsFocused(!isFocused)
          }}
          onBlur={() => {
            setIsFocused(!isFocused)
          }}
          placeholder={`${isFocused ? placeholder : ' '}`}
          id={id}
          className='peer w-full h-full pl-4 pr-12 text-xl border-b-2 border rounded-md border-transparent py-3 text-gray-900 focus:border-blue-500 focus:outline-none 
          focus:bg-white transition-all duration-300 bg-gray-200'
        />
        <label
          htmlFor={id}
          className='absolute left-0 -top-5 text-sm text-blue-500 transition-all duration-300
               peer-placeholder-shown:top-1/2 peer-placeholder-shown:font-semibold peer-placeholder-shown:left-4 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
               peer-focus:-top-5 peer-focus:text-sm peer-focus:font-medium peer-focus:text-blue-700 peer-focus:translate-y-0 peer-focus:left-0 '
        >
          {title}
        </label>
        <EyeIcon
          className={` ${showPassword ? 'hidden' : ''} ${type == 'password' ? '' : 'hidden'} absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-500 size-7`}
          onClick={() => setShowPassword(!showPassword)}
        />
        <EyeSlashIcon
          className={` ${showPassword ? '' : 'hidden'} ${type == 'password' ? '' : 'hidden'} absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-500 size-7`}
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>
    </>
  )
}
export default Input
