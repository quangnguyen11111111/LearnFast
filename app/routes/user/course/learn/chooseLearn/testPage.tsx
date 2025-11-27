import React, { useEffect, useMemo, useRef, useState, Fragment } from 'react'
import Button from '~/components/button/Button'
import imgBottomTest from '~/assets/imgBottomTest.svg'
import { useTimer } from '~/utils/coutTime'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import IconButton from '~/components/button/ButtonIcon'
import { Cog8ToothIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { CheckBadgeIcon, CheckIcon, ClipboardDocumentCheckIcon, NumberedListIcon } from '@heroicons/react/24/solid'
import Toggle from '~/components/Toggle'
import { AnimatePresence, motion } from 'framer-motion'
// Types used in this module
interface Question {
  id: string
  source: string
  target: string
  status: number
  statusMode: number
}

// Structure to hold a user's answer and basic metadata
interface UserAnswer {
  id: string
  mode: 'trueFalse' | 'multiple' | 'essay'
  userAnswer: string | boolean
  isCorrect: boolean
  refDivMain: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null
}

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
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array] // Tạo bản sao để không làm thay đổi mảng gốc
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)) // random vị trí từ 0 → i
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]] // hoán đổi 2 phần tử
    }
    return shuffled
  }
  /**
   * getRandomItems
   * - Lấy `x` phần tử ngẫu nhiên từ mảng `arr` (dùng shuffleArray)
   */
  function getRandomItems(arr: Question[], x: number) {
    const shuffled = shuffleArray(arr)
    return shuffled.slice(0, x)
  }

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
  /**
   * generateTrueFalseData
   * - Tạo dữ liệu cho chế độ đúng/sai
   * - Với xác suất `trueRatio` câu sẽ hiển thị đúng target, ngược lại hiển thị target sai
   * - Trả về mảng với trường `displayTarget` và `isCorrect`
   */
  const generateTrueFalseData = (data: Question[], trueRatio = 0.4) => {
    return data.map((item) => {
      // random xác suất: nếu nhỏ hơn trueRatio => câu đúng
      const isCorrect = Math.random() < trueRatio

      // Nếu đúng, dùng target gốc
      if (isCorrect) {
        return { ...item, displayTarget: item.target, isCorrect: true }
      }

      // Nếu sai, chọn target ngẫu nhiên từ phần tử khác
      const wrongOptions = ORIGINAL_DATA.filter((d) => d.id !== item.id)
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)]

      return { ...item, displayTarget: randomWrong.target, isCorrect: false }
    })
  }
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
      trueFalse: generateTrueFalseData(ORIGINAL_DATA.slice(start, start + trueFalse)),
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
  const getButtonStyle = (isSelected: boolean, isEndTest: boolean, isCorrect?: boolean, isCorrectAnswer?: boolean) => {
    const baseStyle = 'border-2 rounded-lg w-full px-3 py-4 text-start font-semibold transition-colors'

    // Nếu đã nộp bài
    if (isEndTest) {
      // Nếu là đáp án đã chọn đúng
      if (isSelected && isCorrect === true) return `${baseStyle} border-green-500 text-green-700`
      // Nếu là đáp án chọn sai
      if (isSelected && isCorrect === false) return `${baseStyle} border-red-500 text-red-700`
      // Nếu là đáp án đúng nhưng không được chọn
      if (!isSelected && isCorrectAnswer) return `${baseStyle} border-green-500 border-dashed text-green-700`
      return `${baseStyle} border-gray-100 text-gray-400`
    }

    // Nếu đang làm bài
    if (isSelected) return `${baseStyle} border-blue-400 bg-blue-50 text-blue-700`
    return `${baseStyle} border-gray-200 text-gray-600 hover:border-gray-400 cursor-pointer`
  }
  // 2. Hàm trả về các đoạn text phản hồi
  const getFeedbackText = (
    mode: UserAnswer['mode'],
    isEndTest: boolean,
    isUserCorrect: boolean | undefined,
    questionId: string
  ): string => {
    /**
     * getFeedbackText
     * - Trả về chuỗi phản hồi tùy theo trạng thái (chưa nộp / đúng / sai)
     * - Dùng một hàm băm đơn giản trên `questionId` để chọn thông điệp ngẫu nhiên
     */
    // 🟢 Khi chưa nộp bài hoặc chưa chọn gì
    if (!isEndTest || isUserCorrect === null || isUserCorrect === undefined) {
      switch (mode) {
        case 'trueFalse':
          return 'Chọn câu trả lời'
        case 'multiple':
          return 'Chọn đáp án đúng'
        case 'essay':
          return 'Đáp án của bạn'
        default:
          return ''
      }
    }

    // Khi người dùng chọn đúng
    if (isUserCorrect) {
      const correctMessages = ['Chính xác!', 'Bạn đang tiến bộ từng ngày!']
      const hash = questionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const index = hash % correctMessages.length
      return correctMessages[index]
    }

    // Khi người dùng chọn sai
    const wrongMessages = [
      'Chưa đúng, hãy cố gắng nhé!',
      'Đừng nản chí, học là một quá trình!',
      'Đừng lo, bạn vẫn đang học mà!'
    ]
    const hash = questionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = hash % wrongMessages.length
    return wrongMessages[index]
  }

  // 3.. Hàm hiển thị style các đoạn text theo phản hồi
  const getFeedbackClass = (isEndTest: boolean, isUserCorrect: boolean | undefined): string => {
    if (!isEndTest || isUserCorrect === undefined) {
      // Mặc định chưa trả lời
      return 'font-semibold text-gray-600 text-sm'
    }

    return isUserCorrect
      ? 'font-semibold text-green-600 text-sm' // đúng: xanh lá
      : 'font-semibold text-red-600 text-sm' // sai: đỏ
  }

  // -------- Các hàm hiển thị giao diện cho từng loại -------
  // 1.. Giao diện hiển thị phần trăm đúng sai khi submit
  const TestResult = ({ time, correct, wrong }: { time: string; correct: number; wrong: number }) => {
    /**
     * TestResult component
     * - Hiển thị thời gian làm bài, biểu đồ phần trăm, số câu đúng/sai và danh sách đáp án
     */
    const total = correct + wrong
    const percent = Math.round((correct / total) * 100)

    return (
      <div className='px-6 pt-6'>
        {/* Title */}
        <h1 className='text-3xl font-bold mb-6'>Hãy đối tốt với bản thân, và tiếp tục ôn luyện!</h1>

        {/* Main layout */}
        <div className='flex items-center gap-12'>
          {/* Left: Timer + circle chart */}
          <div className='flex flex-col items-center'>
            <p className='text-xl font-bold text-gray-600'>Thời gian của bạn: {time}</p>

            {/* Circle chart */}
            <div className='relative mt-1'>
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
          </div>

          {/* Right: Correct / Wrong */}
          <div className='flex flex-col space-y-3'>
            <div className='flex items-center gap-4'>
              <span className='text-green-600 text-xl font-semibold'>Đúng</span>
              <span className='border px-4 py-1 rounded-full text-lg bg-green-50 border-green-300 text-green-700 font-semibold'>
                {correct}
              </span>
            </div>

            <div className='flex items-center gap-4'>
              <span className='text-orange-600 text-xl font-semibold'>Sai</span>
              <span className='border px-4 py-1 rounded-full text-lg bg-orange-50 border-orange-300 text-orange-700 font-semibold'>
                {wrong}
              </span>
            </div>
          </div>
        </div>

        {/* Answer section */}
        <h2 className='mt-2 text-lg font-bold text-gray-600'>Đáp án của bạn</h2>
      </div>
    )
  }
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
      <>
        {/* Button hiển thị khi sidebar đóng */}
        {!isOpenSummary && isEndTest && (
          <button
            className='fixed top-20 left-5 z-40 border-[1px] border-gray-200 bg-white p-2 rounded-3xl hover:bg-gray-100 transition-colors cursor-pointer'
            onClick={() => setIsOpenSummary(true)}
          >
            <NumberedListIcon className='size-6 text-gray-700' />
          </button>
        )}

        {/* Sidebar */}
        <div
          className={`
          fixed top-20 left-5 w-60 bg-white z-40 p-4
          transform transition-transform duration-300
          ${isOpenSummary ? 'translate-x-0' : '-translate-x-full'}
        `}
        >
          {/* Header */}
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold text-gray-500'>Danh sách câu hỏi</h2>
            <div className='hover:bg-gray-100 rounded-4xl p-1 cursor-pointer'>
              <XMarkIcon className='w-6 h-6' onClick={() => setIsOpenSummary(false)} />
            </div>
          </div>

          <div className='mt-5 flex flex-col gap-1 overflow-y-auto max-h-145 scrollbar-none '>
            {userAnswers.map((q, idx) => {
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    q.refDivMain &&
                      'scrollIntoView' in q.refDivMain &&
                      q.refDivMain.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                  type='button'
                  className='w-full flex items-center gap-1 p-2 rounded-md text-left hover:bg-gray-100 transition-colors'
                >
                  {q.isCorrect ? (
                    <CheckIcon className='size-6 text-green-500' />
                  ) : (
                    <XMarkIcon className='size-6 text-red-500' />
                  )}
                  <span className='text-[16px] text-gray-700'>{idx + 1}</span>
                </button>
              )
            })}
          </div>
        </div>
      </>
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
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-50'
          onClose={() => {
            startTimer()
            setIsOpen(false)
            // setORIGINAL_DATA(getRandomItems(defaultData, batchSize))
          }}
        >
          {/* Overlay */}
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-[#0101108f] backdrop-blur-sm ' />
          </TransitionChild>

          {/* Modal wrapper */}
          <div className='fixed inset-0 flex items-center justify-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-200'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-150'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-3xl rounded-2xl bg-white px-10 py-8 shadow-xl relative'>
                <div className='absolute top-1 right-3'>
                  <IconButton
                    icon={XMarkIcon}
                    onClick={() => {
                      startTimer()
                      setIsOpen(false)
                      // setORIGINAL_DATA(getRandomItems(defaultData, batchSize))
                    }}
                    size={7}
                    variant='secondary'
                  />
                </div>
                <DialogTitle className='mb-4 flex justify-between mt-5 items-center'>
                  <div className=''>
                    <p className='font-semibold text-lg'>Thư mục 1</p>
                    <h1 className='font-bold text-3xl'>Thiết lập bài kiểm tra</h1>
                  </div>
                  <ClipboardDocumentCheckIcon className='size-13 text-blue-700' />
                </DialogTitle>

                {/* Nội dung modal (tùy chỉnh sau) */}
                <div className='flex flex-col gap-y-10 mt-7'>
                  <div className='flex items-center justify-between'>
                    <p className='font-semibold text-lg'>
                      Câu hỏi <span className='font-light'>{`(tối đa ${defaultData.length})`}</span>{' '}
                    </p>
                    <input
                      type='number'
                      value={batchSize}
                      onChange={(e) => {
                        const value = Number(e.target.value)

                        // Giới hạn từ 1 đến maxBatchSize
                        if (value < 1) setbatchSize(1)
                        else if (value > defaultData.length) setbatchSize(defaultData.length)
                        else setbatchSize(value)
                      }}
                      min={1}
                      className='w-20 px-3 py-3 font-semibold rounded-xl border-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300'
                    />
                  </div>
                  <div className='w-full h-[1px] bg-gray-300'></div>
                  <div className='flex items-center justify-between'>
                    <p className='font-semibold text-lg'>Đúng/Sai</p>
                    <Toggle
                      checked={isTestTrueFalse}
                      onChange={() => {
                        if (isTestTrueFalse && countEnabled === 1) return // chặn tắt cuối cùng
                        setIsTestTrueFalse(!isTestTrueFalse)
                      }}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='font-semibold text-lg'>Trắc nghiệm</p>
                    <Toggle
                      checked={isTestMultiple}
                      onChange={() => {
                        if (isTestMultiple && countEnabled === 1) return
                        setIsTestMultiple(!isTestMultiple)
                      }}
                    />
                  </div>
                  <div className='flex items-center justify-between'>
                    <p className='font-semibold text-lg'>Tự luận</p>
                    <Toggle
                      checked={isTestEssay}
                      onChange={() => {
                        if (isTestEssay && countEnabled === 1) return
                        setIsTestEssay(!isTestEssay)
                      }}
                    />
                  </div>
                </div>

                <div className='mt-6 flex justify-end'>
                  <Button
                    className='px-4 py-2 text-sm font-semibold'
                    onClick={() => {
                      handleSubmitSetupTest()
                      scrollToTop()
                    }}
                    rounded='rounded-3xl'
                  >
                    Bắt đầu làm kiểm tra
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
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
          return (
            <div
              key={items.id}
              ref={(el) => {
                refTrueFalse.current[index] = el
              }}
              className='relative w-full shadow-lg border-t-3 border-gray-100 rounded-2xl py-8 px-8 min-h-120 flex flex-col justify-between '
            >
              <div className='text-gray-400 text-sm absolute right-6 top-6'>
                {indexNumberNow}/{ORIGINAL_DATA.length}
              </div>
              <div className='grid grid-cols-2 items-start justify-items-start flex-1 '>
                <div className='px-3'>
                  <p className='font-semibold text-gray-500 text-sm mb-10'>Thuật ngữ</p>
                  <p className='text-xl'>{items.source}</p>
                </div>
                <div className='border-s-2 border-gray-200 h-full px-3'>
                  <p className='font-semibold text-gray-500 text-sm mb-10'>Định nghĩa</p>
                  <p className='text-xl'>{items.displayTarget}</p>
                </div>
              </div>
              <div className='mt-5'>
                {/* Hiển thị phản hồi */}
                <p className={`${getFeedbackClass(isEndTest, userAnswer?.isCorrect)}`}>
                  {getFeedbackText('trueFalse', isEndTest, userAnswer?.isCorrect, items.id)}
                </p>
                <div className={`flex items-center justify-between gap-8 mt-5`}>
                  {/* Hiển thị nút đúng sai */}
                  {['Đúng', 'Sai'].map((label) => {
                    const userChoice = label === 'Đúng'
                    const isSelected = selectedAnswers[items.id] === userChoice

                    return (
                      <button
                        key={label}
                        disabled={isEndTest}
                        onClick={() => {
                          handleSelectAnswer(
                            items.id,
                            'trueFalse',
                            userChoice,
                            items.isCorrect,
                            refTrueFalse.current[index]
                          )
                          answeredTrueFalse.current[index] = true
                          handleNext(index, refTrueFalse, answeredTrueFalse.current, 'trueFalse')
                        }}
                        className={getButtonStyle(isSelected, isEndTest, userAnswer?.isCorrect)}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
                <AnimatePresence>
                  {items.isCorrect === false && isEndTest && (
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
                          <span>{items.target}</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      {/* chế độ trắc nghiệm */}
      {isTestMultiple &&
        !isOpen &&
        dividedData.multiple.map((items, index) => {
          const option = multipleOptions[index] // luôn cố định
          indexNumberNow += 1
          const userAnswer = userAnswers.find((a) => a.id === items.id && a.mode === 'multiple')

          return (
            <div
              key={index}
              ref={(el) => {
                refMultiple.current[index] = el
              }}
              className='relative w-full shadow-lg border-t-3 border-gray-100 rounded-2xl py-7 px-8 min-h-120 flex flex-col justify-between '
            >
              <div className='text-gray-400 text-sm absolute right-6 top-6'>
                {indexNumberNow}/{ORIGINAL_DATA.length}
              </div>
              <div className=''>
                <p className='font-semibold text-gray-500 text-sm mb-10'>Định nghĩa</p>
                <p className='text-xl'>{items.target}</p>
              </div>
              <div className='mt-5'>
                <p className={getFeedbackClass(isEndTest, userAnswer?.isCorrect)}>
                  {getFeedbackText('multiple', isEndTest, userAnswer?.isCorrect, items.id)}
                </p>
                <div className='grid grid-cols-2 gap-5 mt-5'>
                  {option.map((v, i) => {
                    const isSelected = selectedAnswers[items.id] === v
                    return (
                      <button
                        key={i}
                        disabled={isEndTest}
                        onClick={() => {
                          answeredMultiple.current[index] = true
                          handleNext(index, refMultiple, answeredMultiple.current, 'multiple')
                          handleSelectAnswer(items.id, 'multiple', v, items.source, refMultiple.current[index])
                        }}
                        className={getButtonStyle(isSelected, isEndTest, userAnswer?.isCorrect, v === items.source)}
                      >
                        {v}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      {/* chế độ tự luận */}

      {isTestEssay &&
        dividedData.essay.map((items, index) => {
          indexNumberNow += 1
          const userAnswer = userAnswers.find((a) => a.id === items.id && a.mode === 'essay')
          return (
            <div
              key={items.id}
              ref={(el) => {
                refEssay.current[index] = el
              }}
              className='relative w-full shadow-lg border-t-3 border-gray-100 rounded-2xl py-7 px-8 min-h-120 flex flex-col justify-between '
            >
              <div className='text-gray-400 text-sm absolute right-6 top-6'>
                {indexNumberNow}/{ORIGINAL_DATA.length}
              </div>
              <div className=''>
                <p className='font-semibold text-gray-500 text-sm mb-10'>Định nghĩa</p>
                <p className='text-xl'>{items.target}</p>
              </div>
              <div className='mt-5 '>
                <p className={getFeedbackClass(isEndTest, userAnswer?.isCorrect)}>
                  {getFeedbackText('essay', isEndTest, userAnswer?.isCorrect, items.id)}
                </p>
                <input
                  type='text'
                  disabled={isEndTest}
                  ref={(el) => {
                    refInputEssay.current[index] = el
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (e.currentTarget.value.trim() !== '') {
                        answeredEssay.current[index] = true
                      }

                      handleNext(index, refEssay, answeredEssay.current, 'essay')
                      handleSelectAnswer(
                        items.id,
                        'essay',
                        e.currentTarget.value.trim().toLowerCase(),
                        items.source.trim().toLowerCase(),
                        refEssay.current[index]
                      )
                    }
                  }}
                  placeholder='Nhập đáp án của bạn'
                  className={`w-full font-semibold bg-gray-100 rounded-md px-2 py-3 placeholder-gray-400 placeholder:font-semibold mt-5 focus:outline-blue-300 focus:bg-white border-none`}
                />
                <div className={`flex justify-end ${isEndTest ? '' : 'mt-3'}`}>
                  <Button
                    className={`px-4 py-3 text-sm font-semibold ${dividedData.essay.length - 1 === index ? 'invisible' : ''} ${isEndTest ? 'invisible' : ''}`}
                    onClick={() => {}}
                    rounded='rounded-4xl'
                  >
                    Tiếp
                  </Button>
                </div>
                <AnimatePresence>
                  {userAnswer?.isCorrect === false && isEndTest && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className='text-start'
                    >
                      <p className='mb-2 text-green-700 font-semibold'>Đáp án đúng</p>
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                        className='text-gray-500 mt-4 text-lg'
                      >
                        <div className='border-2 border-dashed border-green-500 rounded-lg px-2 py-2 flex'>
                          <span>{items.source}</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
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
