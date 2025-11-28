import React, { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getButtonStyle, getFeedbackClass, getFeedbackText } from '~/utils/testFeedback'
import type { UserAnswer } from '~/features/test/types'

interface Props {
  id: string
  source: string
  displayTarget: string
  correctFlag: boolean
  correctTarget?: string
  indexNumberNow: number
  total: number
  isEndTest: boolean
  userAnswer?: UserAnswer
  selected: boolean | undefined
  onSelect: (choice: boolean) => void
}

const TrueFalseQuestion = forwardRef<HTMLDivElement, Props>(
  (
    {
      id,
      source,
      displayTarget,
      correctFlag,
      correctTarget,
      indexNumberNow,
      total,
      isEndTest,
      userAnswer,
      selected,
      onSelect
    },
    ref
  ) => {
    return (
      <div ref={ref} className='relative w-full shadow-lg border-t-3 border-gray-100 rounded-2xl py-8 px-8 min-h-120 flex flex-col justify-between '>
        <div className='text-gray-400 text-sm absolute right-6 top-6'>
          {indexNumberNow}/{total}
        </div>
        <div className='grid grid-cols-2 items-start justify-items-start flex-1 '>
          <div className='px-3'>
            <p className='font-semibold text-gray-500 text-sm mb-10'>Thuật ngữ</p>
            <p className='text-xl'>{source}</p>
          </div>
          <div className='border-s-2 border-gray-200 h-full px-3'>
            <p className='font-semibold text-gray-500 text-sm mb-10'>Định nghĩa</p>
            <p className='text-xl'>{displayTarget}</p>
          </div>
        </div>
        <div className='mt-5'>
          <p className={getFeedbackClass(isEndTest, userAnswer?.isCorrect)}>
            {getFeedbackText('trueFalse', isEndTest, userAnswer?.isCorrect, id)}
          </p>
          <div className='flex items-center justify-between gap-8 mt-5'>
            {['Đúng', 'Sai'].map((label) => {
              const userChoice = label === 'Đúng'
              const isSelected = selected === userChoice
              return (
                <button
                  key={label}
                  disabled={isEndTest}
                  onClick={() => onSelect(userChoice)}
                  className={getButtonStyle(isSelected, isEndTest, userAnswer?.isCorrect)}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <AnimatePresence>
            {correctFlag === false && isEndTest && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className='text-start'
              >
                <p className='mb-2 text-gray-500 font-semibold mt-5'>Định ngữ đúng</p>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                  className='text-gray-500 mt-4 text-lg'
                >
                  <div className='border-2 border-green-700 rounded-lg px-2 py-4 flex'>
                    <span>{correctTarget}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }
)

export default TrueFalseQuestion
