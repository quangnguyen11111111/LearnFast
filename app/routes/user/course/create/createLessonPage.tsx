import { Cog8ToothIcon, TrashIcon, SparklesIcon, GlobeAltIcon, LockClosedIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '~/components/button/Button'
import IconButton from '~/components/button/ButtonIcon'
import { AIModal, LessonItem, LanguageSelector } from '~/components/createLesson'
import { useCreateLesson } from '~/features/createLesson'
import Input from '~/components/input/Input'
import TextArea from '~/components/input/TextArea'
import trueFalseScrollY from '~/utils/trueFalseScrollY'

/* ------------------ CreateLessonPage ------------------ */
const CreateLessonPage = () => {
  const isScrolled = trueFalseScrollY(50)

  const {
    // State
    title,
    description,
    isLoading,
    isAIGenerating,
    isAIModalOpen,
    globalSourceLang,
    globalTargetLang,
    visibility,
    lessonItems,
    // Actions
    setTitle,
    setDescription,
    setIsAIModalOpen,
    setGlobalSourceLang,
    setGlobalTargetLang,
    setVisibility,
    handleItemChange,
    handleAddItem,
    handleDeleteItem,
    handleAIGenerate,
    handleCreateLesson
  } = useCreateLesson()

  return (
    <div className='h-full max-2xl:px-10 pb-10 '>
      {/* AI Generating Overlay */}
      {isAIGenerating && (
        <div className='fixed inset-0 z-[200] flex items-center justify-center bg-black/50'>
          <div className='bg-white rounded-2xl p-8 flex flex-col items-center gap-4'>
            <div className='animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent'></div>
            <p className='text-lg font-semibold'>Đang tạo flashcards bằng AI...</p>
            <p className='text-sm text-gray-500'>Vui lòng đợi trong giây lát</p>
          </div>
        </div>
      )}

      {/* AI Modal */}
      <AnimatePresence>
        {isAIModalOpen && (
          <AIModal 
            isOpen={isAIModalOpen} 
            isLoading={isAIGenerating}
            onClose={() => setIsAIModalOpen(false)} 
            onGenerate={handleAIGenerate} 
          />
        )}
      </AnimatePresence>
      {/* header */}
      <div className='sticky top-0 z-100 bg-background'>
        <div className='flex items-center justify-between container w-full 2xl:w-[80rem] mx-auto py-2'>
          <p className='text-3xl font-bold my-5'>Tạo bài học mới</p>
          <div className='flex gap-3'>
            <Button 
              variant='secondary' 
              className='px-3 py-2 font-bold' 
              rounded='rounded-2xl'
              onClick={() => handleCreateLesson(false)}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tạo...' : 'Tạo'}
            </Button>
            <Button 
              variant='primary' 
              className='px-3 py-2 font-bold' 
              rounded='rounded-2xl'
              onClick={() => handleCreateLesson(true)}
              disabled={isLoading}
            >
              {isLoading ? 'Đang tạo...' : 'Tạo và ôn luyện'}
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
            <Button
              variant='secondary'
              className='px-3 py-2 font-bold flex items-center gap-2'
              rounded='rounded-2xl'
              onClick={() => setIsAIModalOpen(true)}
            >
              <SparklesIcon className='size-5' />
              Sử dụng AI
            </Button>
            
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
            <IconButton icon={Cog8ToothIcon} onClick={() => {}} />
            <IconButton icon={TrashIcon} onClick={() => {}} />
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
      {/* button add */}
      <div className='flex gap-3 justify-end container w-full 2xl:w-[80rem] mx-auto mt-5'>
        <Button 
          variant='secondary' 
          className='px-6 py-4 font-bold' 
          rounded='rounded-3xl'
          onClick={() => handleCreateLesson(false)}
          disabled={isLoading}
        >
          {isLoading ? 'Đang tạo...' : 'Tạo'}
        </Button>
        <Button 
          variant='primary' 
          className='px-6 py-4 font-bold' 
          rounded='rounded-3xl'
          onClick={() => handleCreateLesson(true)}
          disabled={isLoading}
        >
          {isLoading ? 'Đang tạo...' : 'Tạo và ôn luyện'}
        </Button>
      </div>
    </div>
  )
}

export default CreateLessonPage
