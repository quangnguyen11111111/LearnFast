import { AnimatePresence,motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import MultipleChoise from '~/components/learnComponent/MultipleChoice'
import ProgressBar from '~/components/ProgressBar'

const MultipleChoicePage = () => {
  // Dữ liệu mẫu
  const ORIGINAL_DATA = [
    { id: '1', source: 'Dog', target: 'Chó', status: 3 },
    { id: '2', source: 'Sun', target: 'Mặt trời', status: 3 },
    { id: '3', source: 'Water', target: 'Nước', status: 3 },
    { id: '4', source: 'Cat', target: 'Mèo', status: 0 },
    { id: '5', source: 'Moon', target: 'Mặt trăng', status: 0 },
    { id: '6', source: 'Fire', target: 'Lửa', status: 0 },
    { id: '7', source: 'Tree', target: 'Cây', status: 0 },
    { id: '8', source: 'Book', target: 'Sách', status: 0 },
    { id: '9', source: 'Pen', target: 'Bút', status: 0 },
    { id: '10', source: 'Car', target: 'Xe hơi', status: 0 },
    { id: '11', source: 'Cloud', target: 'Đám mây', status: 0 },
    { id: '12', source: 'River', target: 'Dòng sông', status: 0 },
    { id: '13', source: 'Mountain', target: 'Núi', status: 0 }
  ]
  const [indexMulti, setIndexMulti] = useState<number>(ORIGINAL_DATA.filter((item) => item.status === 3).length)
  const [selected, setSelected] = useState<string | null>(null) // Trạng thái lựa chọn của người dùng
  const [isAnswered, setIsAnswered] = useState(false) // Trạng thái đã trả lời hay chưa
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null) // Trạng thái đúng sai
  // Hàm trỗn dữ liệu ngẫu nhiên cho trắc nghiệm
  const getRandomOptions = (correct: string, allTargets: string[]): string[] => {
    const options = [correct]
    while (options.length < 4) {
      const random = allTargets[Math.floor(Math.random() * allTargets.length)]
      if (!options.includes(random)) {
        options.push(random)
      }
    }
    return options.sort(() => Math.random() - 0.5)
  }
  const handleNextQuestion = () => {
    setIndexMulti((prevIndex) => {
      // Dùng % (modulo) để quay lại 0 khi đến cuối mảng
      return (prevIndex + 1) % ORIGINAL_DATA.length
    })
  }
  // mảng chứa Đích
  const allTargets = ORIGINAL_DATA.map((item) => item.target)
  const option = useMemo(() => {
    return getRandomOptions(ORIGINAL_DATA[indexMulti].target, allTargets)
  }, [indexMulti])
  return (
    <div className='px-25 pb-5 flex flex-col justify-start relative' >
      <div className="">
        <ProgressBar current={indexMulti} total={ORIGINAL_DATA.length} />
      <MultipleChoise
        ORIGINAL_DATA={ORIGINAL_DATA}
        handleNextQuestion={handleNextQuestion}
        indexMulti={indexMulti}
        option={option}
        isAnswered={isAnswered}
        setIsAnswered={setIsAnswered}
        isCorrect={isCorrect}
        setIsCorrect={setIsCorrect}
        selected={selected}
        setSelected={setSelected}
      />
       {/* Hiển thị nút "Tiếp tục" khi trả lời sai */}
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
              <p className='text-gray-500 font-semibold max-md:hidden'>
                Ấn nút tiếp tục để sang câu tiếp theo
              </p>
              <button
                className='bg-blue-600 text-white font-semibold px-6 py-2 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition'
                onClick={() => {
                  setSelected(null)
                  setIsAnswered(false)
                  setIsCorrect(null)
                  handleNextQuestion()
                }}
              >
                Tiếp tục
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
export default MultipleChoicePage
