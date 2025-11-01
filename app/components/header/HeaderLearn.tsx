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
interface FeatureProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  links: string
}
const HeaderLearn = () => {
  // các chức năng
  const features:FeatureProps[] = [
    { icon: Square2StackIcon, title: 'Thẻ ghi nhớ', links: 'flash-card' },
    { icon: BookOpenIcon, title: 'Học', links: 'multiple-choice' },
    { icon: ClipboardDocumentCheckIcon, title: 'Kiểm tra', links: '' },
    { icon: NewspaperIcon, title: 'Blocks', links: '' },
    { icon: NewspaperIcon, title: 'Blast', links: '' },
    { icon: NewspaperIcon, title: 'Ghép thẻ', links: '' }
  ]
  const localhost = document.location.pathname
  // Tìm chức năng hiện tại dựa trên đường dẫn
  const activeFeature = features.find((f) => localhost.toLowerCase().includes(f.links.toLowerCase()))
  // Tạo mảng chức năng không bao gồm chức năng hiện tại
  const featuresCopy = features.filter(f => f.title !== activeFeature?.title)

  const [isDropDown, setIsDropDown] = useState<boolean>(false)
  const navigate = useNavigate() // hàm điều hướng
  return (
    <div className='flex justify-between items-center px-15 py-3 max-md:px-5'>
      <div
        className='flex max-md:flex-1 items-center justify-start gap-2 cursor-pointer hover:bg-gray-200 px-5 py-3 rounded-2xl relative'
        onClick={() => {
          setIsDropDown(!isDropDown)
        }}
      >
        <Square2StackIcon className='size-6 text-blue-700' />
        <span className='font-semibold text-gray-600'>{activeFeature?.title}</span>
        <ChevronDownIcon className='size-6' />
      </div>
      {/* danh mục lựa chọn */}
      <div
        className={`absolute top-16 shadow-xl border border-gray-100 py-2 rounded-lg w-58 ${isDropDown ? '' : 'hidden'} z-1000 bg-white `}
      >
        {featuresCopy.map((feature, index) => (
          <div
            key={index}
            className='flex items-center justify-start gap-5 cursor-pointer hover:bg-gray-200 px-3 py-2 mt-1'
            onClick={()=>{navigate(feature.links)
               setIsDropDown(false)}}
          >
            <feature.icon className='size-6 text-blue-700' />
            <span className='font-semibold text-gray-600 text-sm'>{feature.title}</span>
          </div>
        ))}
        <div className='cursor-pointer hover:bg-gray-200 px-3 py-2 border-t border-gray-300 text-sm'>Trang chủ</div>
      </div>
      {/* Kết thúc danh mục lựa chọn */}
      <div className='font-semibold max'>Thư mục 1</div>
      <IconButton
        icon={XMarkIcon}
        onClick={() => {
          navigate('/learn-lesson', { replace: true })
        }}
        size={8}
        variant='secondary'
      />
    </div>
  )
}
export default HeaderLearn
