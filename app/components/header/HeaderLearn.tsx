import {
  BookOpenIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  NewspaperIcon,
  Square2StackIcon,
  XMarkIcon
} from '@heroicons/react/24/solid'
import { useState } from 'react'
import Button from '../button/Button'
import IconButton from '../button/ButtonIcon'
import { useNavigate } from 'react-router'

const HeaderLearn = () => {
  // các chức năng
  const features = [
    { icon: BookOpenIcon, title: 'Học', links: '' },
    { icon: ClipboardDocumentCheckIcon, title: 'Kiểm tra', links: '' },
    { icon: NewspaperIcon, title: 'Blocks', links: '' },
    { icon: NewspaperIcon, title: 'Blast', links: '' },
    { icon: NewspaperIcon, title: 'Ghép thẻ', links: '' }
  ]
  const localhost = document.location.origin
  const [isDropDown, setIsDropDown] = useState<boolean>(false)
    const navigate=useNavigate()// hàm điều hướng
  return (
    <div className='flex justify-between items-center px-15 py-3'>
      <div className='flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 px-5 py-3 rounded-2xl relative' onClick={()=>{setIsDropDown(!isDropDown)}}>
        <Square2StackIcon className='size-6 text-blue-700'/>
        <span className='font-semibold text-gray-600'>Thẻ ghi nhớ</span>
        <ChevronDownIcon className='size-6' />
      </div>
      {/* danh mục lựa chọn */}
      <div className={`absolute top-16 shadow-xl border border-gray-100 py-2 rounded-lg w-58 ${isDropDown?'' :'hidden'} z-1000 bg-white `}>
        {features.map((feature, index) => (
          <div key={index} className='flex items-center justify-start gap-5 cursor-pointer hover:bg-gray-200 px-3 py-2 mt-1'>
            <feature.icon className='size-6 text-blue-700'/>
            <span className='font-semibold text-gray-600 text-sm'>{feature.title}</span>
          </div>
        ))}
        <div className="cursor-pointer hover:bg-gray-200 px-3 py-2 border-t border-gray-300 text-sm">Trang chủ</div>
      </div>
      {/* Kết thúc danh mục lựa chọn */}
      <div className="font-semibold">Thư mục 1</div>
      <IconButton icon={XMarkIcon} onClick={()=>{navigate(-1)}} size={8} variant='secondary'/>
    </div>
  )
}
export default HeaderLearn
