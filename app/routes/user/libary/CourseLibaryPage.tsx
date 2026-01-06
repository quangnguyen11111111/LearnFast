import { PlusIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import ModalCreateFolder from '~/components/ModalCreateFolder'
import { FolderIcon } from '@heroicons/react/24/outline'
import { useUserFolders } from '~/features/library/useFolders'

const CourseLibaryPage = () => {
  const navigate = useNavigate()
  const { folders, isLoading, hasMore, loadMore } = useUserFolders()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, hasMore])

  return (
    <div className='flex flex-col gap-5'>
      {isLoading && folders.length === 0 && (
        <div className='space-y-3'>
          {[1, 2, 3].map((item) => (
            <div key={item} className='bg-white border border-gray-200 rounded-xl p-4 animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-1/5 mb-3'></div>
              <div className='h-6 bg-gray-200 rounded w-1/2'></div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && folders.length === 0 && <div className='text-center text-gray-500 py-10'>Chưa có thư mục nào</div>}

      {folders.map((item) => (
        <div
          onClick={() => navigate(`/course/${item.folderID}`, { state: { folderName: item.folderName } })}
          className='flex flex-col bg-white px-3 py-4 border border-gray-200 rounded-xl hover:shadow-lg cursor-pointer transition'
          key={item.folderID}
        >
          <p className='text-sm font-semibold text-gray-700'>{item.totalTerms ?? 0} mục</p>
          <div className='flex gap-3 items-center mt-2'>
            <FolderIcon className='w-6 h-6 text-gray-400' />
            <p className='text-lg font-bold'>{item.folderName}</p>
          </div>
        </div>
      ))}

      {hasMore && (
        <div ref={loadMoreRef} className='h-14 flex items-center justify-center'>
          {isLoading && folders.length > 0 && (
            <div className='flex items-center gap-3 text-gray-500'>
              <div className='w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
              <span>Đang tải thêm...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && folders.length > 0 && (
        <div className='py-4 text-center text-gray-400 text-sm'>Đã hiển thị tất cả thư mục</div>
      )}

      {/* Button tạo thư mục mới */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='fixed bottom-0 left-0 w-full flex justify-center z-10'
        >
          <div className='flex items-center justify-center bg-transparent px-8 py-3 w-[90%] max-w-2xl'>
            <button
              className='bg-blue-600 text-white font-semibold px-8 py-3 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition'
              onClick={() => setIsModalOpen(true)}
            >
              <PlusIcon className='size-5 inline-block mr-2' />
              Tạo thư mục
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modal tạo thư mục */}
      <ModalCreateFolder isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  )
}

export default CourseLibaryPage

// // tiêu đề gia diẹnn: Thư viện - Thẻ ghi nhớ
export const meta = () => [{ title: 'Thư viện - Thư mục' }]