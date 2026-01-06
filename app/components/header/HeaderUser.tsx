import { Link, useNavigate } from 'react-router'
import logo from '../../assets/logo.png'
import {
  BackspaceIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  PlusIcon,
  Cog6ToothIcon,
  MoonIcon
} from '@heroicons/react/24/outline'
import { TrophyIcon } from '@heroicons/react/24/solid'
import Button from '../button/ButtonIcon'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { toggle } from '~/features/actionPage/toggleSlice'
import { useEffect, useRef, useState } from 'react'
import { DocumentIcon, FolderIcon } from '@heroicons/react/24/outline'
import ModalCreateFolder from '../ModalCreateFolder'
import { logout } from '~/features/api/auth/authSlice'
interface HeaderProps {
  display: 'sticky' | 'static'
  shadow: boolean
  linkTo?: string
}
const SearchInput = () => {
  return (
    <div className='flex items-center gap-2 py-2 px-3 rounded-md focus-within:outline-2 focus-within:outline-blue-400 focus-within:bg-white  bg-gray-100'>
      <MagnifyingGlassIcon className='size-5 text-gray-500' />
      <input
        type='text'
        className='flex-1 bg-transparent outline-none placeholder-gray-400 placeholder:font-semibold'
        placeholder='Tìm thẻ ghi nhớ'
      />
    </div>
  )
}
export default function HeaderUser({ display, shadow, linkTo }: HeaderProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const userButtonRef = useRef<HTMLImageElement>(null)
  const { user, loading } = useAppSelector((state) => state.auth)

  const refreshToken = localStorage.getItem('refreshToken')
  useEffect(() => {
    if (!user && !refreshToken) {
      navigate('/login', { replace: true })
    }
  }, [refreshToken])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }

      if (
        userDropdownRef.current &&
        userButtonRef.current &&
        !userDropdownRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false)
      }
    }

    // Close dropdown when scrolling
    const handleScroll = () => {
      setIsDropdownOpen(false)
      setIsUserDropdownOpen(false)
    }

    if (isDropdownOpen || isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('wheel', handleScroll)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('wheel', handleScroll)
    }
  }, [isDropdownOpen, isUserDropdownOpen])
  return (
    <>
      <header
        className={`bg-background text-black ${display === 'sticky' ? 'sticky top-0' : ''} ${shadow ? 'shadow' : ''} z-50`}
      >
        <div className=' w-full  mx-auto px-5 grid grid-cols-[auto_1fr_auto] items-center gap-10 max-sm:gap-1 py-2'>
          <div className='flex items-center cursor-pointer'>
            <Button
              icon={linkTo == 'create-lesson' ? BackspaceIcon : Bars3Icon}
              variant={'secondary'}
              size={7}
              onClick={() => {
                if (linkTo === 'create-lesson') {
                  navigate(-1)
                  return
                }
                dispatch(toggle())
              }}
            />
            <Link to={'/latest'} className=' flex items-center'>
              <img src={logo} alt='logo' className='size-15' />
            </Link>
          </div>

          <div className='max-w-[55rem] w-full mx-auto max-sm:col-span-3 max-sm:order-1'>
            <SearchInput />
          </div>
          <div className='flex items-center  max-sm:col-span-2 justify-end gap-x-5 relative'>
            <Button
              ref={buttonRef}
              icon={PlusIcon}
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen)
              }}
            />

            <img
              ref={userButtonRef}
              src={user?.avatar || logo}
              alt='avatar'
              className='size-11 rounded-full cursor-pointer'
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            />
          </div>
        </div>
      </header>
      <ModalCreateFolder isOpen={openModal} setIsOpen={setOpenModal} />
      {/* khung giao diện thêm thư mục và hoch phần */}
      <div
        ref={dropdownRef}
        className={` fixed top-20 min-w-50 px-5 right-[6rem] z-1000 p-4 rounded-md shadow-lg bg-white ${isDropdownOpen ? '' : 'hidden'}`}
      >
        <div
          className='flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-2'
          onClick={() => {
            setOpenModal(true)
            setIsDropdownOpen(false)
          }}
        >
          <FolderIcon className='size-6 text-gray-600 stroke-[2] ' />
          <p className='font-semibold text-gray-600'>Thêm thư mục</p>
        </div>
        <div
          className='flex items-center gap-2 hover:bg-gray-100 cursor-pointer p-2'
          onClick={() => {
            navigate('create-lesson')
            setIsDropdownOpen(false)
          }}
        >
          <DocumentIcon className='size-6 text-gray-600 stroke-[2]' />
          <p className='mt-2 font-semibold text-gray-600'>Thêm học phần</p>
        </div>
      </div>
      {/* khung giao diện dropdown người dùng */}
      <div
        ref={userDropdownRef}
        className={`fixed top-20 right-5 w-64 z-50 bg-white rounded-lg shadow-lg border border-gray-200 ${
          isUserDropdownOpen ? '' : 'hidden'
        }`}
      >
        {/* User Info */}
        <div className='p-4 border-b border-gray-200'>
          <div className='flex items-center gap-3'>
            <img src={user?.avatar || logo} alt='avatar' className='size-12 rounded-full' />
            <div className='flex-1 min-w-0'>
              <p className='font-semibold text-gray-800 truncate'>{user && user.username}</p>
              <p className='text-sm text-gray-500 truncate'>{user && user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className='py-2'>
          <div
            className='px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition'
            onClick={() => {
              setIsUserDropdownOpen(false)
            }}
          >
            <TrophyIcon className='size-5 text-yellow-500' />
            <span className='font-medium'>Thành tựu</span>
          </div>

          <div
            className='px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition'
            onClick={() => {
              navigate('/settings')
              setIsUserDropdownOpen(false)
            }}
          >
            <Cog6ToothIcon className='size-5 text-gray-600' />
            <span className='font-medium'>Cài đặt</span>
          </div>

          <div
            className='px-4 py-2 flex items-center gap-3 text-gray-700 hover:bg-gray-50 cursor-pointer transition'
            onClick={() => {
              setIsUserDropdownOpen(false)
            }}
          >
            <MoonIcon className='size-5 text-gray-600' />
            <span className='font-medium'>Tối</span>
          </div>
        </div>

        {/* Footer */}
        <div className='px-4 py-2 border-t border-gray-200 text-sm text-gray-500'>
          <div
            className='hover:text-blue-500 cursor-pointer transition'
            onClick={() => {
              dispatch(logout())
            }}
          >
            Đăng xuất
          </div>
        </div>
      </div>
    </>
  )
}
