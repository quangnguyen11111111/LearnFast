import { useRef } from 'react'

interface TextAreaProps {
  placeholder?: string
  valueInput: string
  rows:number
  setValueInput: (value: string) => void
}
const TextArea = ({ placeholder,valueInput,rows,setValueInput }: TextAreaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null)//ref textarea
  // hàm mở rộng chiều cao
  const handleInput = () => {
    const textarea = ref.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
  }
  // hàm cập nhật dữ liệu người dùng nhập
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValueInput(e.target.value)
  }
  return (
    <>
      <textarea
        ref={ref}
        value={valueInput}
        onChange={handleChange}
        placeholder={`${placeholder ? placeholder : ' '}`}
        onInput={handleInput}
        rows={rows}
        className='overflow-hidden resize-none w-full min-h-fit pl-4 pr-12 text-xl border-b-2 border rounded-md border-transparent py-3 
        text-gray-900 focus:border-blue-500 focus:outline-none focus:bg-white transition-all duration-300 bg-gray-200'
      />
    </>
  )
}
export default TextArea
