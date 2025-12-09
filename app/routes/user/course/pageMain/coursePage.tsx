import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { DocumentIcon, FolderIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { AnimatePresence,motion } from 'framer-motion'
import { Fragment,  useState } from 'react'
import { useNavigate, useParams } from 'react-router'

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
  const navigate=useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className='min-h-screen bg-gray-50 px-6 py-8 '>
      <div className='max-w-7xl mx-auto'>
        <div className='flex gap-3'>
          <FolderIcon className='size-10 text-gray-500 mb-4' />
          <h1 className='text-4xl font-bold text-gray-900 mb-2'>Thư mục {folderId}</h1>
          <span className='text-sm font-semibold text-gray-500 hover:text-gray-700 h-fit'>chỉnh sửa</span>
        </div>
        <div className="grid grid-cols-2 justify-between items-center mb-8 max-md:grid-cols-1 gap-4">
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
                        <div className="flex gap-1 items-center hover:bg-gray-200 cursor-pointer p-2 rounded-md mb-3" key={item.id}
                        onClick={()=>navigate(`/learn-lesson`)}
                        >
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
      {/* Button mở modal thêm học phần */}
           <AnimatePresence>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className='fixed bottom-0 left-0 w-full flex justify-center z-10'
            >
              <div className='flex items-center justify-center bg-white px-8 py-3 w-[90%] max-w-2xl'>
            
                <button
                  className='bg-blue-600 text-white font-semibold px-8 py-3 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition'
                  onClick={() => {
                    setIsModalOpen(true)
                  }}
                > 
                 <PlusIcon className='size-5 inline-block mr-2' />
                  Thêm học phần
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Giao diện modal */}
       <Transition show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
              {/* Nền mờ */}
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/40" />
              </TransitionChild>
      
              {/* Modal panel */}
              <div className="fixed inset-0 flex items-start justify-center p-4 pt-20">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <div className="flex flex-col items-start space-y-4">
                      
      
                      <DialogTitle className="text-2xl font-semibold text-gray-800">
                        Thêm tài liệu học
                      </DialogTitle>
      
                      <input
                        type="text"
                        placeholder="Enter folder name"
                        className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
      
                      <div className="flex justify-end space-x-3 w-full mt-2">
                        <button
                          className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Hoàn tất
                        </button>
                      </div>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </Dialog>
          </Transition>
    </div>
  )
}
export default CoursePage
