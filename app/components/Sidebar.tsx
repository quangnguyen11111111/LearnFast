import { FolderIcon, FolderMinusIcon, FolderPlusIcon, HomeIcon } from '@heroicons/react/24/outline'
import { use, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { toggle } from '~/features/actionPage/toggleSlice'
import { useNavigate, useParams } from 'react-router'
import ModalCreateFolder from './ModalCreateFolder'

interface SideBarProps {
  children: React.ReactNode
}
interface IFolder {
  id: number
  title: string
}
const Sidebar = ({ children }: SideBarProps) => {
  const dispatch = useAppDispatch()
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
  const localhost = document.location.pathname
  const isInfoPage = localhost === '/learn-lesson'
  const overlayMode = isInfoPage ? 'fixed top-13 left-0 h-screen w-64 bg-white shadow-2xl px-4 pt-5 pb-15 z-40' : ''
  const overlayTranslate = isInfoPage ? (toggleValue ? 'translate-x-0' : '-translate-x-full') : ''
  const isLatest = localhost === '/latest' || localhost.includes('/libary')
  
  const navigate = useNavigate()
  const { folderId } = useParams()
  const [openModal, setOpenModal] = useState<boolean>(false)
  return (
    <div className={`relative ${!isInfoPage?'lg:grid lg:grid-cols-[auto_1fr]': ''}  px-5 ${!isLatest?'min-h-screen':'h-[calc(100vh-80px)]'} `}>
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto scrollbar-none overscroll-contain pb-5 
          ${!isInfoPage?`max-md:pb-25
          lg:sticky lg:top-0 lg:left-0 lg:h-full lg:bg-transparent lg:shadow-none
          ${toggleValue ? 'lg:w-45' : 'lg:w-12'}`:``}
          max-lg:fixed max-lg:top-12 max-md:top-20 max-sm:top-23 max-lg:left-0 max-lg:h-screen max-lg:w-64 max-lg:bg-white max-lg:shadow-2xl max-lg:px-4 max-lg:pt-5 max-lg:pb-15 max-lg:z-40
          ${toggleValue ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}
          
           /* overlay for isInfoPage */
          ${overlayMode}
          ${overlayTranslate}`}
      >
        {/* chuyển hướng Trang chủ */}
        <div className='mt-5 flex flex-col gap-3'>
          <div
            className={`flex flex-row items-center gap-2 whitespace-nowrap hover:bg-gray-300 rounded-md p-2 ${
              toggleValue ? '' : 'w-fit' }
               ${localhost.includes('/latest') ? 'text-blue-600' : 'text-gray-500'}
              `}
              onClick={()=>navigate('/latest')}
          >
            <HomeIcon className='size-6 flex-shrink-0  font-semibold' />
            <p className={`${!toggleValue && 'hidden'}  font-semibold text-sm`}>Trang chủ</p>
          </div>
          <div
          onClick={() => {navigate('/libary')
            if (toggleValue) {
              dispatch(toggle())
            }
          }}
            className={`flex flex-row items-center gap-2 whitespace-nowrap hover:bg-gray-300 rounded-md p-2 
              ${toggleValue ? '' : 'w-fit'}
              ${localhost.includes('/libary') ? 'text-blue-600' : 'text-gray-500'}
              `}
          >
            <FolderIcon className='size-6 flex-shrink-0  font-semibold' />
            <p className={`${!toggleValue && 'hidden'}  font-semibold text-sm`}>Thư viện của bạn</p>
          </div>
          <div className='w-full h-2 border-b-3 border-gray-200'></div>
        </div>

        {/* Thư mục của bạn */}
        <div className='mt-5 flex flex-col gap-3'>
          {listFolders &&
            listFolders.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/course/${item.id}`)}
                className={`flex flex-row items-center gap-2 whitespace-nowrap hover:bg-gray-300 rounded-md p-2 ${
                  toggleValue ? '' : 'w-fit'}
                  ${folderId == item.id.toString() ? 'text-blue-600' : 'text-gray-500'}
                `}
              >
                <FolderMinusIcon className='size-6 flex-shrink-0  font-semibold' />
                <p className={`${!toggleValue && 'hidden'}   font-semibold text-sm`}>{item.title}</p>
              </div>
            ))}

          <div
          onClick={()=>{setOpenModal(true)}}
            className={`flex flex-row items-center gap-2 whitespace-nowrap hover:bg-gray-300 rounded-md p-2 ${
              toggleValue ? '' : 'w-fit'
            }`}
          >
            <FolderPlusIcon className='size-6 flex-shrink-0 text-gray-500 font-semibold' />
            <p className={`${!toggleValue && 'hidden'} text-gray-500  font-semibold`}>Thư mục mới</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile/tablet */}
      {toggleValue && <div className={`fixed inset-0 bg-black/30 z-30 ${isInfoPage ? '' : 'lg:hidden'} `} onClick={() => dispatch(toggle())} />}

      {/* Content */}
      <div className='w-full scrollbar-none overflow-y-auto'>{children}</div>
      <ModalCreateFolder isOpen={openModal} setIsOpen={setOpenModal} />
    </div>
  )
}
export default Sidebar
