import React, { useState, useEffect, use } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon, XMarkIcon, ArrowPathIcon, AcademicCapIcon, Square2StackIcon } from '@heroicons/react/24/outline'

interface FlashcardProps {
  cards: { id: string; source: string; target: string; status: number }[]
  height?: string
  onProgress?: boolean // chế độ theo dõi tiến độ
  knownStatus?: number // số thẻ đã biết
  unknownStatus?: number // số thẻ chưa biết
  markKnown?: (value: string) => void // hàm đánh dấu đã biết
  markUnknown?: (value: string) => void // hàm đánh dấu chưa biết
  setIsNavigationPage?: (value: boolean) => void // đặt trạng thái chuyển trang
  isNavigationPage?: boolean // trạng thái đã chuyển trang
  demo?: boolean
  fileID?: string
  resetStatuses?: () => void
}

const Flashcard = ({
  cards,
  height = 'h-100',
  onProgress = false,
  knownStatus = 0,
  unknownStatus = 0,
  markKnown,
  markUnknown,
  setIsNavigationPage,
  isNavigationPage,
  demo,
  fileID,
  resetStatuses
}: FlashcardProps) => {
  const navigate = useNavigate()
  const [index, setIndex] = useState(onProgress ? knownStatus + unknownStatus : 0) //chỉ số thẻ
  useEffect(() => {
    // Reset index khi chuyển chế độ theo dõi
    setIndex(onProgress ? knownStatus + unknownStatus : 0)
  }, [onProgress,])
  const [isFlipped, setIsFlipped] = useState(false) //trạng thái lật thẻ
  const [direction, setDirection] = useState(0) //hướng chuyển động
  const [feedback, setFeedback] = useState<null | 'known' | 'unknown'>(null) // trạng thái phản hồi
  const [isAnimating, setIsAnimating] = useState(false) // chặn click nhanh

  // Tính phần trăm đã biết
  const totalCards = cards.length
  const percent = totalCards > 0 ? Math.round((knownStatus / totalCards) * 100) : 0

  // Guard: kiểm tra index hợp lệ
  const currentCard = cards[index]

  const isValidIndex = index >= 0 && index < cards.length && currentCard // đảm bảo currentCard không undefined

  // Tự động chuyển đến màn hình tổng kết khi tất cả thẻ đã biết (chế độ theo dõi bật)
  useEffect(() => {
    if (onProgress && totalCards > 0 && knownStatus === totalCards) {
      setIsNavigationPage?.(true)
    }
  }, [onProgress, knownStatus, totalCards, setIsNavigationPage])

  // hàm xử lý nút tiếp theo
  const handleNext = (known: boolean) => {
    // Chặn click khi đang animation hoặc index không hợp lệ
    if (isAnimating || !isValidIndex) return

    if (onProgress) {
      setIsAnimating(true)
      setFeedback(known ? 'known' : 'unknown')
      // Sử dụng hook functions để đánh dấu
      if (known) {
        markKnown?.(currentCard.id)
      } else {
        markUnknown?.(currentCard.id)
      }
      setDirection(known ? -1 : 1)
      setTimeout(() => {
        setFeedback(null)
        setIsFlipped(false)
        // Kiểm tra nếu đã hoàn thành tất cả thẻ
        if (index >= cards.length - 1) {
          setIsNavigationPage?.(true)
        } else {
          setIndex((prev) => prev + 1)
        }
        setIsAnimating(false)
      }, 700)
    } else {
      // Khi không bật theo dõi, mặc định đánh dấu đã biết khi lướt qua
      markKnown?.(currentCard.id)
      setDirection(1)
      setIsFlipped(false)
      if (index >= cards.length - 1) {
        setIsNavigationPage?.(true)
      } else {
        setIndex((prev) => prev + 1)
      }
    }
  }

  // hàm xử lý nút trước
  const handlePrev = () => {
    if (index === 0 || isAnimating) return
    setDirection(-1)
    setIsFlipped(false)
    setIndex((prev) => prev - 1)
  }

  // Hàm học lại từ đầu
  const handleRestart = () => {
    resetStatuses?.()
    setIndex(0)
    setIsNavigationPage?.(false)
    setIsFlipped(false)
    setFeedback(null)
  }

  // Hàm chuyển sang chế độ Multiple Choice
  const handleGoToMultipleChoice = () => {

    navigate(`/learn-lesson/multiple-choice?fileId=${fileID}`,{replace:true})
  }

  // Hàm chuyển đến trang Flashcard đầy đủ (cho demo mode)
  const handleGoToFlashcard = () => {
    navigate(`flash-card?fileId=${fileID}`,{replace:true})
  }

  // Màn hình hoàn thành (nằm trong container, không fullscreen)
  if (isNavigationPage) {
    // Giao diện demo: chỉ hiển thị nút truy cập Flashcard
    if (demo) {
      return (
        <div className='flex flex-col items-center mt-8'>
          <div className={`relative w-full ${height} rounded-2xl flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-100`}>
            <div className='text-5xl mb-3'>📚</div>
            <h2 className='text-xl font-bold text-indigo-700 mb-2'>Trải nghiệm thêm!</h2>
            <p className='text-gray-600 mb-6 text-center'>Truy cập chế độ Thẻ ghi nhớ để học tập hiệu quả hơn</p>
            <button
              onClick={handleGoToFlashcard}
              className='flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg'
            >
              <Square2StackIcon className='w-5 h-5' />
              Vào chế độ Thẻ ghi nhớ
            </button>
          </div>
        </div>
      )
    }

    // Giao diện đầy đủ với thống kê
    return (
      <div className='flex flex-col items-center mt-8'>
        <div className={`relative w-full h-full rounded-2xl flex flex-col items-center justify-center p-8`}>
          {/* Icon và tiêu đề */}
          <div className='text-5xl mb-3'>🎉</div>
          <h2 className='text-2xl font-bold text-indigo-700 mb-1'>Hoàn thành!</h2>
          <p className='text-gray-600 mb-4'>Bạn đã hoàn thành tất cả {totalCards} thẻ</p>

          {/* Biểu đồ tròn thống kê */}
          <div className='relative mt-1 mb-4'>
            <svg width='120' height='120'>
              <circle cx='60' cy='60' r='50' className='stroke-orange-300' strokeWidth='12' fill='none' />
              <circle
                cx='60'
                cy='60'
                r='50'
                stroke='#3aee86'
                strokeWidth='12'
                fill='none'
                strokeDasharray={`${(percent / 100) * 314} 314`}
                strokeLinecap='round'
                transform='rotate(-90 60 60)'
              />
            </svg>
            <span className='absolute inset-0 flex items-center justify-center text-xl font-bold'>{percent}%</span>
          </div>

          {/* Thống kê chi tiết */}
          {onProgress && (
            <div className='flex gap-8 mb-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>{knownStatus}</div>
                <div className='text-sm text-gray-500'>Đã biết</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-red-600'>{unknownStatus}</div>
                <div className='text-sm text-gray-500'>Chưa biết</div>
              </div>
            </div>
          )}

          {/* Hai nút điều hướng */}
          <div className='flex gap-4 flex-wrap justify-center'>
            <button
              onClick={handleRestart}
              className='flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg'
            >
              <ArrowPathIcon className='w-5 h-5' />
              Học lại
            </button>
            <button
              onClick={handleGoToMultipleChoice}
              className='flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg'
            >
              <AcademicCapIcon className='w-5 h-5' />
              Trắc nghiệm
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center mt-8'>
      {/* Thẻ hiển thị */}
      <div className={`relative w-full ${height} perspective rounded-2xl outline outline-gray-100`}>
        <AnimatePresence mode='popLayout' custom={direction}>
          {isValidIndex && (
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
                    <div className='absolute backface-hidden text-2xl font-semibold'>{currentCard.source}</div>

                    {/* Mặt sau */}
                    <div className='absolute rotate-y-180 backface-hidden text-2xl font-semibold bg-yellow-100 w-full h-full flex items-center justify-center rounded-2xl'>
                      {currentCard.target}
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
          )}
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
