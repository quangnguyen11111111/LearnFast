import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { toast } from 'react-toastify'
import Button from '~/components/button/Button'
import { LANGUAGES } from './constants'

/* ------------------ AI Modal ------------------ */
export interface AIModalProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  onGenerate: (data: { topic: string; count: number; sourceLang: string; targetLang: string }) => void
}

const AIModal = ({ isOpen, isLoading = false, onClose, onGenerate }: AIModalProps) => {
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(10)
  const [sourceLang, setSourceLang] = useState('english')
  const [targetLang, setTargetLang] = useState('vietnam')

  const handleSubmit = () => {
    if (!topic.trim()) {
      toast.error('Vui lòng nhập chủ đề')
      return
    }
    if (count < 1 || count > 50) {
      toast.error('Số câu phải từ 1 đến 50')
      return
    }
    onGenerate({ topic, count, sourceLang, targetLang })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-[200] flex items-center justify-center'>
      {/* Overlay */}
      <div className='absolute inset-0 bg-black/50' onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className='relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4 z-10'
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <SparklesIcon className='size-6 text-primary' />
            <h2 className='text-xl font-bold'>Tạo bằng AI</h2>
          </div>
          <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded-full transition-colors'>
            <XMarkIcon className='size-6' />
          </button>
        </div>

        {/* Form */}
        <div className='flex flex-col gap-4'>
          {/* Topic */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Chủ đề</label>
            <input
              type='text'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder='Ví dụ: fruits, animals, colors...'
              className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          {/* Count */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Số câu</label>
            <input
              type='number'
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              onFocus={(e) => e.target.select()}
              min={1}
              max={50}
              className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
            />
          </div>

          {/* Source Language */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Ngôn ngữ nguồn</label>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white'
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Language */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Ngôn ngữ đích</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white'
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-3 mt-6'>
          <Button
            variant='secondary'
            className='flex-1 px-4 py-2 font-semibold'
            rounded='rounded-xl'
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            variant='primary'
            className='flex-1 px-4 py-2 font-semibold'
            rounded='rounded-xl'
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Đang tạo...' : 'Tạo'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default AIModal
