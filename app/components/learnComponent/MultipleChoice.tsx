import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface MultipleChoiseProps {
  indexMulti: number
  ORIGINAL_DATA: { id: string; source: string; target: string; status: number; statusMode: number }[]
  option: string[]
  handleNextQuestion: (isCorrect: boolean) => void
  isAnswered: boolean
  setIsAnswered: (value: boolean) => void
  isCorrect: boolean | null
  setIsCorrect: (value: boolean | null) => void
  selected: string | null
  setSelected: (value: string | null) => void
  showButtonNext?: boolean
}

const MultipleChoise = ({
  indexMulti,
  ORIGINAL_DATA,
  handleNextQuestion,
  option,
  isAnswered,
  isCorrect,
  selected,
  setIsAnswered,
  setIsCorrect,
  setSelected,
  showButtonNext
}: MultipleChoiseProps) => {
  const [isSkip, setIsSkip] = useState(false)
  const continueButtonRef = useRef<HTMLButtonElement>(null)
  const currentQuestion = ORIGINAL_DATA[indexMulti]

  // Auto focus vào nút tiếp tục khi xuất hiện
  useEffect(() => {
    if (isAnswered && !isCorrect && showButtonNext) {
      // Delay nhỏ để đợi animation hoàn thành
      const timer = setTimeout(() => {
        continueButtonRef.current?.focus()
      }, 450)
      return () => clearTimeout(timer)
    }
  }, [isAnswered, isCorrect, showButtonNext])

  if (!currentQuestion) return null

  const { source, target: correctAnswer } = currentQuestion

  // ------------------------------
  // Handlers
  // ------------------------------
  const resetState = () => {
    setSelected(null)
    setIsAnswered(false)
    setIsCorrect(null)
  }

  const handleSelect = (choice: string) => {
    if (isAnswered) return
    const skipped = choice === ''
    const correct = choice === correctAnswer

    setSelected(choice)
    setIsSkip(skipped)
    setIsAnswered(true)
    setIsCorrect(correct)

    if (correct) {
      setTimeout(() => {
        resetState()
        handleNextQuestion(true)
      }, 800)
    }
  }

  const handleContinue = () => {
    resetState()
    handleNextQuestion(false)
  }

  // ------------------------------
  // Helpers
  // ------------------------------
  const getBorderColor = (choice: string) => {
    if (!isAnswered) return 'border-gray-200'
    if (choice === correctAnswer) return 'border-green-500'
    if (choice === selected && !isCorrect) return 'border-red-500'
    return 'border-gray-200'
  }

  const getMessage = () => {
    if (isCorrect == null) return 'Chọn đáp án đúng'
    if (isCorrect) return 'Làm tốt lắm!'
    return isSkip ? 'Thử câu hỏi này lại sau' : 'Đừng nản chí học là một quá trình'
  }

  const getOptionBg = (choice: string) => {
    if (!isAnswered) return ''
    if (choice === correctAnswer && isCorrect) return 'bg-green-50'
    if (choice === selected && !isCorrect && choice !== correctAnswer) return 'bg-red-50'
    return ''
  }

  const getIcon = (choice: string, index: number) => {
    if (!isAnswered) return index + 1
    if (choice === correctAnswer) return <CheckIcon className='size-7 text-green-600' />
    if (choice === selected && !isCorrect && choice !== correctAnswer)
      return <XMarkIcon className='size-7 text-red-600' />
    return index + 1
  }

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div
      className={`bg-white rounded-2xl relative overflow-hidden py-10 border ${isAnswered ? 'border-gray-200' : 'shadow-lg border-gray-200'}`}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentQuestion.id || indexMulti}
          className='py-5 px-10 max-md:px-3'
          initial={{ x: '10%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-10%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
        >
          <p className='mt-10 text-xl'>{source}</p>
          <p
            className={`mt-5 font-semibold text-sm ${
              isCorrect === true ? 'text-green-500' : !isSkip && isCorrect === false ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {getMessage()}
          </p>

          <div className='grid grid-cols-2 gap-4 mt-5 max-md:grid-cols-1'>
            {option.map((choice, index) => (
              <div
                key={choice}
                onClick={() => handleSelect(choice)}
                className={`flex gap-2 border-2 p-3 rounded-lg transition-all duration-200 
                  ${getBorderColor(choice)} ${getOptionBg(choice)} 
                  ${isAnswered ? 'cursor-default opacity-80' : 'cursor-pointer hover:border-gray-700'}
                `}
              >
                <span
                  className={`size-7 flex items-center justify-center font-bold rounded-full text-gray-600 ${
                    isAnswered ? '' : 'p-2 bg-gray-200'
                  }`}
                >
                  {getIcon(choice, index)}
                </span>
                <p className='text-gray-500 text-lg'>{choice}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nút tiếp tục */}
      <AnimatePresence>
        {isAnswered && !isCorrect && showButtonNext && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className='absolute bottom-7 flex justify-between w-full bg-white px-10 items-center'
          >
            <p className='text-gray-500 font-semibold max-md:hidden'>Ấn nút tiếp tục để sang câu tiếp theo</p>
            <button
              ref={continueButtonRef}
              onClick={handleContinue}
              className='bg-blue-600 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition max-md:w-full focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              Tiếp tục
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút bỏ qua */}
      <div className='mt-5 flex justify-center'>
        <span
          onClick={() => handleSelect('')}
          className={`font-semibold text-sm px-3 py-2 rounded-2xl ${
            isAnswered ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50 cursor-pointer'
          }`}
        >
          Bạn không biết?
        </span>
      </div>
    </div>
  )
}

export default MultipleChoise
