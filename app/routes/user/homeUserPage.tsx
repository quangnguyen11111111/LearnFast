import { DocumentIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import logo from '~/assets/logo.png'
import ListItem from '~/components/Listitem'
const HomeUserPage = () => {
  const [ListItemPopular, setListItemPopular] = useState<
    {
      title: string
      numberTerms: number
      avatar: string
      nameUser: string
    }[]
  >([
    {
      title: 'Bộ thẻ 1',
      numberTerms: 50,
      avatar: 'string',
      nameUser: 'người dùng 1'
    },
    {
      title: 'Bộ thẻ 1',
      numberTerms: 50,
      avatar: 'string',
      nameUser: 'người dùng 1'
    },
    {
      title: 'Bộ thẻ 1',
      numberTerms: 50,
      avatar: 'string',
      nameUser: 'người dùng 1'
    },
    {
      title: 'Bộ thẻ 1',
      numberTerms: 50,
      avatar: 'string',
      nameUser: 'người dùng 1'
    },
    {
      title: 'Bộ thẻ 1',
      numberTerms: 50,
      avatar: 'string',
      nameUser: 'người dùng 1'
    },
    {
      title: 'Bộ thẻ 1',
      numberTerms: 50,
      avatar: 'string',
      nameUser: 'người dùng 1'
    }
  ])
  return (
    <div className='md:px-25 px-5'>
      {/* Gần đây */}
      <div className='mt-5'>
        <p className='font-bold text-gray-500 text-lg'>Gần đây</p>
        {/* items */}
        <div className='grid grid-cols-2 max-md:grid-cols-1 gap-2'>
          {/* item */}
          <div className='flex gap-1 items-center hover:bg-blue-50 p-2 rounded-md'>
            <div className='p-2 bg-blue-50 rounded-md inline-block'>
              <DocumentIcon className='size-6 text-blue-500 ' />
            </div>
            <div className=''>
              <p className='text-[0.94rem] font-[600] text-gray-700'>Học phần 1</p>
              <p className='text-gray-400 text-sm font-[550]'>{`Học phần • 15 thuật ngữ • Tác giả: Tác giả 1 `}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Bộ thẻ phổ biến */}
      <div className='mt-10'>
        <p className='font-bold text-gray-500 text-lg'>Bộ thẻ ghi nhớ phổ biến</p>
        {/* items */}
        <div className='grid grid-cols-3 gap-5 mb-10 max-md:grid-cols-2 max-sm:grid-cols-1'>
          {/* item */}
          {ListItemPopular &&
            ListItemPopular.map((item, index) => {
              return (
                <ListItem key={index} navigatevalue={'/learn-lesson'}>
                  {' '}
                  <div className='flex flex-col gap-5 items-start' >
                    <p className='text-lg font-bold text-gray-600'>{item.title}</p>
                    <p className='text-sm rounded-2xl bg-gray-200 text-gray-600 inline-block px-2 py-1 font-sans font-semibold'>
                      {item.numberTerms} thuật ngữ
                    </p>
                  </div>
                  <div className='flex gap-2 items-center mt-5'>
                    <img src={logo} alt='logo' className='size-10' />
                    <p className='text-sm text-gray-600 inline-block font-sans font-semibold'>{item.nameUser}</p>
                  </div>
                </ListItem>
              )
            })}
        </div>
      </div>
      {/* Tác giả hàng đầu */}
      <div className='mt-10'>
        <p className='font-bold text-gray-500 text-lg'>Tác giả hàng đầu</p>
        {/* items */}
        <div className='grid grid-cols-3 gap-5 mb-10 max-md:grid-cols-2 max-sm:grid-cols-1 '>
          {/* item */}
                <ListItem >
                  {' '}
                  
                  <img src={logo} alt='logo' className='size-10' />
                  <div className="mt-7 flex flex-col gap-3">
                    <p className='font-bold text-xl'>Tác giả 10</p>
                    <div className="flex gap-1 items-center bg-gray-200 rounded-xl w-fit px-2 py-1">
                      <DocumentIcon className='size-4 text-gray-600 ' />
                      <span className='text-xs font-bold text-gray-600'>444 học phần</span>
                    </div>
                  </div>
                </ListItem>
        </div>
      </div>
    </div>
  )
}
export default HomeUserPage
