import { Link, useNavigate } from 'react-router'
import logo from '../../assets/logo.png'
import { BackspaceIcon, Bars3Icon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import Button from '../button/ButtonIcon'
import { useAppDispatch } from '~/store/hook'
import { toggle } from '~/features/actionPage/toggleSlice'
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
  console.log(linkTo);
  
  return (
    <header className={`bg-background text-black ${display==='sticky' ? 'sticky top-0' : ''} ${shadow ? 'shadow' : ''}z-10`}>
      <div className=' w-full  mx-auto px-5 grid grid-cols-[auto_1fr_auto] items-center gap-10 max-sm:gap-1 py-2'>
        <div className='flex items-center cursor-pointer'>
          <Button
            icon={linkTo =='create-lesson' ? BackspaceIcon : Bars3Icon}
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
        <div className='flex items-center  max-sm:col-span-2 justify-end'>
          <Button icon={PlusIcon} onClick={() => {}} />
          <img src={logo} alt='avatar' className='size-16 rounded-2xl' />
        </div>
      </div>
    </header>
  )
}
