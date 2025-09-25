import { Link } from 'react-router'
import logo from '../assets/logo.png'
import { Bars3Icon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import Button from './ButtonIcon'
import { useAppDispatch } from '~/store/hook'
import { toggle } from '~/features/actionPage/toggleSlice'
interface HeaderProps {
  display: 'sticky' | 'static'
  shadow: boolean
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
export default function HeaderUser({ display, shadow }: HeaderProps) {
  const dispatch = useAppDispatch()
  return (
    <header className={`bg-background text-black ${display} ${shadow ? 'shadow' : ''} top-0 z-10`}>
      <div className=' w-full  mx-auto px-5 flex items-center justify-between gap-10 py-2 '>
        <div className='flex items-center cursor-pointer'>
           <Button icon={Bars3Icon} variant={"secondary"} size={7} onClick={() => {dispatch(toggle())}} />
          <Link to={'/latest'} className=' flex items-center'>
            <img src={logo} alt='logo' className='size-15' />
          </Link>
        </div>

        <div className='flex-1 max-w-[55rem]'>
          <SearchInput />
        </div>
        <div className='flex items-center'>
          <Button icon={PlusIcon} onClick={() => {}} />
          <img src={logo} alt='avatar' className='size-16 rounded-2xl' />
        </div>
      </div>
    </header>
  )
}
