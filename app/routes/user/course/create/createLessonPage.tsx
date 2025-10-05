import { Cog8ToothIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Button from '~/components/Button'
import IconButton from '~/components/ButtonIcon'
import Input from '~/components/Input'
import TextArea from '~/components/TextArea'
import trueFalseScrollY from '~/utils/trueFalseScrollY'

/* ------------------ LessonItem ------------------ */
interface LessonItemProps {
  index: number
  source: string
  target: string
  onChange: (index: number, key: 'source' | 'target', value: string) => void
  onDelete: (index: number) => void
}

const LessonItem = ({ index, source, target, onChange, onDelete }: LessonItemProps) => {
  return (
    <div className='shadow bg-gray-100 rounded-md p-4 '>
      {/* top-item */}
      <div className='flex justify-between items-center'>
        <p>{index + 1}</p>
        <span
          onClick={() => onDelete(index)}
          className='border-gray-300 border rounded-4xl p-1 hover:bg-gray-200 cursor-pointer'
        >
          <TrashIcon className='size-5' />
        </span>
      </div>

      {/* main-item */}
      <div className='grid grid-cols-2 gap-5 mt-3'>
        {/* source */}
        <div>
          <TextArea setValueInput={(value) => onChange(index, 'source', value)} valueInput={source} rows={1} />
          <p className='text-gray-400 uppercase text-sm font-semibold'>Thuật Ngữ</p>
        </div>

        {/* target + image */}
        <div className='grid grid-cols-[1fr_auto] gap-5'>
          <div>
            <TextArea setValueInput={(value) => onChange(index, 'target', value)} valueInput={target} rows={1} />
            <p className='text-gray-400 uppercase text-sm font-semibold'>Định nghĩa</p>
          </div>

          <div className='flex flex-col items-center border-dashed border-gray-300 border-2 rounded-xl justify-center h-17 px-4 cursor-pointer hover:bg-gray-50'>
            <PhotoIcon className='size-6' />
            <span className='text-[12px] font-semibold'>Hình ảnh</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------ CreateLessonPage ------------------ */
const CreateLessonPage = () => {
  const isScrolled = trueFalseScrollY(50)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [removingIndex, setRemovingIndex] = useState<number | null>(null)
  const arr = [1, 2, 3, 4, 5, 6]
  const [lessonItems, setLessonItems] = useState<{ source: string; target: string; index: number }[]>([
    { source: '', target: '', index: 1 },
    { source: '', target: '', index: 2 }
  ])

  // update field of one item
  const handleItemChange = (index: number, key: 'source' | 'target', value: string) => {
    setLessonItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  }

  // add new item
  const handleAddItem = () => {
    setLessonItems((prev) => [
      ...prev,
      { source: '', target: '', index: prev.length > 0 ? prev[prev.length - 1].index + 1 : 1 }
    ])
  }

  // delete one item
  const handleDeleteItem = (index: number) => {
    if (lessonItems.length <= 2) {
      alert('Tối thiểu phải có 2 thẻ')
      return
    }
    setLessonItems((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className='h-full max-2xl:px-10 pb-10 '>
      {/* header */}
      <div className='sticky top-0 z-100 bg-background'>
        <div className='flex items-center justify-between container w-full 2xl:w-[80rem] mx-auto py-2'>
          <p className='text-3xl font-bold my-5'>Tạo bài học mới</p>
          <div className='flex gap-3'>
            <Button variant='secondary' className='px-3 py-2 font-bold' rounded='rounded-2xl '>
              Tạo
            </Button>
            <Button variant='primary' className='px-3 py-2 font-bold ' rounded='rounded-2xl '>
              Tạo và ôn luyện
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
            <Button variant='secondary' className='px-3 py-2 font-bold' rounded='rounded-2xl ' onClick={handleAddItem}>
              + Nhập
            </Button>
            <Button variant='secondary' className='px-3 py-2 font-bold' rounded='rounded-2xl '>
              + Thêm sơ đồ
            </Button>
          </div>
          <div className='flex gap-3'>
            <IconButton icon={Cog8ToothIcon} onClick={() => {}} />
            <IconButton icon={TrashIcon} onClick={() => {}} />
          </div>
        </div>

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
                className='w-full'
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
      {/* button add */}
      <div className='flex gap-3 justify-end container w-full 2xl:w-[80rem] mx-auto mt-5'>
        <Button variant='secondary' className='px-6 py-4 font-bold' rounded='rounded-3xl '>
          Tạo
        </Button>
        <Button variant='primary' className='px-6 py-4 font-bold ' rounded='rounded-3xl '>
          Tạo và ôn luyện
        </Button>
      </div>
    </div>
  )
}

export default CreateLessonPage
