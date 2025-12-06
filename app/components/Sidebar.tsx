import { FolderIcon, FolderMinusIcon, FolderPlusIcon, HomeIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useAppSelector } from '~/store/hook'

interface SideBarProps {
  children: React.ReactNode
}
interface IFolder {
  id: number
  title: string
}
const Sidebar = ({ children }: SideBarProps) => {
  const toggleValue = useAppSelector((state) => state.toggle.actionUserPage)
  const [listFolders, setListFolders] = useState<IFolder[]>([
    {
      id: 1,
      title: 'Thư mục 1'
    },
    {
      id: 2,
      title: 'Thư mục 2'
    },
    {
      id: 3,
      title: 'Thư mục 2'
    },
    {
      id: 4,
      title: 'Thư mục 2'
    },
    {
      id: 5,
      title: 'Thư mục 2'
    },
    {
      id: 6,
      title: 'Thư mục 2'
    },
    {
      id: 7,
      title: 'Thư mục 2'
    },
    {
      id: 8,
      title: 'Thư mục 2'
    },
    {
      id: 9,
      title: 'Thư mục 2'
    },
    {
      id: 10,
      title: 'Thư mục 2'
    },
    {
      id: 11,
      title: 'Thư mục 2'
    }
  ])
  return (
    <div className='grid grid-cols-[auto_1fr] px-5 h-[calc(100vh-80px)]'>
      {/* Sidebar */}
      <div
        className={` transition-all duration-300 ease-in-out ${toggleValue ? 'w-45' : ' max-md:w-0 w-12'} overflow-x-hidden overflow-y-auto
          scrollbar-none sticky top-0 left-0 overscroll-contain pb-5 max-md:pb-15 `}
      >
        {/* chuyển hướng Trang chủ */}
        <div className='mt-5 flex flex-col gap-3'>
          <div
            className={`flex flex-row items-center gap-2 whitespace-nowrap hover:bg-gray-300 rounded-md p-2 ${
              toggleValue ? '' : 'w-fit'
            }`}
          >
            <HomeIcon className='size-6 flex-shrink-0 text-gray-500 font-semibold' />
            <p className={`${!toggleValue && 'hidden'} text-gray-500  font-semibold text-sm`}>Trang chủ</p>
          </div>
          <div
            className={`flex flex-row items-center gap-2 whitespace-nowrap hover:bg-gray-300 rounded-md p-2 ${
              toggleValue ? '' : 'w-fit'
            }`}
          >
            <FolderIcon className='size-6 flex-shrink-0 text-gray-500 font-semibold' />
            <p className={`${!toggleValue && 'hidden'} text-gray-500  font-semibold text-sm`}>Thư viện của bạn</p>
          </div>
          <div className='w-full h-2 border-b-3 border-gray-200'></div>
        </div>

        {/* Thư mục của bạn */}
        <div className='mt-5 flex flex-col gap-3'>
          {listFolders &&
            listFolders.map((item) => (
              <div
                key={item.id}
                className={`flex flex-row items-center gap-2 whitespace-nowrap hover:bg-gray-300 rounded-md p-2 ${
                  toggleValue ? '' : 'w-fit'
                }`}
              >
                <FolderMinusIcon className='size-6 flex-shrink-0 text-gray-500 font-semibold' />
                <p className={`${!toggleValue && 'hidden'} text-gray-500  font-semibold text-sm`}>{item.title}</p>
              </div>
            ))}

          <div
            className={`flex flex-row items-center gap-2 whitespace-nowrap hover:bg-gray-300 rounded-md p-2 ${
              toggleValue ? '' : 'w-fit'
            }`}
          >
            <FolderPlusIcon className='size-6 flex-shrink-0 text-gray-500 font-semibold' />
            <p className={`${!toggleValue && 'hidden'} text-gray-500  font-semibold`}>Thư mục mới</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className=' w-full scrollbar-none overflow-y-auto
    sticky top-0 right-0 '
      >
        {children}
      </div>
    </div>
  )
}
export default Sidebar
