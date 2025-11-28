import React, { forwardRef } from 'react'
import { getButtonStyle, getFeedbackClass, getFeedbackText } from '~/utils/testFeedback'
import type { UserAnswer } from '~/features/test/types'

// MultipleChoiceQuestion: Component câu hỏi trắc nghiệm 4 lựa chọn
// - options: danh sách đáp án hiển thị (đã trộn)
// - correctSource: đáp án đúng để đánh dấu màu sắc khi kết thúc
// - selected: giá trị người dùng đã chọn (highlight)

interface Props {
  id: string
  target: string
  options: string[]
  correctSource: string
  indexNumberNow: number
  total: number
  isEndTest: boolean
  userAnswer?: UserAnswer
  selected: string | boolean | undefined
  onSelect: (choice: string) => void
}

const MultipleChoiceQuestion = forwardRef<HTMLDivElement, Props>(
  ({ id, target, options, correctSource, indexNumberNow, total, isEndTest, userAnswer, selected, onSelect }, ref) => {
    return (
      <div
        ref={ref}
        className='relative w-full shadow-lg border-t-3 border-gray-100 rounded-2xl py-7 px-8 min-h-120 flex flex-col justify-between '
      >
        <div className='text-gray-400 text-sm absolute right-6 top-6'>
          {indexNumberNow}/{total}
        </div>
        <div>
          <p className='font-semibold text-gray-500 text-sm mb-10'>Định nghĩa</p>
          <p className='text-xl'>{target}</p>
        </div>
        <div className='mt-5'>
          <p className={getFeedbackClass(isEndTest, userAnswer?.isCorrect)}>
            {getFeedbackText('multiple', isEndTest, userAnswer?.isCorrect, id)}
          </p>
          <div className='grid grid-cols-2 gap-5 mt-5'>
            {options.map((v, i) => {
              const isSelected = selected === v
              return (
                <button
                  key={`${id}-${i}`}
                  disabled={isEndTest}
                  onClick={() => onSelect(v)}
                  className={getButtonStyle(isSelected, isEndTest, userAnswer?.isCorrect, v === correctSource)}
                >
                  {v}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

export default MultipleChoiceQuestion
