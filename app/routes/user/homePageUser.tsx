import { HomeIcon } from '@heroicons/react/24/outline'
import { useAppSelector } from '~/store/hook'

const HomePageUser = () => {
  const toggleValue = useAppSelector((state) => state.toggle.actionUserPage)
  return (
    <div className='h-screen w-full bg-red-600 grid grid-cols-[auto_1fr] px-5 '>
      <div className={`bg-amber-300 transition-all duration-300 ease-in-out ${toggleValue?"w-50":"w-10"} `}>
          <div className={`flex flex-row items-center gap-4 overflow-hidden whitespace-nowrap` }>
            <HomeIcon className='size-8 flex-shrink-0'/>
            <p className={`${!toggleValue&&"hidden"}  `}>Trang chủ</p>
          </div>
        </div>
      <div className=' w-full bg-gray-200'></div>
    </div>
  )
}
export default HomePageUser
