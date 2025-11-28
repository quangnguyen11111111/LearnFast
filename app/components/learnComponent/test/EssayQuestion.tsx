import React, { forwardRef } from 'react'
import Button from '~/components/button/Button'
import { getFeedbackClass, getFeedbackText } from '~/utils/testFeedback'
import type { UserAnswer } from '~/features/test/types'

interface Props {
  id: string
  target: string
  indexNumberNow: number
  total: number
  isEndTest: boolean
  userAnswer?: UserAnswer
  inputRef: (el: HTMLInputElement | null) => void
  onEnter: (value: string) => void
  isLast: boolean
}

const EssayQuestion = forwardRef<HTMLDivElement, Props>(
  ({ id, target, indexNumberNow, total, isEndTest, userAnswer, inputRef, onEnter, isLast }, ref) => {
    return (
      <div ref={ref} className='relative w-full shadow-lg border-t-3 border-gray-100 rounded-2xl py-7 px-8 min-h-120 flex flex-col justify-between '>
        <div className='text-gray-400 text-sm absolute right-6 top-6'>
          {indexNumberNow}/{total}
        </div>
        <div>
          <p className='font-semibold text-gray-500 text-sm mb-10'>Định nghĩa</p>
          <p className='text-xl'>{target}</p>
        </div>
        <div className='mt-5 '>
          <p className={getFeedbackClass(isEndTest, userAnswer?.isCorrect)}>
            {getFeedbackText('essay', isEndTest, userAnswer?.isCorrect, id)}
          </p>
          <input
            type='text'
            disabled={isEndTest}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const val = e.currentTarget.value.trim()
                if (val !== '') onEnter(val)
              }
            }}
            placeholder='Nhập đáp án của bạn'
            className='w-full font-semibold bg-gray-100 rounded-md px-2 py-3 placeholder-gray-400 placeholder:font-semibold mt-5 focus:outline-blue-300 focus:bg-white border-none'
          />
          <div className={`flex justify-end ${isEndTest ? '' : 'mt-3'}`}>
            <Button className={`px-4 py-3 text-sm font-semibold ${isLast ? 'invisible' : ''} ${isEndTest ? 'invisible' : ''}`} onClick={() => {}} rounded='rounded-4xl'>
              Tiếp
            </Button>
          </div>
        </div>
      </div>
    )
  }
)

export default EssayQuestion
