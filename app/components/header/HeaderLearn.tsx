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
  const features: FeatureProps[] = [
    { icon: Square2StackIcon, title: 'Thẻ ghi nhớ', links: 'flash-card' },
    { icon: BookOpenIcon, title: 'Học', links: 'multiple-choice' },
    { icon: ClipboardDocumentCheckIcon, title: 'Kiểm tra', links: 'test' },
    { icon: NewspaperIcon, title: 'Blocks', links: '' },
    { icon: NewspaperIcon, title: 'Blast', links: '' },
    { icon: NewspaperIcon, title: 'Ghép thẻ', links: '' }
  ]
  const localhost = document.location.pathname
  // Tìm chức năng hiện tại dựa trên đường dẫn
  const activeFeature = features.find((f) => localhost.toLowerCase().includes(f.links.toLowerCase()))
  // Tạo mảng chức năng không bao gồm chức năng hiện tại
  const featuresCopy = features.filter((f) => f.title !== activeFeature?.title)

  const [isDropDown, setIsDropDown] = useState<boolean>(false)
  const navigate = useNavigate() // hàm điều hướng
  return (
    <div
      className='sticky top-0 left-0 bg-background
      md:flex md:justify-between
  grid grid-cols-[1fr_auto_1fr] items-center
  max-md:grid-cols-2 max-md:grid-rows-2
  px-15 py-3 max-md:px-5 z-50 gap-2'
    >
      <div
        className='flex max-md:flex-1 items-center justify-start gap-2 cursor-pointer hover:bg-gray-200 px-5 py-3 rounded-2xl relative'
        onClick={() => {
          setIsDropDown(!isDropDown)
        }}
      >
        {activeFeature?.icon && <activeFeature.icon className='size-6 text-blue-700' />}
        <span className='font-semibold text-gray-600'>{activeFeature?.title}</span>
        <ChevronDownIcon className='size-6' />
      </div>
      {/* danh mục lựa chọn */}
      <div
        className={`absolute max-md:left-5 top-16 shadow-xl border border-gray-100 py-2 rounded-lg w-58 ${isDropDown ? '' : 'hidden'}  bg-white `}
      >
        {featuresCopy.map((feature, index) => (
          <div
            key={index}
            className='flex items-center justify-start gap-5 cursor-pointer hover:bg-gray-200 px-3 py-2 mt-1'
            onClick={() => {
              navigate(feature.links)
              setIsDropDown(false)
            }}
          >
            <feature.icon className='size-6 text-blue-700' />
            <span className='font-semibold text-gray-600 text-sm'>{feature.title}</span>
          </div>
        ))}
        <div className='cursor-pointer hover:bg-gray-200 px-3 py-2 border-t border-gray-300 text-sm'>Trang chủ</div>
      </div>
      {/* Kết thúc danh mục lựa chọn */}
      <div
        className='font-semibold text-center
  max-md:col-span-2 max-md:row-start-2'
      >
        Thư mục 1
      </div>
      {/* Button thoát */}
      <div className='justify-self-end'>
        <IconButton
          icon={XMarkIcon}
          onClick={() => {
            navigate('/learn-lesson', { replace: true })
          }}
          size={8}
          variant='secondary'
        />
      </div>
    </div>
  )
}
export default HeaderLearn
