import React, { useEffect, useMemo, useRef, useState } from 'react'
import Button from '~/components/button/Button'
import imgBottomTest from '~/assets/imgBottomTest.svg'
import { useTimer } from '~/utils/coutTime'
import IconButton from '~/components/button/ButtonIcon'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { NumberedListIcon } from '@heroicons/react/24/solid'
import TestResult from '~/components/learnComponent/test/TestResult'
import TestSetupModal from '~/components/learnComponent/test/TestSetupModal'
import TestSummarySidebar from '~/components/learnComponent/test/TestSummarySidebar'
import TrueFalseQuestion from '~/components/learnComponent/test/TrueFalseQuestion'
import MultipleChoiceQuestion from '~/components/learnComponent/test/MultipleChoiceQuestion'
import EssayQuestion from '~/components/learnComponent/test/EssayQuestion'
import { generateTrueFalseData, getRandomItems, getRandomOptions } from '~/utils/testUtils'
import type { Question, UserAnswer } from '~/features/test/types'
// Types used in this module
// Types moved to ~/features/test/types

// Example dataset (kept outside component to avoid re-creation on each render)
const defaultData: Question[] = [
  { id: '1', source: 'Dog dog', target: 'Chó', status: 3, statusMode: 1 },
  { id: '0', source: 'Sun', target: 'Mặt trời', status: 3, statusMode: 1 },
  { id: '3', source: 'Water', target: 'Nước', status: 3, statusMode: 1 },
  { id: '4', source: 'Cat', target: 'Mèo', status: 3, statusMode: 1 },
  { id: '5', source: 'Moon', target: 'Mặt trăng', status: 3, statusMode: 1 },
  { id: '6', source: 'Fire', target: 'Lửa', status: 3, statusMode: 1 },
  { id: '7', source: 'Tree', target: 'Cây', status: 3, statusMode: 0 },
  { id: '8', source: 'Book', target: 'Sách', status: 3, statusMode: 0 },
  { id: '9', source: 'Pen', target: 'Bút', status: 0, statusMode: 0 },
  { id: '10', source: 'Car', target: 'Xe hơi', status: 0, statusMode: 0 },
  { id: '11', source: 'Cloud', target: 'Đám mây', status: 0, statusMode: 0 },
  { id: '12', source: 'River', target: 'Dòng sông', status: 0, statusMode: 0 }
]

