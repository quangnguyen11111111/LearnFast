import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import {
  DocumentIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CheckCircleIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import { toggle } from '~/features/actionPage/toggleSlice'
import { useFolderFiles } from '~/features/library/useFolderFiles'
import { useFolderManagement } from '~/features/library/useFolderManagement'
import { useUserFiles } from '~/features/library/useUserFiles'
import { useAppDispatch, useAppSelector } from '~/store/hook'

const CoursePage = () => {
  const { folderId } = useParams()
  const navigate = useNavigate()
  const inputEditRef = useRef<HTMLInputElement>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [addingFileId, setAddingFileId] = useState<string | null>(null) // File đang được thêm
  const [removeConfirmFileId, setRemoveConfirmFileId] = useState<string | null>(null) // File cần xác nhận xóa
  const [removeFileName, setRemoveFileName] = useState<string>('') // Tên file cần xóa (để hiện trong dialog)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false) // Dialog xác nhận xóa thư mục
  const modalLoadMoreRef = useRef<HTMLDivElement | null>(null)
  const modalObserverRef = useRef<IntersectionObserver | null>(null)
  const toggleValue = useAppSelector((state) => state.toggle.actionUserPage)
  const dispatch = useAppDispatch()
  // Quản lý files trong thư mục
  const {
    files,
    isLoading,
    canLoadMore,
    loadMore,
    addFileToFolder,
    removeFileFromFolder,
    existingFileIds,
    isRemovingFileId
  } = useFolderFiles({
    folderID: folderId
  })

  // Danh sách file để thêm vào thư mục (modal) - filter mặc định gần đây
  const {
    files: modalFiles,
    isLoading: isModalLoading,
    hasMore: modalHasMore,
    loadMore: modalLoadMore,
    filterType: modalFilterType,
    setFilterType: setModalFilterType
  } = useUserFiles('recent')

  // Quản lý thông tin và chỉnh sửa thư mục
  const {
    folderName,
    isEditModalOpen,
    setIsEditModalOpen,
    newFolderName,
    setNewFolderName,
    isUpdating,
    handleUpdateFolderName,
    openEditModal,
    deleteFolder,
    isDeleting
  } = useFolderManagement({ folderID: folderId })

  // Tự động focus vào input khi mở modal chỉnh sửa
  useEffect(() => {
    if (isEditModalOpen && inputEditRef.current) {
      inputEditRef.current.focus()
    }
  }, [isEditModalOpen])

  // Cập nhật tiêu đề trang theo folderName
  useEffect(() => {
    if (folderName) {
      document.title = `${folderName} - LearnFast`
    }
  }, [folderName])

  // Infinite scroll inside modal
  useEffect(() => {
    if (!isModalOpen) return

    if (modalObserverRef.current) {
      modalObserverRef.current.disconnect()
    }

    modalObserverRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting && modalHasMore) {
          modalLoadMore()
        }
      },
      { threshold: 0.1, rootMargin: '120px' }
    )

    if (modalLoadMoreRef.current) {
      modalObserverRef.current.observe(modalLoadMoreRef.current)
    }

    return () => {
      modalObserverRef.current?.disconnect()
    }
  }, [isModalOpen, modalHasMore, modalLoadMore])

  return (
    <div className='min-h-screen bg-gray-50 px-6 py-8 '>
      <div className='max-w-7xl mx-auto'>
        <div className='flex gap-3 items-center'>
          <FolderIcon className='size-10 text-gray-500 mb-4' />
          <h1 className='text-4xl font-bold text-gray-900 mb-2 line-clamp-2 '>{folderName}</h1>
          <button
            onClick={openEditModal}
            className='text-sm font-semibold text-gray-500 hover:text-gray-700 h-fit cursor-pointer'
          >
            chỉnh sửa
          </button>
          <button
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={isDeleting}
            className='text-sm font-semibold text-red-500 hover:text-red-700 h-fit cursor-pointer disabled:opacity-50'
            title='Xóa thư mục'
          >
            {isDeleting ? 'Đang xóa...' : 'xóa'}
          </button>
        </div>
        <div className='grid grid-cols-2 justify-between items-center mb-8 max-md:grid-cols-1 gap-4'>
          <p className='text-gray-500 font-semibold'>Các mục trong {folderName}</p>
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
        <div className=''>
          {/* Course List */}
          {isLoading && (!files || files.length === 0) && (
            <div className='space-y-3'>
              {[1, 2, 3].map((item) => (
                <div key={item} className='h-14 bg-white border border-gray-200 rounded-md animate-pulse'></div>
              ))}
            </div>
          )}

          {!isLoading && files && files.length === 0 && (
            <p className='text-gray-500 text-sm'>Chưa có học phần trong thư mục này.</p>
          )}

          {files &&
            files
              .filter((item) => item.fileName.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => {
                const isDeleting = isRemovingFileId === item.fileID
                return (
                  <div
                    className='flex gap-1 items-center justify-between hover:bg-gray-200 p-2 rounded-md mb-3 group'
                    key={item.fileID}
                  >
                    <div
                      className='flex gap-1 items-center flex-1 cursor-pointer'
                      onClick={() => {
                        navigate(`/learn-lesson?fileId=${item.fileID}`)

                        if (toggleValue) {
                          dispatch(toggle())
                        }
                      }}
                    >
                      <DocumentIcon className='size-7 text-blue-500 ' />
                      <div className=''>
                        <p className='text-[0.94rem] font-[600] text-gray-800'>{item.fileName}</p>
                        <p className='text-gray-600 text-sm font-[550]'>{`Học phần • ${item.totalWords} thuật ngữ`}</p>
                      </div>
                    </div>
                    {/* Nút xóa */}
                    <button
                      onClick={() => {
                        setRemoveConfirmFileId(item.fileID)
                        setRemoveFileName(item.fileName)
                      }}
                      disabled={isDeleting}
                      className='p-2 hover:bg-red-100 rounded-lg disabled:opacity-50 transition-colors'
                      title='Xóa khỏi thư mục'
                    >
                      {isDeleting ? (
                        <div className='w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin'></div>
                      ) : (
                        <MinusIcon className='size-5 text-red-500 hover:text-red-700' />
                      )}
                    </button>
                  </div>
                )
              })}

          {canLoadMore && (
            <button
              onClick={loadMore}
              className='w-full mt-2 text-blue-600 font-semibold text-sm hover:underline'
              disabled={isLoading}
            >
              {isLoading ? 'Đang tải...' : 'Tải thêm học phần'}
            </button>
          )}
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
          <div className='flex items-center justify-center bg-transparent px-8 py-3 w-[90%] max-w-2xl'>
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
        <Dialog as='div' className='relative z-50' onClose={() => setIsModalOpen(false)}>
          {/* Nền mờ */}
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/40' />
          </TransitionChild>

          {/* Modal panel */}
          <div className='fixed inset-0 flex items-center justify-center p-4'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-4xl rounded-2xl bg-white p-6 shadow-xl'>
                <div className='flex flex-col gap-4'>
                  <DialogTitle className='text-2xl font-semibold text-gray-900'>Thêm tài liệu học</DialogTitle>

                  {/* Tabs filter */}
                  <div className='flex gap-3 border-b border-gray-200 pb-3'>
                    {[
                      { key: 'recent', label: 'Gần đây' },
                      { key: 'created', label: 'Thư viện của bạn' }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setModalFilterType(tab.key as any)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                          modalFilterType === tab.key
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* File list */}
                  <div className='max-h-[60vh] overflow-y-auto pr-2 space-y-3'>
                    {isModalLoading && modalFiles.length === 0 && (
                      <div className='space-y-3'>
                        {[1, 2, 3].map((item) => (
                          <div key={item} className='h-14 bg-gray-100 rounded-md animate-pulse'></div>
                        ))}
                      </div>
                    )}

                    {!isModalLoading && modalFiles.length === 0 && (
                      <div className='text-gray-500 text-sm text-center py-4'>Chưa có tài liệu phù hợp</div>
                    )}

                    {modalFiles.map((file) => {
                      const isInFolder = existingFileIds.has(file.fileID) // File đã có trong thư mục
                      const isAdding = addingFileId === file.fileID // Đang thêm file này
                      const isRemoving = isRemovingFileId === file.fileID // Đang xóa file này
                      return (
                        <div
                          key={file.fileID}
                          className={`flex items-center justify-between border rounded-xl px-4 py-3 transition cursor-pointer ${
                            isInFolder ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                          } ${isAdding || isRemoving ? 'opacity-70 pointer-events-none' : ''}`}
                          onClick={async () => {
                            // Nếu đang thêm hoặc xóa thì không làm gì
                            if (isAdding || isRemoving) return

                            // Nếu file đã có trong thư mục → xóa
                            if (isInFolder) {
                              setAddingFileId(file.fileID) // Dùng cùng state để show loading
                              const result = await removeFileFromFolder(file.fileID)
                              setAddingFileId(null)

                              if (result.success) {
                                toast.success(`Đã xóa "${file.fileName}" khỏi thư mục`)
                              } else {
                                toast.error(result.message)
                              }
                              return
                            }

                            // Nếu file chưa có → thêm
                            setAddingFileId(file.fileID)
                            const result = await addFileToFolder(file.fileID)
                            setAddingFileId(null)

                            if (result.success) {
                              toast.success(`Đã thêm "${file.fileName}" vào thư mục`)
                            } else {
                              if (result.message.includes('đã có trong thư mục')) {
                                toast.info('File đã có trong thư mục')
                              } else {
                                toast.error(result.message)
                              }
                            }
                          }}
                        >
                          <div className='flex items-start gap-3'>
                            <DocumentIcon
                              className={`size-6 mt-1 ${isInFolder ? 'text-green-500' : 'text-blue-500'}`}
                            />
                            <div>
                              <p className='text-base font-semibold text-gray-900'>{file.fileName}</p>
                              <p className='text-sm text-gray-500'>
                                {file.totalWords} thuật ngữ • Tác giả: {file.ownerName || 'Bạn'}
                              </p>
                            </div>
                          </div>
                          {isAdding || isRemoving ? (
                            <div className='w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
                          ) : isInFolder ? (
                            <CheckCircleIcon className='size-6 text-green-600' />
                          ) : (
                            <div className='size-6 rounded-full border-2 border-gray-300 hover:border-blue-400 transition' />
                          )}
                        </div>
                      )
                    })}

                    {/* Infinite load trigger */}
                    {modalHasMore && (
                      <div ref={modalLoadMoreRef} className='h-12 flex items-center justify-center text-gray-500'>
                        {isModalLoading && modalFiles.length > 0 && (
                          <div className='flex items-center gap-2'>
                            <div className='w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
                            <span>Đang tải thêm...</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='flex justify-end gap-3 pt-2'>
                    <button
                      className='px-6 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium'
                      onClick={() => {
                        setIsModalOpen(false)
                      }}
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Dialog xác nhận xóa file */}
      <Transition show={removeConfirmFileId !== null} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={() => setRemoveConfirmFileId(null)}>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/40' />
          </TransitionChild>

          <div className='fixed inset-0 flex items-center justify-center p-4'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100'>
                      <MinusIcon className='h-6 w-6 text-red-600' />
                    </div>
                    <div>
                      <DialogTitle className='text-lg font-semibold text-gray-900'>Xóa khỏi thư mục?</DialogTitle>
                      <p className='mt-2 text-sm text-gray-600'>
                        Bạn có chắc chắn muốn xóa <span className='font-semibold'>"{removeFileName}"</span> khỏi thư mục
                        này? Dữ liệu sẽ không bị mất, chỉ loại bỏ khỏi thư mục.
                      </p>
                    </div>
                  </div>

                  <div className='flex justify-end gap-3 pt-2'>
                    <button
                      className='px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-medium'
                      onClick={() => setRemoveConfirmFileId(null)}
                      disabled={isRemovingFileId !== null}
                    >
                      Hủy
                    </button>
                    <button
                      className='px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 font-medium'
                      onClick={async () => {
                        if (!removeConfirmFileId) return
                        const result = await removeFileFromFolder(removeConfirmFileId)
                        if (result.success) {
                          toast.success(`Đã xóa "${removeFileName}" khỏi thư mục`)
                          setRemoveConfirmFileId(null)
                        } else {
                          toast.error(result.message)
                        }
                      }}
                      disabled={isRemovingFileId !== null}
                    >
                      {isRemovingFileId ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Dialog xác nhận xóa thư mục */}
      <Transition show={deleteConfirmOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={() => setDeleteConfirmOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/40' />
          </TransitionChild>

          <div className='fixed inset-0 flex items-center justify-center p-4'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100'>
                      <FolderIcon className='h-6 w-6 text-red-600' />
                    </div>
                    <div>
                      <DialogTitle className='text-lg font-semibold text-gray-900'>Xóa thư mục?</DialogTitle>
                      <p className='mt-2 text-sm text-gray-600'>
                        Bạn có chắc chắn muốn xóa thư mục <span className='font-semibold'>"{folderName}"</span>? Tất cả
                        dữ liệu trong thư mục sẽ bị xóa vĩnh viễn.
                      </p>
                    </div>
                  </div>

                  <div className='flex justify-end gap-3 pt-2'>
                    <button
                      className='px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-medium'
                      onClick={() => setDeleteConfirmOpen(false)}
                      disabled={isDeleting}
                    >
                      Hủy
                    </button>
                    <button
                      className='px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 font-medium'
                      onClick={async () => {
                        const result = await deleteFolder()
                        if (result.success) {
                          toast.success('Xóa thư mục thành công')
                          // Navigate về trang danh sách thư mục
                          setTimeout(() => {
                            navigate('/libary/course')
                          }, 500)
                        } else {
                          toast.error(result.message)
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

      {/* Modal chỉnh sửa tên thư mục */}
      <Transition show={isEditModalOpen} as={Fragment}>
        <Dialog as='div' className='relative z-50' onClose={() => setIsEditModalOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/40' />
          </TransitionChild>

          <div className='fixed inset-0 flex items-start justify-center p-4 pt-20'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                <div className='flex flex-col items-start space-y-4'>
                  <FolderIcon className='h-12 w-12 stroke-[2.5] text-gray-700' />
                  <DialogTitle className='text-2xl font-semibold text-gray-800'>Chỉnh sửa tên thư mục</DialogTitle>

                  <input
                    ref={inputEditRef}
                    type='text'
                    placeholder='Nhập tên thư mục'
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isUpdating && newFolderName.trim()) {
                        handleUpdateFolderName()
                      }
                    }}
                    autoFocus
                    className='w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />

                  <div className='flex justify-end space-x-3 w-full mt-2'>
                    <button
                      className='px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100'
                      onClick={() => setIsEditModalOpen(false)}
                      disabled={isUpdating}
                    >
                      Hủy
                    </button>
                    <button
                      className='px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                      onClick={handleUpdateFolderName}
                      disabled={isUpdating || !newFolderName.trim()}
                    >
                      {isUpdating ? 'Đang lưu...' : 'Lưu'}
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
