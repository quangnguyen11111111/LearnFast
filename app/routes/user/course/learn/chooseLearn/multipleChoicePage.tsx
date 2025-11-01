import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import Essay from '~/components/learnComponent/Essay'
import MultipleChoise from '~/components/learnComponent/MultipleChoice'
import ListTerm from '~/components/ListTerm'
import ProgressBar from '~/components/ProgressBar'
import imgEndLesson from '~/assets/EndLesson.png'
import Button from '~/components/button/Button'
const MultipleChoicePage = () => {
  // Dữ liệu mẫu
  interface Question {
    id: string
    source: string
    target: string
    status: number
    statusMode: number
  }
  const ORIGINAL_DATA = [
    { id: '1', source: 'Dog dog', target: 'Chó', status: 3, statusMode: 2 },
    { id: '2', source: 'Sun', target: 'Mặt trời', status: 3, statusMode: 2 },
    { id: '3', source: 'Water', target: 'Nước', status: 3, statusMode: 2 },
    { id: '4', source: 'Cat', target: 'Mèo', status: 3, statusMode: 2 },
    { id: '5', source: 'Moon', target: 'Mặt trăng', status: 3, statusMode: 2 },
    { id: '6', source: 'Fire', target: 'Lửa', status: 3, statusMode: 2 },
    { id: '7', source: 'Tree', target: 'Cây', status: 3, statusMode: 2 },
    { id: '8', source: 'Book', target: 'Sách', status: 3, statusMode: 2 },
    { id: '9', source: 'Pen', target: 'Bút', status: 0, statusMode: 2 },
    { id: '10', source: 'Car', target: 'Xe hơi', status: 0, statusMode: 2 },
    { id: '11', source: 'Cloud', target: 'Đám mây', status: 0, statusMode: 2 },
    { id: '12', source: 'River', target: 'Dòng sông', status: 0, statusMode: 2 },
    { id: '13', source: 'Mountain', target: 'Núi', status: 0, statusMode: 0 }
  ]
  // Hàm lấy dữ liệu câu hỏi ( 6 câu 1 lần )
  const fetchQuestions = (data: Question[], round: number): Question[] => {
    const shuffled = [...data] // copy mảng để không thay đổi gốc
    const start = round * 6
    const end = start + 6
    return shuffled.slice(start, end)
  }
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
  //Hàm lấy chỉ số nhóm câu hỏi hiện tại
  const getRound = (indexMul: number): number => {
    const result = indexMul / 6
    return Math.floor(result)
  }
  // sỗ các câu trắc nghiệm trả lời đúng
  const [indexEssay, setIndexEssay] = useState<number>(ORIGINAL_DATA.filter((item) => item.statusMode === 2).length)
  const [indexMulti, setIndexMulti] = useState<number>(
    ORIGINAL_DATA.filter((item) => item.statusMode === 1).length + indexEssay
  )
  // Tổng số các câu trả lời đúng
  const [numberQuestion, setNumberQuestion] = useState<number>(indexMulti + indexEssay)
  // Biến trạng thái hiển thị
  const [status, setStatus] = useState<string>('Multiple')
  // Chỉ số nhóm câu hỏi hiện tại
  const round = useMemo(() => getRound(status === 'Essay' ? indexEssay : indexMulti), [status, indexMulti, indexEssay])
  // Trạng thái lựa chọn của người dùng
  const [selected, setSelected] = useState<string | null>(null)
  // Trạng thái đã trả lời hay chưa
  const [isAnswered, setIsAnswered] = useState(false)
  // Trạng thái đúng sai
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  // Biến lưu trữ dữ liệu câu hỏi trắc nghiệm
  const [dataMulti, setDataMulti] = useState<Question[]>(
    fetchQuestions(ORIGINAL_DATA, round).filter((item) => item.statusMode === 0)
  )

  // Biến lưu trữ dữ liệu câu hỏi tự luận
  const [dataEssay, setDataEssay] = useState<Question[]>(
    fetchQuestions(ORIGINAL_DATA, round - 1).filter((item) => item.statusMode === 1)
  )
  const [dataCorrect, setDataCorrect] = useState<Question[]>(
    status === 'ListTerm'
      ? fetchQuestions(ORIGINAL_DATA, round - 1).filter((item) => item.statusMode !== 0)
      : fetchQuestions(ORIGINAL_DATA, round - 1).filter((item) => item.statusMode !== 0)
  )
  // Biến lưu trữ chỉ số câu hỏi hiện tại
  const [indexQuestion, setIndexQuestion] = useState<number>(0)

  // Biến lưu trữ đáp án tự luận
  const [valueInput, setValueInput] = useState<string>('')
  // Ref cho nút tiếp tục
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Tự động focus nút tiếp tục khi trả lời sai
  useEffect(() => {
    if (!isCorrect && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [isCorrect, status])

  // Cập nhật chế độ tự động
  useEffect(() => {
    if (numberQuestion % 6 === 0 && numberQuestion !== 0) {
      setStatus('ListTerm')
    } else if (fetchQuestions(ORIGINAL_DATA, round - 1).filter((item) => item.statusMode == 2).length > 0) {
      setStatus('Essay')
    } else {
      setStatus('Multiple')
    }
  }, [])
  // Hàm xử lý chuyển câu hỏi tiếp theo
  const handleNextQuestionMultil = (value: boolean) => {
    if (value) {
      setIndexMulti(indexMulti + 1)
      setNumberQuestion(numberQuestion + 1)
      setDataEssay([...dataEssay, dataMulti[indexQuestion]])
      setDataCorrect([...dataCorrect, dataMulti[indexQuestion]])
      setDataMulti(dataMulti.filter((_, index) => index !== indexQuestion))
      setIndexQuestion(indexQuestion)
      if (dataMulti.length === 1) {
        alert('Bạn đã hoàn thành tất cả các câu hỏi!')
        // setRound(round + 1)
        // setIndexQuestion(0)
        // setDataMulti(
        //   fetchQuestions(ORIGINAL_DATA, round + 1).filter((item) => item.status !== 3)
        // )
        setStatus('ListTerm')
        return
      }
    } else {
      const wrong = dataMulti[indexQuestion]
      const remaining = dataMulti.filter((_, i) => i !== indexQuestion)
      setDataMulti([...remaining, wrong])
    }
  }
  // Hàm xử lý chuyển câu hỏi tiếp theo cho tự luận
  const handleNextQuestionEssay = (value: boolean) => {
    if (value) {
      setIndexEssay(indexEssay + 1)
      setNumberQuestion(numberQuestion + 1)
      setDataEssay(dataEssay.filter((_, index) => index !== indexQuestion))
      setIsCorrect(null)
      if (dataEssay.length === 1) {
        alert('Bạn đã hoàn thành tất cả các câu hỏi!')
        setStatus('ListTerm')
        return
      }
    } else {
      const wrong = dataEssay[indexQuestion]
      const remaining = dataEssay.filter((_, i) => i !== indexQuestion)
      setDataEssay([...remaining, wrong])
    }
  }
  // mảng chứa Đích
  const allTargets = ORIGINAL_DATA.map((item) => item.target)
  // Lấy dữ liệu câu hỏi hiện tại với các lựa chọn trộn ngẫu nhiên
  const option = useMemo(() => {
    if (!dataMulti[indexQuestion]) return []
    return getRandomOptions(dataMulti[indexQuestion].target, allTargets)
  }, [indexQuestion, dataMulti])

  console.log('check data Chính xác dataCorrect', dataCorrect)
  console.log('check data essay', dataEssay)
  console.log('check round', round)
  console.log('check mode', status)
  console.log('check data Multiple', dataMulti)

  return (
    <div className='px-25 max-md:px-10 pb-5 flex flex-col justify-start relative'>
      {/* Học trắc nghiệm */}
      {status === 'Multiple' && (
        <div className=''>
          <ProgressBar current={numberQuestion} total={ORIGINAL_DATA.length * 2} />
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
      {/* Học tự luận */}
      {status === 'Essay' && (
        <div className=''>
          <ProgressBar current={numberQuestion} total={ORIGINAL_DATA.length * 2} />
          <div className=''>
            <Essay
              ORIGINAL_DATA={dataEssay}
              indexMulti={indexQuestion}
              valueInput={valueInput}
              isCorrect={isCorrect}
              setValueInput={setValueInput}
              handleNextQuestionEssay={handleNextQuestionEssay}
              setIsCorrect={setIsCorrect}
            />
          </div>
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
      {/* Tổng kết khóa học */}
      {status === 'ListTerm' && (
        <div className='px-10 pb-10'>
          <div className='mb-3 text-3xl font-bold mt-5'>Tốt lắm, bạn đang tiến bộ đấy.</div>
          <ProgressBar current={numberQuestion} total={ORIGINAL_DATA.length * 2} type='solid' />
          <div className='border-b-1 border-gray-300'></div>
          <ListTerm ORIGINAL_DATA={dataCorrect} />
          {/* Hiển thị nút "Tiếp tục" khi trả lời sai */}
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
                    if (dataEssay.length === 0 && dataMulti.length === 0) {
                      setStatus('EndLesson')
                    } else if (
                      fetchQuestions(ORIGINAL_DATA, round - 1).filter((item) => item.statusMode == 1).length == 6 ||
                      dataCorrect.length < 6
                    ) {
                      setStatus('Essay')
                    } else {
                      setStatus('Multiple')
                      setDataCorrect([])
                      setDataMulti(fetchQuestions(ORIGINAL_DATA, round).filter((item) => item.statusMode === 0))
                    }
                    setIndexQuestion(0)
                  }}
                >
                  Tiếp tục
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {/* Hoàn thành khóa học */}
      {status === 'EndLesson' && (
        <div className='flex flex-col items-center justify-center'>
          <img src={imgEndLesson} alt="ảnh cúp hoàn thành" className='size-30 mt-15' />
          <div className="mt-20">Chúc mừng bạn đã hoàn thành học phần này</div>
          <p>Hãy thử thêm một vòng nữa để bạn có thể tập luyện thêm học phần</p>
          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-5 mt-10">
            <Button rounded='rounded-3xl' className='px-10 py-3 font-semibold'variant='secondary'>Làm bài kiểm tra</Button>
            <Button rounded='rounded-3xl' className='px-10 py-3 font-semibold'>Tiếp tục ôn luyện</Button>
          </div>
        </div>
      )}
    </div>
  )
}
export default MultipleChoicePage
