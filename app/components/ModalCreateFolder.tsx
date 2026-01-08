import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { FolderIcon } from '@heroicons/react/24/outline'
import { useCreateFolder } from '~/features/library/useCreateFolder'

interface ModalCreateFolderProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export default function ModalCreateFolder({ isOpen, setIsOpen }: ModalCreateFolderProps) {
  const { isCreating, createFolder } = useCreateFolder()
  const [folderName, setFolderName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input khi mở modal
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Xử lý tạo thư mục
  const handleCreateFolder = async () => {
    const result = await createFolder(folderName)
    if (result) {
      setFolderName('')
      setIsOpen(false)
    }
  }

  // Xử lý Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating && folderName.trim()) {
      handleCreateFolder()
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-100' onClose={() => setIsOpen(false)}>
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
              <div className='flex flex-col items-center space-y-4'>
                {/* Icon folder – viền dày hơn */}
                <FolderIcon className='h-12 w-12 stroke-[2.5] text-gray-700' />

                <DialogTitle className='text-lg font-semibold text-gray-800'>Tên thư mục</DialogTitle>

                <input
                  ref={inputRef}
                  type='text'
                  placeholder='Nhập tên thư mục'
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isCreating}
                  className='w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50'
                />

                <div className='flex justify-end space-x-3 w-full mt-2'>
                  <button
                    className='px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-50'
                    onClick={() => setIsOpen(false)}
                    disabled={isCreating}
                  >
                    Hủy
                  </button>
                  <button
                    className='px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                    onClick={handleCreateFolder}
                    disabled={isCreating || !folderName.trim()}
                  >
                    {isCreating ? 'Đang tạo...' : 'Tạo '}
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}
