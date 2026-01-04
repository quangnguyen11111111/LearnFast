import { AnimatePresence, motion } from 'framer-motion'
import Button from '../button/Button'
import { useEffect, useRef, useState } from 'react'
import { useSound } from '~/hookSound/useSound'
interface EssayProps {
  indexMulti: number
  ORIGINAL_DATA: { id: string; source: string; target: string }[]
  valueInput: string
  isCorrect: boolean | null
  setValueInput: (value: string) => void
  handleNextQuestionEssay: (value: boolean) => void
  setIsCorrect: (value: boolean) => void
}
const Essay = ({
  indexMulti,
  ORIGINAL_DATA,
  valueInput,
  isCorrect,
  setValueInput,
  handleNextQuestionEssay,
  setIsCorrect
}: EssayProps) => {
  if (!ORIGINAL_DATA[indexMulti]) return
  const correctAnswer = ORIGINAL_DATA[indexMulti]
  // State để theo dõi nếu người dùng chọn "Tôi không biết"
  const [isIdontKnow, setIsIdontKnow] = useState<boolean>(false)
  // State để theo dõi người dùng chọn "hiển thị gợi ý"
  const [isShowHint, setIsShowHint] = useState<boolean>(false)
  // State để ngăn chặn click liên tục vào nút trả lời
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const refInput = useRef<HTMLInputElement>(null)
  const { playSuccessSound } = useSound()
  // Hàm chuyển tiếp
  const handleNextQuestion = () => {
    if (isProcessing) return // Ngăn chặn click khi đang xử lý
    setIsProcessing(true)

    const normalizedInput = valueInput.trim().toLowerCase()
    const normalizedAnswer = correctAnswer.source.trim().toLowerCase()
    const correct = normalizedInput === normalizedAnswer
    if (correct) {
      playSuccessSound()
      setIsCorrect(true)
      setTimeout(() => {
        setValueInput('')
        setIsShowHint(false)
        setIsProcessing(false)
        handleNextQuestionEssay(true)
      }, 1000)
    } else {
      setIsCorrect(false)
      setIsShowHint(false)
      setIsProcessing(false)
    }
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      refInput.current?.focus()
    }, 350)
    return () => clearTimeout(timer)
  }, [indexMulti, isCorrect])

  // Reset isProcessing khi chuyển sang câu hỏi tiếp theo
  useEffect(() => {
    setIsProcessing(false)
  }, [indexMulti])
  // Hàm hiển thị theo trạng thái câu trả lời
  const renderFeedBack = () => {
    if (isCorrect === false) {
      return (
        <>
          {/* Nếu false Hiển thị đáp án người dùng nhập sai */}
          <p className={` font-semibold mb-4 ${isIdontKnow ? 'text-gray-700' : 'text-red-700'}`}>
            {isIdontKnow ? 'Thử lại câu hỏi này sau!' : 'Đừng lo bạn vẫn đang học mà!'}
          </p>
          <p
            className={`w-full outline-2 rounded-md px-2 py-3 ${isIdontKnow ? 'outline-gray-400 text-gray-500 text-lg' : 'outline-red-400 '}`}
          >
            {isIdontKnow ? 'Đã bỏ qua' : valueInput}
          </p>
        </>
      )
    } else if (isCorrect === true) {
      return (
        <>
          {/* Nếu đúng hiển thị đáp án người dùng đã nhập */}
          <p className='text-green-700 font-semibold mb-4'>Rất tốt bạn đã trả lời đúng</p>
          <p className='w-full outline-2 outline-green-400 px-2 py-3 rounded-md'>{valueInput}</p>
        </>
      )
    } else
      return (
        <>
          {/* Nếu null hiển thị input cho người dùng nhập */}
          <p className='text-sm font-semibold text-gray-600 mb-4 '>Đáp án của bạn</p>
          <input
            ref={refInput}
            type='text'
            placeholder='Nhập đáp án của bạn'
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (valueInput.trim() !== '') {
                  handleNextQuestion()
                }
              }
            }}
            className={`w-full font-semibold  bg-gray-100 rounded-md px-2 py-3 placeholder-gray-400 placeholder:font-semibold mt-2 focus:outline-blue-300 focus:bg-white border-none}`}
          />
        </>
      )
  }
  // Hàm xử lí phong cách hiển thị gợi Ý
  const displayProcessingSuggest = (correctAnswer: { id: string; source: string; target: string }) => {
    const phrase = correctAnswer.source.trim() // toàn bộ cụm, giữ space
    const total = phrase.length
    const hintCount = Math.max(1, Math.ceil(total * 0.2)) // ít nhất 1 ký tự
    const shownSegment = phrase.slice(0, hintCount)

    // tìm ký tự chữ cái đầu tiên trong phần shown để viết hoa (nếu có)
    let shownArr = shownSegment.split('')
    const firstAlphaIndex = shownArr.findIndex((ch) => /[A-Za-zÀ-ỹ0-9]/u.test(ch))
    if (firstAlphaIndex !== -1) {
      shownArr[firstAlphaIndex] = shownArr[firstAlphaIndex].toUpperCase()
    }

    // xây dựng output: duyệt toàn chuỗi, nếu index < hintCount => show ký tự (từ shownArr),
    // nếu là space => giữ space, else show '_'
    const out = Array.from(phrase).map((ch, i) => {
      if (i < hintCount) {
        // hiển thị ký tự (đã xử lý viết hoa ở shownArr)
        const c = shownArr[i] ?? ch
        // nếu ký tự là space thì render một khoảng cách rõ ràng
        return c === ' ' ? '\u00A0' : c
      } else {
        // giữ space nguyên, ẩn ký tự khác bằng '_ ' để có khoảng cách đều
        return ch === ' ' ? '\u00A0' : '_'
      }
    })
    return out
  }
  return (
    <div className={`bg-white rounded-2xl relative overflow-hidden border-2 border-gray-200`}>
      <AnimatePresence mode='wait'>
        {' '}
        {/* 'wait' đảm bảo cái cũ đi ra xong cái mới mới đi vào */}
        <motion.div
          key={ORIGINAL_DATA[indexMulti]?.id || indexMulti} //  Key này báo cho AnimatePresence biết component đã thay đổi
          className='py-10 px-10 max-md:px-3 min-h-120 flex flex-col justify-between' // Di chuyển padding vào đây
          initial={{ x: '10%', opacity: 0 }} // Trạng thái bắt đầu (bên phải, vô hình)
          animate={{ x: 0, opacity: 1 }} // Trạng thái hoạt động (ở giữa, hiện hình)
          exit={{ x: '-10%', opacity: 0 }} // Trạng thái thoát (sang trái, vô hình)
          transition={{ duration: 0.3, ease: 'linear' }} // Tốc độ và kiểu hiệu ứng
        >
          <div className='min-h-60'>
            <div className='text-sm font-semibold text-gray-600 mb-6'>Định nghĩa</div>
            <div className='text-2xl'>{ORIGINAL_DATA[indexMulti].target}</div>
          </div>
          <div className=''>
            {/* HIển thị phản hồi dụa trên trạng thái isCorrect */}
            {renderFeedBack()}
            {/* Hiển thị nút tương tác khi người dùng chưa xác nhận */}
            {isCorrect !== false && (
              <div className=' mt-6 flex justify-between items-center'>
                {/* Hiển thị nút hoặc nội dung gợi ý theo isShowHint */}
                {!isShowHint ? (
                  <Button
                    variant='secondary'
                    className='px-4 py-3 font-semibold text-sm'
                    onClick={() => setIsShowHint(true)}
                    rounded='rounded-3xl'
                  >
                    Hiển thị gợi ý
                  </Button>
                ) : (
                  <AnimatePresence>
                    {isShowHint && (
                      <motion.div
                        key='hint'
                        initial={{ opacity: 0, y: -20 }} // Bắt đầu mờ và cao hơn
                        animate={{ opacity: 1, y: 0 }} // Trượt xuống và hiện dần
                        exit={{ opacity: 0, y: -20 }} // Khi biến mất (nếu cần)
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className='mt-3'
                      >
                        <p className='text-[13px] font-semibold text-gray-400 mb-3'>GỢI Ý</p>

                        <motion.p
                          className='tracking-wider text-gray-600 font-medium text-lg'
                          initial='hidden'
                          animate='visible'
                          variants={{
                            hidden: {},
                            visible: {
                              transition: {
                                staggerChildren: 0.05, // từng ký tự hiện cách nhau 0.05s
                                delayChildren: 0.1
                              }
                            }
                          }}
                        >
                          {(() => {
                            const out = displayProcessingSuggest(correctAnswer)
                            return out.map((ch, i) => (
                              <motion.span
                                key={i}
                                variants={{
                                  hidden: { opacity: 0, y: -10 },
                                  visible: { opacity: 1, y: 0 }
                                }}
                                transition={{ duration: 0.2 }}
                                className='inline-block'
                              >
                                {ch === '_' ? <span className='opacity-70'>_</span> : ch}
                              </motion.span>
                            ))
                          })()}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}

                <div className='flex gap-10'>
                  <button
                    className='text-blue-600 text-sm font-semibold px-4 py-3 rounded-3xl hover:bg-gray-200'
                    onClick={() => {
                      handleNextQuestion()
                      setIsIdontKnow(true)
                    }}
                  >
                    Bạn không biết?
                  </button>
                  <button
                    disabled={!valueInput || isProcessing}
                    className={`  text-sm px-4 py-3 rounded-3xl font-semibold ${valueInput === '' || isProcessing ? ' bg-gray-100 text-gray-300 cursor-not-allowed' : 'cursor-pointer bg-blue-600 text-white hover:bg-blue-700'} `}
                    onClick={() => {
                      handleNextQuestion()
                    }}
                  >
                    Trả lời
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Hiển thị đáp án đúng nếu trả lời sai */}
          <AnimatePresence>
            {isCorrect === false && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className='text-start'
              >
                <p className='mb-2 mt-5 text-green-700 font-semibold'>Đáp án đúng</p>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                  className='text-gray-500 mt-4 text-lg'
                >
                  <div className='border-2 border-dashed border-green-500 rounded-lg px-2 py-2 flex'>
                    <span>{correctAnswer.source}</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
export default Essay
