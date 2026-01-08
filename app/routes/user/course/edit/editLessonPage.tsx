import {
  Cog8ToothIcon,
  TrashIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import Button from '~/components/button/Button'
import IconButton from '~/components/button/ButtonIcon'
import { LessonItem, LanguageSelector } from '~/components/createLesson'
import { useEditLesson } from '~/features/createLesson/useEditLesson'
import Input from '~/components/input/Input'
import TextArea from '~/components/input/TextArea'
import trueFalseScrollY from '~/utils/trueFalseScrollY'
import { deleteFileThunk } from '~/features/api/file/fileThunk'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import { useState } from 'react'

/* ------------------ EditLessonPage ------------------ */
const EditLessonPage = () => {
  const isScrolled = trueFalseScrollY(50)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [searchParams] = useSearchParams()
  const fileID = searchParams.get('fileId')
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const {
    // State
    title,
    description,
    isLoading,
    isLoadingInitial,
    globalSourceLang,
    globalTargetLang,
    visibility,
    lessonItems,
    // Actions
    setTitle,
    setDescription,
    setGlobalSourceLang,
    setGlobalTargetLang,
    setVisibility,
    handleItemChange,
    handleAddItem,
    handleDeleteItem,
    handleCreateLesson
  } = useEditLesson()

  const handleDeleteFile = () => {
    if (!user?.userID || !fileID || isDeleting) return
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!user?.userID || !fileID) return

    setIsDeleting(true)
    try {
      await dispatch(
        deleteFileThunk({
          fileID,
          creatorID: user.userID
        })
      ).unwrap()

      toast.success('Đã xóa bài học thành công')
      navigate('/latest', { replace: true })
    } catch (error: any) {
      toast.error(error || 'Không thể xóa bài học. Vui lòng thử lại!')
      setDeleteConfirmOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoadingInitial) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent'></div>
      </div>
    )
  }

  return (
    <div className='h-full max-2xl:px-10 pb-10 '>
      {/* header */}
      <div className='sticky top-0 z-100 bg-background'>
        <div className='flex items-center justify-between container w-full 2xl:w-[80rem] mx-auto py-2'>
          <p className='text-3xl font-bold my-5'>Chỉnh sửa bài học</p>
          <div className='flex gap-3'>
            <Button
              variant='primary'
              className='px-6 py-2 font-bold'
              rounded='rounded-2xl'
              onClick={() => handleCreateLesson()}
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : 'Hoàn tất'}
            </Button>
          </div>
        </div>
        <div className={`border-b border-1 w-full border-gray-400 ${isScrolled ? '' : 'hidden'}`} />
      </div>

      {/* content */}
      <div className='container w-full 2xl:w-[80rem] mx-auto '>
        {/* title + description */}
        <div className='flex flex-col gap-2 mt-5'>
          <Input
            title='Tiêu đề bài học'
            id='title'
            type='text'
            placeholder='Nhập tiêu đề, ví dụ Tiếng anh - Từ mới ngày 1'
            valueInput={title}
            setValueInput={setTitle}
          />
          <TextArea
            placeholder='Nhập mô tả cho bài học.......'
            valueInput={description}
            rows={2}
            setValueInput={setDescription}
          />
        </div>

        {/* add, delete, settings */}
        <div className='flex items-center justify-between mt-5 '>
          <div className='flex gap-3'>
            {/* Visibility Dropdown */}
            <div className='relative '>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
                className='appearance-none  px-4 py-2 pr-10 bg-gray-100 border border-gray-300 rounded-2xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent cursor-pointer hover:bg-gray-200 transition-colors'
              >
                <option value='public'>🌐 Công khai</option>
                <option value='private'>🔒 Riêng tư</option>
              </select>
              <ChevronDownIcon className='size-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500' />
            </div>
          </div>
          <div className='flex gap-3'>
            <IconButton icon={TrashIcon} onClick={handleDeleteFile} />
          </div>
        </div>

        {/* Language selectors for all items */}
        <LanguageSelector
          sourceLang={globalSourceLang}
          targetLang={globalTargetLang}
          onSourceLangChange={setGlobalSourceLang}
          onTargetLangChange={setGlobalTargetLang}
        />

        {/* lesson items */}
        <div className='mt-5 flex flex-col gap-4 items-center w-full  '>
          <AnimatePresence>
            {lessonItems.map((item, index) => (
              <motion.div
                key={item.index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className='w-full '
              >
                <LessonItem
                  index={index}
                  source={item.source}
                  target={item.target}
                  onChange={handleItemChange}
                  onDelete={handleDeleteItem}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            variant='secondary'
            className='px-4 py-3 w-fit font-bold mt-5 '
            onClick={handleAddItem}
            rounded='rounded-2xl'
          >
            {' '}
            Thêm thẻ
          </Button>
        </div>
      </div>
      {/* button save */}
      <div className='flex gap-3 justify-end container w-full 2xl:w-[80rem] mx-auto mt-5'>
        <Button
          variant='primary'
          className='px-6 py-4 font-bold'
          rounded='rounded-3xl'
          onClick={() => handleCreateLesson()}
          disabled={isLoading}
        >
          {isLoading ? 'Đang lưu...' : 'Hoàn tất'}
        </Button>
      </div>

      {/* Dialog xác nhận xóa bài học */}
      <Transition show={deleteConfirmOpen} as={Fragment}>
        <Dialog as='div' className='relative z-100' onClose={() => !isDeleting && setDeleteConfirmOpen(false)}>
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
                      <ExclamationTriangleIcon className='h-6 w-6 text-red-600' />
                    </div>
                    <div>
                      <DialogTitle className='text-lg font-semibold text-gray-900'>Xóa bài học?</DialogTitle>
                      <p className='mt-2 text-sm text-gray-600'>Bạn có chắc chắn muốn xóa bài học này?</p>
                      <div className='mt-3 space-y-1'>
                        <p className='text-sm text-red-700 font-medium'>❌ Dữ liệu sẽ bị xóa VĨNH VIỄN</p>
                        <p className='text-sm text-red-700 font-medium'>❌ Không thể khôi phục</p>
                        <p className='text-sm text-red-700 font-medium'>❌ Tất cả tiến trình học tập sẽ biến mất</p>
                      </div>
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
                      className='px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                      onClick={handleConfirmDelete}
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
    </div>
  )
}

export const meta = () => [{ title: 'Chỉnh sửa bài học - LearnFast' }]

export default EditLessonPage
