import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
interface MultipleChoiseProps {
  indexMulti: number
  ORIGINAL_DATA: { id: string; source: string; target: string; status: number; statusMode: number }[]
  option: string[]
  handleNextQuestion: (value: boolean) => void
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
  if (!ORIGINAL_DATA[indexMulti]) return
  const correctAnswer = ORIGINAL_DATA[indexMulti].target
  const [isSkip, setIsSkip] = useState<boolean>(false)
  // Xử lý khi người dùng chọn một đáp án
  const handleSelect = (item: string) => {
    if (isAnswered) return
    setSelected(item)
    setIsAnswered(true)
    const correct = item === correctAnswer
    setIsCorrect(correct)
    if (item === '') {
      setIsSkip(true)
    }
    if (correct) {
      // Nếu đúng, tự chuyển câu sau 0.8 giây
      setTimeout(() => {
        setSelected(null)
        setIsAnswered(false)
        setIsCorrect(null)
        handleNextQuestion(true)
      }, 800)
    }
  }
  // Hàm để lấy màu viền dựa trên trạng thái
  const getBorderColor = (item: string) => {
    if (!isAnswered) return 'border-gray-200'
    if (item === correctAnswer && isCorrect) return 'border-green-500'
    if (item === selected && !isCorrect) return 'border-red-500'
    if (item === correctAnswer && !isCorrect) return 'border-green-500'
    return 'border-gray-200'
  }
  return (
    <div
      className={`bg-white rounded-2xl relative overflow-hidden py-10 border border-gray-200 ${isAnswered ? '' : 'shadow-lg '}`}
    >
      <AnimatePresence mode='wait'>
        {' '}
        {/* 'wait' đảm bảo cái cũ đi ra xong cái mới mới đi vào */}
        <motion.div
          key={ORIGINAL_DATA[indexMulti]?.id || indexMulti} //  Key này báo cho AnimatePresence biết component đã thay đổi
          className='py-5 px-10 max-md:px-3' // Di chuyển padding vào đây
          initial={{ x: '10%', opacity: 0 }} // Trạng thái bắt đầu (bên phải, vô hình)
          animate={{ x: 0, opacity: 1 }} // Trạng thái hoạt động (ở giữa, hiện hình)
          exit={{ x: '-10%', opacity: 0 }} // Trạng thái thoát (sang trái, vô hình)
          transition={{ duration: 0.3, ease: 'linear' }} // Tốc độ và kiểu hiệu ứng
        >
          <p className='mt-10 text-xl'>{ORIGINAL_DATA[indexMulti].source}</p>
          <div className='mt-25'>
            <p
              className={`font-semibold  text-sm mb-5 ${isCorrect === true ? 'text-green-500' : !isSkip && isCorrect === false ? 'text-red-500' : 'text-gray-500'}`}
            >
              {isCorrect == null
                ? 'Chọn đáp án đúng'
                : isCorrect === true
                  ? 'Làm tốt lắm!'
                  : !isSkip && isCorrect === false
                    ? 'Đừng nản chí học là một quá trình'
                    : 'Thử câu hỏi này lại sau'}
            </p>
            <div className='grid grid-cols-2 gap-4 max-md:grid-cols-1'>
              {option &&
                option.map((item, index) => {
                  return (
                    <div
                      key={item}
                      className={`flex gap-2 border-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${getBorderColor(
                        item
                      )} 
                      ${
                        isAnswered
                          ? 'cursor-default opacity-80' // vô hiệu hóa hover và click
                          : 'cursor-pointer hover:border-gray-700'
                      }
                      ${
                        isAnswered && item === correctAnswer && isCorrect
                          ? 'bg-green-50'
                          : isAnswered && item === selected && !isCorrect && item !== correctAnswer
                            ? 'bg-red-50'
                            : ''
                      }`}
                      onClick={() => handleSelect(item)}
                    >
                      <span
                        className={`${isAnswered ? '' : 'p-2 bg-gray-200'} size-7 flex items-center justify-center font-bold text-gray-600  rounded-[50%]`}
                      >
                        {isAnswered && item === correctAnswer ? (
                          <CheckIcon className='size-7 text-green-600' />
                        ) : isAnswered && item === selected && !isCorrect && item !== correctAnswer ? (
                          <XMarkIcon className='size-7 text-red-600' />
                        ) : (
                          index + 1
                        )}
                      </span>
                      <p className='text-gray-500 text-lg'>{item}</p>
                    </div>
                  )
                })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Hiển thị nút tiếp tục khi người dùng chọn đáp án sai */}
      <AnimatePresence>
        {isAnswered && !isCorrect && showButtonNext && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className='absolute bottom-7 flex justify-between w-full bg-white px-10  items-center'
          >
            {' '}
            <p className='text-gray-500 font-semibold max-md:hidden'>Ấn nút tiếp tục để sang câu tiếp theo</p>
            <button
              className='bg-blue-600 text-white font-semibold px-6 py-2 max-md:w-full rounded-full shadow-lg hover:bg-blue-700 transition'
              onClick={() => {
                setSelected(null)
                setIsAnswered(false)
                setIsCorrect(null)
                handleNextQuestion(false)
              }}
            >
              Tiếp tục
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='mt-5 flex justify-center'>
        <span
          onClick={() => {
            handleSelect('')
          }}
          className={` font-semibold text-sm px-3 py-2 rounded-2xl ${isAnswered ? ' text-gray-400' : 'hover:bg-blue-50 text-blue-600 cursor-pointer'}`}
        >
          Bạn không biết?
        </span>
      </div>
    </div>
  )
}
export default MultipleChoise
