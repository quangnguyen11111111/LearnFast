import { AnimatePresence, motion } from 'framer-motion'
import MultipleChoise from '~/components/learnComponent/MultipleChoice'
import Essay from '~/components/learnComponent/Essay'
import ListTerm from '~/components/ListTerm'
import ProgressBar from '~/components/ProgressBar'
import imgEndLesson from '~/assets/EndLesson.png'
import Button from '~/components/button/Button'
import { useMixedLearning } from '~/features/mixedLearning/useMixedLearning'
import type { Question } from '~/features/mixedLearning/types'

// MultipleChoicePage (Refactor): sử dụng hook useMixedLearning để tập trung logic.
// Hook quản lý: status, dữ liệu từng chế độ, option, tiến độ, chuyển câu.
// UI chỉ render theo state và xử lý chuyển vòng khi ở ListTerm.
const MultipleChoicePage = () => {
  const initialData: Question[] = [
    { id: '1', source: 'Dog dog', target: 'Chó', status: 3, statusMode: 0 },
    { id: '0', source: 'Sun', target: 'Mặt trời', status: 3, statusMode: 0 },
    { id: '3', source: 'Water', target: 'Nước', status: 3, statusMode: 0 },
    { id: '4', source: 'Cat', target: 'Mèo', status: 3, statusMode: 0 },
    { id: '5', source: 'Moon', target: 'Mặt trăng', status: 3, statusMode: 0 },
    { id: '6', source: 'Fire', target: 'Lửa', status: 3, statusMode: 0 },
    { id: '7', source: 'Tree', target: 'Cây', status: 3, statusMode: 0 },
    { id: '8', source: 'Book', target: 'Sách', status: 3, statusMode: 0 },
    { id: '9', source: 'Pen', target: 'Bút', status: 0, statusMode: 0 },
    { id: '10', source: 'Car', target: 'Xe hơi', status: 0, statusMode: 0 },
    { id: '11', source: 'Cloud', target: 'Đám mây', status: 0, statusMode: 0 },
    { id: '12', source: 'River', target: 'Dòng sông', status: 0, statusMode: 0 }
  ]

  const {
    status,
    numberQuestion,
    indexQuestion,
    indexEssay,
    indexMulti,
    dataMulti,
    dataEssay,
    dataCorrect,
    option,
    isAnswered,
    isCorrect,
    selected,
    valueInput,
    setSelected,
    setValueInput,
    setIsAnswered,
    setIsCorrect,
    setStatus,
    handleNextQuestionMultil,
    handleNextQuestionEssay,
    progressTotal,
    buttonRef,
    ORIGINAL_DATA
  } = useMixedLearning({ initialData })

  // Phục vụ nút tiếp tục ở ListTerm.

  const batchSize = 6
  const computeRound = (idx: number) => Math.floor(idx / batchSize)
  const round = computeRound(indexMulti)
  const fetchQuestionsLocal = (data: Question[], r: number) => data.slice(r * batchSize, r * batchSize + batchSize)

  return (
    <div className='px-25 max-md:px-10 pb-5 flex flex-col justify-start relative'>
      {status === 'Multiple' && (
        <div>
          <ProgressBar current={numberQuestion} total={progressTotal} />
          <MultipleChoise
            ORIGINAL_DATA={dataMulti}
            handleNextQuestion={handleNextQuestionMultil}
            indexMulti={indexQuestion}
            option={option}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            isCorrect={isCorrect}
            setIsCorrect={setIsCorrect}
            selected={selected}
            setSelected={setSelected}
          />
          <AnimatePresence>
            {isAnswered && !isCorrect && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='fixed bottom-3 left-0 w-full flex justify-center z-50'
              >
                <div className='flex items-center justify-between bg-white px-8 py-3 w-[90%] max-w-2xl'>
                  <p className='text-gray-500 font-semibold max-md:hidden'>Ấn nút tiếp tục để sang câu tiếp theo</p>
                  <button
                    ref={buttonRef}
                    className='bg-blue-600 text-white font-semibold px-6 py-2 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition'
                    onClick={() => {
                      setSelected(null)
                      setIsAnswered(false)
                      setIsCorrect(null)
                      handleNextQuestionMultil(false)
                    }}
                  >
                    Tiếp tục
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {status === 'Essay' && (
        <div>
          <ProgressBar current={numberQuestion} total={progressTotal} />
          <Essay
            ORIGINAL_DATA={dataEssay}
            indexMulti={indexQuestion}
            valueInput={valueInput}
            isCorrect={isCorrect}
            setValueInput={setValueInput}
            handleNextQuestionEssay={handleNextQuestionEssay}
            setIsCorrect={setIsCorrect}
          />
          <AnimatePresence>
            {isCorrect === false && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='fixed bottom-0 left-0 w-full flex justify-center z-50'
              >
                <div className='flex items-center justify-between bg-white px-8 py-3 w-[90%] max-w-2xl'>
                  <p className='text-gray-500 font-semibold max-md:hidden'>Ấn nút tiếp tục để sang câu tiếp theo</p>
                  <button
                    ref={buttonRef}
                    className='bg-blue-600 text-white font-semibold px-6 py-2 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition focus:outline-none'
                    onClick={() => {
                      setIsCorrect(null)
                      setValueInput('')
                      handleNextQuestionEssay(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        setIsCorrect(null)
                        setValueInput('')
                        handleNextQuestionEssay(false)
                      }
                    }}
                  >
                    Tiếp tục
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {status === 'ListTerm' && (
        <div className='px-10 pb-10'>
          <div className='mb-3 text-3xl font-bold mt-5'>Tốt lắm, bạn đang tiến bộ đấy.</div>
          <ProgressBar current={numberQuestion} total={progressTotal} type='solid' />
          <div className='border-b-1 border-gray-300'></div>
          <ListTerm ORIGINAL_DATA={dataCorrect} />
          <AnimatePresence>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className='fixed bottom-0 left-0 w-full flex justify-center z-50'
            >
              <div className='flex items-center justify-between bg-white px-8 py-3 w-[90%] max-w-2xl'>
                <p className='text-gray-500 font-semibold max-md:hidden'>Ấn nút tiếp tục để sang câu tiếp theo</p>
                <button
                  ref={buttonRef}
                  className='bg-blue-600 text-white font-semibold px-6 py-2 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition'
                  onClick={() => {
                    const prevBatchEssay = fetchQuestionsLocal(ORIGINAL_DATA, round - 1).filter(
                      (q) => q.statusMode === 1
                    ).length
                    const currentBatchEssay = fetchQuestionsLocal(ORIGINAL_DATA, round).filter(
                      (q) => q.statusMode === 1
                    ).length
                    if (prevBatchEssay > 0 || currentBatchEssay > 0) {
                      setStatus('Essay')
                    } else if (dataEssay.length === 0 && dataMulti.length === 0) {
                      setStatus('EndLesson')
                    } else {
                      setStatus('Multiple')
                    }
                  }}
                >
                  Tiếp tục
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {status === 'EndLesson' && (
        <div className='flex flex-col items-center justify-center'>
          <img src={imgEndLesson} alt='ảnh cúp hoàn thành' className='size-30 mt-15' />
          <div className='mt-20'>Chúc mừng bạn đã hoàn thành học phần này</div>
          <p>Hãy thử thêm một vòng nữa để bạn có thể tập luyện thêm học phần</p>
          <div className='grid grid-cols-2 max-md:grid-cols-1 gap-5 mt-10'>
            <Button rounded='rounded-3xl' className='px-10 py-3 font-semibold' variant='secondary'>
              Làm bài kiểm tra
            </Button>
            <Button rounded='rounded-3xl' className='px-10 py-3 font-semibold'>
              Tiếp tục ôn luyện
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
export default MultipleChoicePage
