import { DocumentIcon, FolderIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useParams } from 'react-router'

const CoursePage = () => {
  const { folderId } = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const courses = [
    {
      id: '1',
      title: 'ffd',
      terms: 2,
      author: 'quizlette848489',
      avatar: '',
      isTeacher: false,
      date: '2 thuật ngữ',
      month: 'THÁNG 11 NĂM 2025'
    },
    {
      id: '2',
      title: 'ETS 2022 Part 1 Vocabulary #1',
      terms: 37,
      author: 'ETMinhVu',
      avatar: '',
      isTeacher: true,
      date: '37 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '3',
      title: 'ETS 2022 Part 1 Vocabulary #6',
      terms: 40,
      author: 'ETMinhVu',
      avatar: '',
      isTeacher: true,
      date: '40 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '4',
      title: 'ETS 2023 Part 1 Vocabulary #1',
      terms: 41,
      author: 'ETMinhVu',
      avatar: '',
      isTeacher: true,
      date: '41 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '5',
      title: 'ETS 2023 Part 1 Vocabulary #2',
      terms: 38,
      author: 'ETMinhVu',
      avatar: '',
      isTeacher: true,
      date: '38 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    }
  ]

  return (
    <div className='min-h-screen bg-gray-50 px-6 py-8 '>
      <div className='max-w-7xl mx-auto'>
        <div className='flex gap-3'>
          <FolderIcon className='size-10 text-gray-500 mb-4' />
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Thư mục {folderId}</h1>
          <span className='text-sm font-semibold text-gray-500 hover:text-gray-700 h-fit'>chỉnh sửa</span>
        </div>
        <div className="flex justify-between items-center mb-8">
            <p className='text-gray-500 font-semibold'>Các mục trong thư mục {folderId}</p>
        <div className='flex-1 max-w-xl'>
          <div className='relative'>
            <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400' />
            <input
              type='text'
              placeholder='Tìm kiếm thẻ ghi nhớ'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>
        </div>
        <div className="">
            {/* Course List */}
            {
                courses&&courses.map((item)=>{
                    return(
                        <div className="flex gap-1 items-center hover:bg-blue-50 p-2 rounded-md mb-3" key={item.id}>
                            <DocumentIcon className='size-7 text-blue-500 ' />
                            <div className="">
                                <p className='text-[0.94rem] font-[600] text-gray-700'>{item.title}</p>
                                <p className='text-gray-400 text-sm font-[550]'>{`Học phần • ${item.terms} thuật ngữ  `}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
      </div>
    </div>
  )
}
export default CoursePage