const TestPage = () => {
  // Hàm đảo dữ liệu
  /**
   * shuffleArray
   * - Trả về một bản sao của mảng đầu vào sau khi hoán vị ngẫu nhiên
   * - Không thay đổi mảng gốc (immutable)
   */
  // Helpers moved to ~/utils/testUtils

  // -------------- Xử lí setup bài kiểm tra -----------
  // State lưu số lượng câu trong bài kiểm tra
  const [batchSize, setbatchSize] = useState<number>(defaultData.length >= 8 ? 8 : defaultData.length)

  // dữ liệu mẫu
  const [ORIGINAL_DATA, setORIGINAL_DATA] = useState<Question[]>(getRandomItems(defaultData, batchSize))
  // mảng chứa tất cả target
  const allSources = defaultData.map((item) => item.source)
  // CHế độ kiểm tra đúng sai
  const [isTestTrueFalse, setIsTestTrueFalse] = useState<boolean>(true)

  // CHế độ kiểm tra trắc nghiệm
  const [isTestMultiple, setIsTestMultiple] = useState<boolean>(true)

  // CHế độ kiểm tra tự luận
  const [isTestEssay, setIsTestEssay] = useState<boolean>(true)
  // Biến để đếm có bao nhiêu chế độ bật
  const countEnabled = (isTestTrueFalse ? 1 : 0) + (isTestMultiple ? 1 : 0) + (isTestEssay ? 1 : 0)

  // Biến lưu trữ mỗi chế độ có bao nhiêu câu
  const questionCountByMode = useMemo(() => {
    const total = ORIGINAL_DATA.length
    const modes = [
      { key: 'trueFalse', enabled: isTestTrueFalse },
      { key: 'essay', enabled: isTestEssay },
      { key: 'multiple', enabled: isTestMultiple }
    ]

    // Lọc ra các chế độ đang bật
    const enabledModes = modes.filter((m) => m.enabled)
    const count = enabledModes.length
    if (count === 0) return { trueFalse: 0, essay: 0, multiple: 0 }

    // Chia đều
    const base = Math.floor(total / count)
    let remainder = total % count

    // Mặc định mỗi chế độ nhận base câu
    const result = {
      trueFalse: isTestTrueFalse ? base : 0,
      essay: isTestEssay ? base : 0,
      multiple: isTestMultiple ? base : 0
    }

    // Nếu còn dư, ưu tiên cho Multiple trước
    if (remainder > 0 && isTestMultiple) {
      result.multiple += 1
      remainder--
    }

    // Nếu còn dư (ví dụ bật 2 chế độ và multiple tắt), chuyển dư sang Essay
    if (remainder > 0 && isTestEssay) {
      result.essay += 1
    }

    return result
  }, [ORIGINAL_DATA, isTestTrueFalse, isTestEssay, isTestMultiple])

  // Hook trả về các hàm xử lí thời gian
  const { startTimer, stopTimer, resetTimer, formatTime } = useTimer()

  // Xử lý dữ liệu cho từng chế độ
  // 1.. Chế độ đúng sai
  // True/False data generator moved to utils (requires pool data argument)
  // 2.. Chế độ trắc nghiệm
  // Hàm trỗn dữ liệu ngẫu nhiên cho trắc nghiệm
  /**
   * getRandomOptions
   * - Tạo 4 lựa chọn cho câu trắc nghiệm, gồm 1 đáp án đúng và 3 đáp án nhầm ngẫu nhiên
   * - Trả về các option đã được shuffle
   */
  const getRandomOptions = (correct: string, allSources: string[]): string[] => {
    const options = [correct]
    while (options.length < 4) {
      const random = allSources[Math.floor(Math.random() * allSources.length)]
      if (!options.includes(random)) {
        options.push(random)
      }
    }
    return options.sort(() => Math.random() - 0.5)
  }

  // Biến chứa dữ liệu mỗi chế độ chưa trả lời
  const dividedData = useMemo(() => {
    const { trueFalse, multiple, essay } = questionCountByMode
    let start = 0
    const data = {
      trueFalse: generateTrueFalseData(
        ORIGINAL_DATA.slice(start, start + trueFalse),
        ORIGINAL_DATA
      ),
      multiple: ORIGINAL_DATA.slice(start + trueFalse, start + trueFalse + multiple),
      essay: ORIGINAL_DATA.slice(start + trueFalse + multiple, start + trueFalse + multiple + essay)
    }
    return data
  }, [ORIGINAL_DATA, questionCountByMode])

  // Số thứ tự câu
  let indexNumberNow = 0

  // Lưu trữ đường dẫn của các câu
  // 1.. ref đúng sai
  const refTrueFalse = useRef<(HTMLDivElement | null)[]>([])
  // 2.. ref multiple
  const refMultiple = useRef<(HTMLDivElement | null)[]>([])
  // 3.. ref essay
  const refEssay = useRef<(HTMLInputElement | HTMLDivElement | null)[]>([])
  // 4.. ref input essay
  const refInputEssay = useRef<(HTMLInputElement | null)[]>([])
  // 5.. ref div main để quay lại khi người dùng submit
  const refDivMain = useRef<HTMLDivElement>(null)
  // lưu trạng thái trả lời chưa cho từng chế độ
  // 1..
  const answeredTrueFalse = useRef<boolean[]>([])
  // 2..
  const answeredMultiple = useRef<boolean[]>([])
  // 3..
  const answeredEssay = useRef<boolean[]>([])
  // Khởi tạo bạn đầu là chưa trả lời
  useEffect(() => {
    answeredTrueFalse.current = new Array(dividedData.trueFalse.length).fill(false)
    answeredMultiple.current = new Array(dividedData.multiple.length).fill(false)
    answeredEssay.current = new Array(dividedData.essay.length).fill(false)
  }, [dividedData])

  const handleNext = (
    currentIndex: number,
    ref: React.RefObject<(HTMLDivElement | HTMLInputElement | null)[]>,
    answered: boolean[],
    mode: 'trueFalse' | 'multiple' | 'essay'
  ) => {
    /**
     * handleNext
     * - Dùng để chuyển đến câu hỏi tiếp theo chưa trả lời trong cùng chế độ
     * - Nếu không còn câu trong chế độ hiện tại sẽ nhảy sang chế độ tiếp theo (trueFalse -> multiple -> essay)
     * - Tự động cuộn tới phần tử và focus input khi cần (essay)
     */
    const jumpToNextUnanswered = (
      ref: React.RefObject<(HTMLDivElement | HTMLInputElement | null)[]>,
      answered: boolean[]
    ) => {
      const nextIndex = answered.findIndex((a) => !a)
      if (nextIndex !== -1 && ref.current[nextIndex]) {
        const next = ref.current[nextIndex]
        next.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // 👉 chỉ focus khi nhảy sang essay
        if (ref === refEssay) {
          setTimeout(() => refInputEssay.current[nextIndex]?.focus({ preventScroll: true }), 250)
        }
        return true
      }
      return false
    }

    // tìm câu chưa trả lời trong cùng chế độ
    let nextIndex = currentIndex + 1
    while (nextIndex < answered.length && answered[nextIndex]) {
      nextIndex++
    }

    if (nextIndex < answered.length) {
      const next = ref.current[nextIndex]

      if (next) {
        next.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (mode === 'essay') {
          setTimeout(() => refInputEssay.current[nextIndex]?.focus({ preventScroll: true }), 250)
          console.log('có chạy rồi')
        }
      }
      return
    }

    // Nếu đã hết câu trong chế độ hiện tại => chuyển sang chế độ kế tiếp
    if (mode === 'trueFalse') {
      if (isTestMultiple && jumpToNextUnanswered(refMultiple, answeredMultiple.current)) return
      if (isTestEssay && jumpToNextUnanswered(refEssay, answeredEssay.current)) return
    } else if (mode === 'multiple') {
      if (isTestEssay && jumpToNextUnanswered(refEssay, answeredEssay.current)) return
    }

    // Nếu tất cả đều đã làm xong
    console.log('✅ Người dùng đã hoàn thành tất cả câu hỏi!')
    refButtonSubmitTest.current?.focus()
  }

  // ------------------ HÀM CHỌN ĐÁP ÁN ------------------
  // 1.. State lưu trữ câu trả lời và đánh giá đúng sai
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  // 2.. State lưu trữ đáp án hiện tại người dùng đang chọn
  // Lưu đáp án người dùng hiện đang chọn (dùng cho highlight)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | boolean>>({})

  const handleSelectAnswer = (
    questionId: string,
    mode: 'trueFalse' | 'multiple' | 'essay',
    userAnswer: string | boolean,
    correctAnswer: string | boolean,
    refDivMain: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null
  ) => {
    /**
     * handleSelectAnswer
     * - Cập nhật lựa chọn đang highlight (selectedAnswers)
     * - So sánh với đáp án đúng và lưu vào `userAnswers`
     * - Thực hiện cập nhật theo từng chế độ
     */
    // 1. Cập nhật highlight (đánh dấu đáp án đã chọn)
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: userAnswer
    }))

    // 2️. Đánh giá đúng sai
    const isCorrect = userAnswer === correctAnswer
    console.log('kiểm tra isCorrect ', isCorrect, '- người dùng trả lời', userAnswer, '- đáp án ddunsg ', correctAnswer)

    // 3️. Cập nhật mảng userAnswers
    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === questionId && a.mode === mode)
      const updatedAnswer = {
        id: questionId,
        mode,
        userAnswer,
        isCorrect,
        refDivMain
      }

      if (existingIndex !== -1) {
        const newArr = [...prev]
        newArr[existingIndex] = updatedAnswer
        return newArr
      }
      return [...prev, updatedAnswer]
    })
  }

  // State xác định người dùng đã trả lời xong chưa
  const [isEndTest, setIsEndTest] = useState<boolean>(false)

  // ref button Gửi bài kiểm tra
  const refButtonSubmitTest = useRef<HTMLButtonElement>(null)

  // ------------------------Hàm khi submit kiểm tra còn câu nào trống ---------
  const handleSubmitEndTest = () => {
    /**
     * handleSubmitEndTest
     * - Kiểm tra xem có câu nào chưa trả lời không.
     * - Nếu còn câu chưa trả lời: cuộn tới câu đó và dừng gửi bài.
     * - Nếu tất cả đã trả lời: dừng timer và mở summary.
     */
    const findFirstUnanswered = (
      ref: React.RefObject<(HTMLDivElement | HTMLInputElement | null)[]>,
      answered: boolean[]
    ) => {
      const index = answered.findIndex((a) => !a)
      if (index !== -1 && ref.current[index]) {
        const el = ref.current[index]
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Nếu là essay → focus input
        if (ref === refEssay) {
          setTimeout(() => refInputEssay.current[index]?.focus({ preventScroll: true }), 250)
        }
        return true
      }
      return false
    }

    // 2️⃣ Nếu còn câu nào chưa làm → focus và dừng gửi
    if (
      (isTestTrueFalse && findFirstUnanswered(refTrueFalse, answeredTrueFalse.current)) ||
      (isTestMultiple && findFirstUnanswered(refMultiple, answeredMultiple.current)) ||
      (isTestEssay && findFirstUnanswered(refEssay, answeredEssay.current))
    ) {
      alert('⚠️ Bạn vẫn còn câu hỏi chưa trả lời!')
      return
    }

    // 3️⃣ Nếu đã hoàn thành tất cả → cho phép gửi bài
    setIsEndTest(true)
    stopTimer()
    setIsOpenSummary(true)
  }

  // --------- Các hàm chung cho các chế độ ---------

  // 1. Hàm trả về style chung cho các nút đáp án
  // Feedback helpers moved into ~/utils/testFeedback and used inside components

  // -------- Các hàm hiển thị giao diện cho từng loại -------
  // TestResult extracted to component
  // 2.. Hàm tạo dữ liệu option cho trắc nghiệm
  const multipleOptions = useMemo(() => {
    return dividedData.multiple.map((item) => getRandomOptions(item.source, allSources))
  }, [dividedData.multiple])

  // 3.. hàm submit giao diện setup bài kiểm tra
  const handleSubmitSetupTest = () => {
    resetTimer()
    startTimer()
    setIsOpen(false)
    setIsEndTest(false)
    setIsOpenSummary(false)
    setUserAnswers([])
    setSelectedAnswers({})
    setORIGINAL_DATA(getRandomItems(defaultData, batchSize))
  }

  // Hàm cuộn lên đầu giao diện
  const scrollToTop = () => {
    if (!refDivMain.current) return
    window.scrollTo({
      top: refDivMain.current.offsetTop - 60, // chỉnh theo layout thực tế
      behavior: 'smooth'
    })
  }

  // State hiển thị modal setup bài kiểm tra
  const [isOpen, setIsOpen] = useState(false)

  // Mở modal khi vào trang
  useEffect(() => {
    setIsOpen(true)
  }, [])
  // 3.. Giao diện hiển thị liệt kê tóm tắt các câu
  const [isOpenSummary, setIsOpenSummary] = useState<boolean>(false)
  return (
    <div className='px-85 max-xl:px-55 max-lg:px-30 max-md:px-10 flex flex-col items-center gap-8 pb-10 relative'>
      {/* Giao diện hiển thị danh sách tóm tắt các câu hỏi sau khi trả lời */}
      {/* Toggle button to open summary */}
      {!isOpenSummary && isEndTest && (
        <button
          className='fixed top-20 left-5 z-40 border-[1px] border-gray-200 bg-white p-2 rounded-3xl hover:bg-gray-100 transition-colors cursor-pointer'
          onClick={() => setIsOpenSummary(true)}
        >
          <NumberedListIcon className='size-6 text-gray-700' />
        </button>
      )}
      <TestSummarySidebar open={isOpenSummary} onClose={() => setIsOpenSummary(false)} userAnswers={userAnswers} />
      {/* Nút cài đặt bài kiểm tra */}
      <div
        className='fixed top-3 right-28 z-50 max-md:right-15'
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <IconButton icon={Cog8ToothIcon} onClick={() => {}} size={8} variant='secondary' />
      </div>
      {/* GIao diện setup bài kieemr tra */}
      <TestSetupModal
        open={isOpen}
        onClose={() => {
          startTimer()
          setIsOpen(false)
        }}
        batchSize={batchSize}
        setBatchSize={setbatchSize}
        maxCount={defaultData.length}
        isTestTrueFalse={isTestTrueFalse}
        setIsTestTrueFalse={setIsTestTrueFalse}
        isTestMultiple={isTestMultiple}
        setIsTestMultiple={setIsTestMultiple}
        isTestEssay={isTestEssay}
        setIsTestEssay={setIsTestEssay}
        countEnabled={countEnabled}
        onStart={() => {
          handleSubmitSetupTest()
          scrollToTop()
        }}
      />
      {/* Thống kê đúng sai khi submit */}
      <div className=' w-full' ref={refDivMain}>
        {isEndTest && (
          <TestResult
            time={`${formatTime()}`}
            correct={userAnswers.filter((a) => a.isCorrect === true).length}
            wrong={userAnswers.filter((a) => a.isCorrect === false).length}
          />
        )}
      </div>
      {/* chế độ đúng sai */}
      {isTestTrueFalse &&
        dividedData.trueFalse.map((items, index) => {
          indexNumberNow += 1
          const userAnswer = userAnswers.find((a) => a.id === items.id && a.mode === 'trueFalse')
          const isSelected = selectedAnswers[items.id]
          return (
            <TrueFalseQuestion
              key={items.id}
              id={items.id}
              source={items.source}
              displayTarget={items.displayTarget}
              correctFlag={items.isCorrect}
              correctTarget={items.target}
              indexNumberNow={indexNumberNow}
              total={ORIGINAL_DATA.length}
              isEndTest={isEndTest}
              userAnswer={userAnswer}
              selected={isSelected as boolean | undefined}
              onSelect={(userChoice) => {
                handleSelectAnswer(items.id, 'trueFalse', userChoice, items.isCorrect, refTrueFalse.current[index])
                answeredTrueFalse.current[index] = true
                handleNext(index, refTrueFalse, answeredTrueFalse.current, 'trueFalse')
              }}
              ref={(el) => {
                refTrueFalse.current[index] = el
              }}
            />
          )
        })}
      {/* chế độ trắc nghiệm */}
      {isTestMultiple &&
        !isOpen &&
        dividedData.multiple.map((items, index) => {
          const option = multipleOptions[index]
          indexNumberNow += 1
          const userAnswer = userAnswers.find((a) => a.id === items.id && a.mode === 'multiple')
          return (
            <MultipleChoiceQuestion
              key={items.id}
              id={items.id}
              target={items.target}
              options={option}
              correctSource={items.source}
              indexNumberNow={indexNumberNow}
              total={ORIGINAL_DATA.length}
              isEndTest={isEndTest}
              userAnswer={userAnswer}
              selected={selectedAnswers[items.id]}
              onSelect={(v) => {
                answeredMultiple.current[index] = true
                handleNext(index, refMultiple, answeredMultiple.current, 'multiple')
                handleSelectAnswer(items.id, 'multiple', v, items.source, refMultiple.current[index])
              }}
              ref={(el) => {
                refMultiple.current[index] = el
              }}
            />
          )
        })}
      {/* chế độ tự luận */}

      {isTestEssay &&
        dividedData.essay.map((items, index) => {
          indexNumberNow += 1
          const userAnswer = userAnswers.find((a) => a.id === items.id && a.mode === 'essay')
          return (
            <EssayQuestion
              key={items.id}
              id={items.id}
              target={items.target}
              indexNumberNow={indexNumberNow}
              total={ORIGINAL_DATA.length}
              isEndTest={isEndTest}
              userAnswer={userAnswer}
              inputRef={(el) => {
                refInputEssay.current[index] = el
              }}
              onEnter={(val) => {
                answeredEssay.current[index] = true
                handleNext(index, refEssay, answeredEssay.current, 'essay')
                handleSelectAnswer(
                  items.id,
                  'essay',
                  val.trim().toLowerCase(),
                  items.source.trim().toLowerCase(),
                  refEssay.current[index]
                )
              }}
              isLast={dividedData.essay.length - 1 === index}
              ref={(el) => {
                refEssay.current[index] = el
              }}
            />
          )
        })}
      {/* nút hoàn thành */}
      {!isEndTest && (
        <div className='flex flex-col items-center gap-12 mt-5'>
          <img src={imgBottomTest} alt='' className='h-[4rem]' />
          <p className='font-bold text-2xl'>Tất cả đã xong! Bạn đã sẵn sàng gửi bài kiểm tra?</p>
          <Button
            ref={refButtonSubmitTest}
            className='px-9 py-4 font-semibold'
            rounded='rounded-4xl'
            onClick={() => {
              // cuộn lên đầu khi submit
              if (!refDivMain.current) return
              window.scrollTo({
                top: refDivMain.current.offsetTop - 60, // chỉnh theo layout thực tế
                behavior: 'smooth'
              })

              handleSubmitEndTest()
            }}
          >
            Gửi bài kiểm tra
          </Button>
        </div>
      )}
      {/* Hiển thị  */}
      {}
    </div>
  )
}
export default TestPage
