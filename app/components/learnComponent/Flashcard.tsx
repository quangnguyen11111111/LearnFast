import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface FlashcardProps {
  cards: { id: string; source: string; target: string; status: number }[]
  height?: string
  onProgress?: boolean
  knownStatus?: number
  unknownStatus?: number
  setKnownStatus?: (value: number) => void
  setUnknownStatus?: (value: number) => void
}

const Flashcard = ({
  cards,
  height = 'h-100',
  onProgress = false,
  setKnownStatus,
  setUnknownStatus,
  knownStatus,
  unknownStatus
}: FlashcardProps) => {
  const [index, setIndex] = useState(0) //chỉ số thẻ
  const [isFlipped, setIsFlipped] = useState(false) //trạng thái lật thẻ
  const [direction, setDirection] = useState(0) //hướng chuyển động
  const [feedback, setFeedback] = useState<null | 'known' | 'unknown'>(null) // trạng thái phản hồi
  // hàm xử lý nút tiếp theo
  const handleNext = (known: boolean) => {
    if (index >= cards.length - 1) return
    if (onProgress) {
      setFeedback(known ? 'known' : 'unknown')
      known ? setKnownStatus?.((knownStatus ?? 0) + 1) : setUnknownStatus?.((unknownStatus ?? 0) + 1) // tăng chỉ số thẻ đã biết hoặc chưa biết
      setDirection(known ? -1 : 1) // thiết lập hướng chuyển động
      setTimeout(() => {
        setFeedback(null)
        setIsFlipped(false)
        setIndex((prev) => (prev + 1) % cards.length)
      }, 700)
    } else {
      setKnownStatus?.((knownStatus ?? 0) + 1)
      setDirection(1)
      setIsFlipped(false)
      setIndex((prev) => (prev + 1) % cards.length)
    }
  }
  // hàm xử lý nút trước
  const handlePrev = () => {
    if (index === 0) return
    setDirection(-1)
    setIsFlipped(false)
    setIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  return (
    <div className='flex flex-col items-center mt-8'>
      {/* Thẻ hiển thị */}
      <div className={`relative w-full ${height} perspective rounded-2xl outline outline-gray-100`}>
        <AnimatePresence mode='popLayout' custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              scale: feedback ? 1.05 : 1,
              y: feedback ? -10 : 0
            }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='absolute w-full h-full'
          >
            <motion.div
              className='w-full h-full bg-white rounded-2xl shadow-lg flex items-center justify-center cursor-pointer [transform-style:preserve-3d]'
              animate={{ rotateX: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => setIsFlipped((prev) => !prev)}
            >
              {!feedback && (
                <>
                  {/* Mặt trước */}
                  <div className='absolute backface-hidden text-2xl font-semibold'>{cards[index].source}</div>

                  {/* Mặt sau */}
                  <div className='absolute rotate-y-180 backface-hidden text-2xl font-semibold bg-yellow-100 w-full h-full flex items-center justify-center rounded-2xl'>
                    {cards[index].target}
                  </div>
                </>
              )}
            </motion.div>

            {/* Hiệu ứng nổi feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  key='feedback'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className={`absolute inset-0 flex items-center justify-center text-3xl font-bold rounded-2xl ${
                    feedback === 'known' ? 'text-green-600 bg-green-50/70' : 'text-red-600 bg-red-50/70'
                  }`}
                >
                  {feedback === 'known' ? '✅ ĐÃ BIẾT' : '❌ CHƯA BIẾT'}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nút điều hướng */}
      <div className='flex justify-center gap-6 mt-6 items-center'>
        <button
          onClick={() => (onProgress ? handleNext(false) : handlePrev())}
          className='px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg font-medium transition'
        >
          {onProgress ? <XMarkIcon className='size-6 text-red-800' /> : '◀ Trước'}
        </button>

        <div className='text-gray-600 font-semibold'>
          {index + 1} / {cards.length}
        </div>

        <button
          onClick={() => handleNext(true)}
          className='px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg font-medium transition'
        >
          {onProgress ? <CheckIcon className='size-6 text-green-800' /> : 'Tiếp ▶'}
        </button>
      </div>
    </div>
  )
}

export default Flashcard
