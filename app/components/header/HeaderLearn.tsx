import {
  BookOpenIcon,
  ChevronDownIcon,
  ClipboardDocumentCheckIcon,
  NewspaperIcon,
  Square2StackIcon,
  XMarkIcon
} from '@heroicons/react/24/solid'
import { useEffect, useRef, useState } from 'react'
import Button from '../button/Button'
import IconButton from '../button/ButtonIcon'
import { replace, useNavigate, useSearchParams } from 'react-router'
interface FeatureProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  links: string
}
const HeaderLearn = () => {
  const [searchParams] = useSearchParams()

  const fileID = searchParams.get('fileId')

  // các chức năng
  const features: FeatureProps[] = [
    { icon: Square2StackIcon, title: 'Thẻ ghi nhớ', links: 'flash-card' },
    { icon: BookOpenIcon, title: 'Học', links: 'multiple-choice' },
    { icon: ClipboardDocumentCheckIcon, title: 'Kiểm tra', links: 'test' },
    { icon: NewspaperIcon, title: 'Blocks', links: 'blocks' },
    { icon: NewspaperIcon, title: 'Ghép thẻ', links: 'card-matching' }
  ]
  const localhost = document.location.pathname
  // Tìm chức năng hiện tại dựa trên đường dẫn
  const activeFeature = features.find((f) => localhost.toLowerCase().includes(f.links.toLowerCase()))

  // Tạo mảng chức năng không bao gồm chức năng hiện tại
  const featuresCopy = features.filter((f) => f.title !== activeFeature?.title)

  const [isDropDown, setIsDropDown] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (!isDropDown) return
      const inDropdown = dropdownRef.current?.contains(target)
      const inTrigger = triggerRef.current?.contains(target)
      if (!inDropdown && !inTrigger) {
        setIsDropDown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDropDown])
  const navigate = useNavigate() // hàm điều hướng
  return (
    <div
      className={`sticky top-0 left-0 bg-background
      md:flex md:justify-between
  grid grid-cols-[1fr_auto_1fr] items-center
  ${activeFeature?.links === 'blocks' ? 'max-lg:grid-cols-[1fr_auto]' : 'max-md:grid-cols-2 '}
  px-15 py-3 max-md:px-5 z-50 gap-2`}
    >
      <div
        ref={triggerRef}
        className='flex max-md:flex-1 items-center justify-start gap-2 cursor-pointer hover:bg-gray-200 px-5 py-3 rounded-2xl relative'
        onClick={() => {
          setIsDropDown(!isDropDown)
        }}
      >
        {activeFeature?.icon && <activeFeature.icon className='size-6 max-lg:size-5 text-blue-700' />}
        <span className='font-semibold text-gray-600 max-lg:hidden'>{activeFeature?.title}</span>
        <ChevronDownIcon className='size-6' />
      </div>
      {/* danh mục lựa chọn */}
      <div
        ref={dropdownRef}
        className={`absolute max-md:left-5 top-16 shadow-xl border border-gray-100 py-2 rounded-lg w-58 ${isDropDown ? '' : 'hidden'}  bg-white `}
      >
        {featuresCopy.map((feature, index) => (
          <div
            key={index}
            className='flex items-center justify-start gap-5 cursor-pointer hover:bg-gray-200 px-3 py-2 mt-1'
            onClick={() => {
              if (!fileID) return
              navigate(
                {
                  pathname: feature.links,
                  search: `?fileId=${fileID}`
                },
                {
                  replace: true
                }
              )
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
        className={`font-semibold text-center
  max-md:col-span-2 max-md:row-start-2 ${activeFeature?.links === 'blocks' || activeFeature?.links === 'card-matching' ? 'max-lg:hidden' : ''}`}
      >
        Thư mục 1
      </div>
      {/* Button thoát */}
      <div className='justify-self-end'>
        <IconButton
          icon={XMarkIcon}
          onClick={() => {
            navigate(-1)
          }}
          size={8}
          variant='secondary'
        />
      </div>
    </div>
  )
}
export default HeaderLearn
