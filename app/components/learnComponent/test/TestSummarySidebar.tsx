import React from 'react'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import type { UserAnswer } from '~/features/test/types'

// TestSummarySidebar: Sidebar liệt kê nhanh trạng thái từng câu hỏi sau khi làm
// - Mỗi item có icon đúng/sai và cho phép scroll tới vị trí câu

interface Props {
  open: boolean
  onClose: () => void
  userAnswers: UserAnswer[]
}

const TestSummarySidebar: React.FC<Props> = ({ open, onClose, userAnswers }) => {
  return (
    <>
      {!open && (
        <button
          className='fixed top-20 left-5 z-40 border-[1px] border-gray-200 bg-white p-2 rounded-3xl hover:bg-gray-100 transition-colors cursor-pointer'
          onClick={onClose}
        >
          {/* Icon toggled outside by caller if needed */}
          <span className='sr-only'>Open summary</span>
        </button>
      )}
      <div
        className={`fixed top-20 left-5 w-60 bg-white z-40 p-4 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between'>
          <h2 className='font-semibold text-gray-500'>Danh sách câu hỏi</h2>
          <div className='hover:bg-gray-100 rounded-4xl p-1 cursor-pointer' onClick={onClose}>
            <XMarkIcon className='w-6 h-6' />
          </div>
        </div>
        <div className='mt-5 flex flex-col gap-1 overflow-y-auto max-h-145 scrollbar-none '>
          {userAnswers.map((q, idx) => (
            <button
              key={`${q.mode}-${q.id}`}
              onClick={() => {
                if (q.refDivMain && 'scrollIntoView' in q.refDivMain) {
                  q.refDivMain.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }}
              type='button'
              className='w-full flex items-center gap-1 p-2 rounded-md text-left hover:bg-gray-100 transition-colors'
            >
              {q.isCorrect ? (
                <CheckIcon className='size-6 text-green-500' />
              ) : (
                <XMarkIcon className='size-6 text-red-500' />
              )}
              <span className='text-[16px] text-gray-700'>{idx + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default TestSummarySidebar
