import { Fragment, useState, useEffect } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { FolderIcon, FolderPlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { addFileToFolderThunk, removeFileFromFolderThunk, createFolderThunk } from '~/features/api/folder/folderThunk'
import type { IFolder } from '~/features/api/folder/folderThunk'
import { useFileInFolders } from '~/features/library/useFileInFolders'

interface ModalSaveToFolderProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  fileID: string
  fileName: string
}

export default function ModalSaveToFolder({ isOpen, setIsOpen, fileID, fileName }: ModalSaveToFolderProps) {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { folders, folderHasFile, isLoading: isLoadingFolders, refetch } = useFileInFolders(fileID, isOpen)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [processingFolderId, setProcessingFolderId] = useState<string | null>(null)

  // Thêm hoặc gỡ file khỏi thư mục khi click
  const handleToggleFolder = async (folder: IFolder) => {
    if (!user?.userID) {
      toast.info('Vui lòng đăng nhập để lưu vào thư mục')
      return
    }
    if (processingFolderId) return

    const current = folderHasFile[folder.folderID] === true
    setProcessingFolderId(folder.folderID)

    try {
      if (current) {
        await dispatch(
          removeFileFromFolderThunk({
            folderID: folder.folderID,
            userID: user.userID,
            fileID
          })
        ).unwrap()
        toast.success('Đã gỡ file khỏi thư mục')
        // Thông báo cho các thành phần khác cập nhật trạng thái lưu
        window.dispatchEvent(new CustomEvent('folderFileChanged', { detail: { fileID } }))
      } else {
        await dispatch(
          addFileToFolderThunk({
            folderID: folder.folderID,
            userID: user.userID,
            fileID
          })
        ).unwrap()
        toast.success('Đã lưu vào thư mục')
        // Thông báo cho các thành phần khác cập nhật trạng thái lưu
        window.dispatchEvent(new CustomEvent('folderFileChanged', { detail: { fileID } }))
      }
      // Refetch để cập nhật trạng thái
      await refetch()
    } catch (error: any) {
      const message = typeof error === 'string' ? error : 'Không thể cập nhật thư mục'
      toast.error(message)
    } finally {
      setProcessingFolderId(null)
    }
  }

  // Xử lý tạo thư mục mới
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !user?.userID) return

    setIsCreatingFolder(true)
    try {
      const result = await dispatch(
        createFolderThunk({
          folderName: newFolderName.trim(),
          userID: user.userID
        })
      ).unwrap()

      // Thêm thư mục mới vào danh sách
      const newFolder = result.data

      // Sau khi tạo, thêm luôn file vào thư mục mới
      await dispatch(
        addFileToFolderThunk({
          folderID: newFolder.folderID,
          userID: user.userID,
          fileID
        })
      ).unwrap()

      // Reset form
      setNewFolderName('')
      setShowCreateFolder(false)
      toast.success('Đã tạo thư mục và lưu file')

      // Thông báo cho các thành phần khác cập nhật trạng thái lưu
      window.dispatchEvent(new CustomEvent('folderFileChanged', { detail: { fileID } }))

      // Refetch để cập nhật danh sách
      await refetch()
    } catch (error: any) {
      const message = typeof error === 'string' ? error : 'Có lỗi xảy ra khi tạo thư mục'
      toast.error(message)
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setShowCreateFolder(false)
    setNewFolderName('')
    setProcessingFolderId(null)
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={handleClose}>
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
          <div className='fixed inset-0 bg-black/30' />
        </TransitionChild>

        {/* Modal content */}
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                {/* Header */}
                <div className='flex items-center justify-between mb-4'>
                  <DialogTitle as='h3' className='text-lg font-bold text-gray-900'>
                    Lưu vào thư mục
                  </DialogTitle>
                  <button onClick={handleClose} className='rounded-full p-1 hover:bg-gray-100 transition-colors'>
                    <XMarkIcon className='w-6 h-6 text-gray-500' />
                  </button>
                </div>

                {/* Button thêm thư mục */}
                {!showCreateFolder && (
                  <button
                    onClick={() => setShowCreateFolder(true)}
                    className='w-full flex items-center gap-2 p-3 mb-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all'
                  >
                    <FolderPlusIcon className='w-5 h-5 text-blue-500' />
                    <span className='font-medium text-gray-700'>Thêm thư mục mới</span>
                  </button>
                )}

                {/* Form tạo thư mục */}
                {showCreateFolder && (
                  <div className='mb-4 p-3 border border-blue-300 rounded-lg bg-blue-50'>
                    <input
                      type='text'
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder='Tên thư mục...'
                      className='w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newFolderName.trim()) {
                          handleCreateFolder()
                        }
                      }}
                    />
                    <div className='flex gap-2'>
                      <button
                        onClick={handleCreateFolder}
                        disabled={!newFolderName.trim() || isCreatingFolder}
                        className='flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                      >
                        {isCreatingFolder ? 'Đang tạo...' : 'Tạo'}
                      </button>
                      <button
                        onClick={() => {
                          setShowCreateFolder(false)
                          setNewFolderName('')
                        }}
                        className='px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium'
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                {/* Danh sách thư mục */}
                <div className='max-h-[400px] overflow-y-auto'>
                  {isLoadingFolders ? (
                    <div className='flex justify-center items-center py-8'>
                      <span className='text-gray-500'>Đang tải thư mục...</span>
                    </div>
                  ) : folders.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-8 text-gray-500'>
                      <FolderIcon className='w-12 h-12 mb-2 text-gray-300' />
                      <p>Chưa có thư mục nào</p>
                      <p className='text-sm'>Tạo thư mục mới để lưu file</p>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {folders.map((folder) => {
                        const isSelected = folderHasFile[folder.folderID] === true
                        const isProcessing = processingFolderId === folder.folderID
                        return (
                          <div
                            key={folder.folderID}
                            onClick={() => handleToggleFolder(folder)}
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                              isSelected ? 'bg-green-500 text-white' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                            } ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
                          >
                            <div
                              className={`w-5 h-5 flex items-center justify-center rounded border-2 ${
                                isSelected ? 'bg-white border-white' : 'border-gray-300'
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className='w-4 h-4 text-green-500'
                                  fill='none'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  viewBox='0 0 24 24'
                                  stroke='currentColor'
                                >
                                  <path d='M5 13l4 4L19 7'></path>
                                </svg>
                              )}
                            </div>
                            <FolderIcon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                            <span className='font-medium flex-1 line-clamp-2'>{folder.folderName}</span>
                            {folder.totalTerms !== undefined && (
                              <span className={`text-sm ${isSelected ? 'text-green-100' : 'text-gray-500'}`}>
                                {folder.totalTerms} học phần
                              </span>
                            )}
                            <span
                              className={`text-xs font-semibold ${isSelected ? 'text-green-100' : 'text-gray-400'}`}
                            >
                              {isSelected ? 'Đã lưu' : 'Chưa lưu'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
                {/* Footer - chỉ cần đóng */}
                <div className='mt-6 flex justify-end'>
                  <button
                    onClick={handleClose}
                    className='px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors'
                  >
                    Đóng
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
