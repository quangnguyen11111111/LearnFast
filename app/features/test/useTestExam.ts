// useTestExam: Hook đóng gói toàn bộ logic bài kiểm tra (True/False, Multiple Choice, Essay)
// Mục tiêu:
// - Tách state & xử lý khỏi component trang để dễ bảo trì, tái sử dụng.
// - Quản lý dữ liệu chia theo chế độ, tiến trình, trả lời, kết thúc.
// - Cung cấp API rõ ràng cho UI: dữ liệu từng mode, hàm chọn đáp án, điều hướng câu, submit.
// Có thể mở rộng: thêm lưu kết quả server, phân trang, random seed.

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useTimer } from '~/utils/coutTime'
import { generateTrueFalseData, getRandomItems, getRandomOptions } from '~/utils/testUtils'
import type { Question, UserAnswer } from './types'

export interface UseTestExamOptions {
  initialData: Question[]
  defaultBatchSize?: number
  defaultModes?: { trueFalse?: boolean; multiple?: boolean; essay?: boolean }
}

export interface DividedData {
  trueFalse: ReturnType<typeof generateTrueFalseData>
  multiple: Question[]
  essay: Question[]
}

export interface UseTestExamResult {
  ORIGINAL_DATA: Question[]
  batchSize: number | string
  setBatchSize: (v: number | string) => void

  // Mode toggles
  isTestTrueFalse: boolean
  setIsTestTrueFalse: (v: boolean) => void
  isTestMultiple: boolean
  setIsTestMultiple: (v: boolean) => void
  isTestEssay: boolean
  setIsTestEssay: (v: boolean) => void
  countEnabled: number
  questionCountByMode: { trueFalse: number; essay: number; multiple: number }

  dividedData: DividedData
  multipleOptions: string[][]

  // Answers
  userAnswers: UserAnswer[]
  selectedAnswers: Record<string, string | boolean>
  handleSelectAnswer: (
    questionId: string,
    mode: 'trueFalse' | 'multiple' | 'essay',
    userAnswer: string | boolean,
    correctAnswer: string | boolean,
    refDivMain: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null
  ) => void

  // Progress & end state
  isEndTest: boolean
  handleSubmitEndTest: () => void

  // Timer
  formatTime: () => string
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void

  // Setup modal
  isOpenSetup: boolean
  setIsOpenSetup: (v: boolean) => void
  handleSubmitSetupTest: () => void

  // Summary sidebar
  isOpenSummary: boolean
  setIsOpenSummary: (v: boolean) => void

  // Navigation
  handleNext: (
    currentIndex: number,
    ref: React.RefObject<(HTMLDivElement | HTMLInputElement | null)[]>,
    answered: boolean[],
    mode: 'trueFalse' | 'multiple' | 'essay'
  ) => void

  // Refs for scrolling/focusing
  refTrueFalse: React.RefObject<(HTMLDivElement | null)[]>
  refMultiple: React.RefObject<(HTMLDivElement | null)[]>
  refEssay: React.RefObject<(HTMLDivElement | HTMLInputElement | null)[]>
  refInputEssay: React.RefObject<(HTMLInputElement | null)[]>
  refDivMain: React.RefObject<HTMLDivElement | null>
  refButtonSubmitTest: React.RefObject<HTMLButtonElement | null>

  // Answered arrays (mutable refs)
  answeredTrueFalse: React.MutableRefObject<boolean[]>
  answeredMultiple: React.MutableRefObject<boolean[]>
  answeredEssay: React.MutableRefObject<boolean[]>

  scrollToTop: () => void
}

export function useTestExam({
  initialData,
  defaultModes
}: UseTestExamOptions): UseTestExamResult {
  const [batchSize, setBatchSize] = useState<number | string>( (initialData.length >= 8 ? 8 : initialData.length)
  )
  useEffect(() => {
    setBatchSize(initialData.length >= 8 ? 8 : initialData.length)
  }, [initialData])

  // Original data (randomized subset based on batch size)
  const [ORIGINAL_DATA, setORIGINAL_DATA] = useState<Question[]>(getRandomItems(initialData, Number(batchSize)))

  // Mode toggles
  const [isTestTrueFalse, setIsTestTrueFalse] = useState<boolean>(defaultModes?.trueFalse ?? true)
  const [isTestMultiple, setIsTestMultiple] = useState<boolean>(defaultModes?.multiple ?? true)
  const [isTestEssay, setIsTestEssay] = useState<boolean>(defaultModes?.essay ?? true)
  const countEnabled = (isTestTrueFalse ? 1 : 0) + (isTestMultiple ? 1 : 0) + (isTestEssay ? 1 : 0)

  // Timer
  const { startTimer, stopTimer, resetTimer, formatTime } = useTimer()

  // Calc number per mode
  const questionCountByMode = useMemo(() => {
    const total = ORIGINAL_DATA.length
    const modes = [
      { key: 'trueFalse', enabled: isTestTrueFalse },
      { key: 'essay', enabled: isTestEssay },
      { key: 'multiple', enabled: isTestMultiple }
    ]
    const enabledModes = modes.filter((m) => m.enabled)
    const count = enabledModes.length
    if (count === 0) return { trueFalse: 0, essay: 0, multiple: 0 }
    const base = Math.floor(total / count)
    let remainder = total % count
    const result = {
      trueFalse: isTestTrueFalse ? base : 0,
      essay: isTestEssay ? base : 0,
      multiple: isTestMultiple ? base : 0
    }
    if (remainder > 0 && isTestMultiple) {
      result.multiple += 1
      remainder--
    }
    if (remainder > 0 && isTestEssay) {
      result.essay += 1
    }
    return result
  }, [ORIGINAL_DATA, isTestTrueFalse, isTestEssay, isTestMultiple])

  // Divide data by mode
  const dividedData = useMemo<DividedData>(() => {
    const { trueFalse, multiple, essay } = questionCountByMode
    let start = 0
    return {
      trueFalse: generateTrueFalseData(ORIGINAL_DATA.slice(start, start + trueFalse), ORIGINAL_DATA),
      multiple: ORIGINAL_DATA.slice(start + trueFalse, start + trueFalse + multiple),
      essay: ORIGINAL_DATA.slice(start + trueFalse + multiple, start + trueFalse + multiple + essay)
    }
  }, [ORIGINAL_DATA, questionCountByMode])

  // Options for multiple
  const multipleOptions = useMemo(() => {
    return dividedData.multiple.map((item) => getRandomOptions(item.source, initialData.map((i) => i.source)))
  }, [dividedData.multiple, initialData])

  // Answer management
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | boolean>>({})

  const handleSelectAnswer = (
    questionId: string,
    mode: 'trueFalse' | 'multiple' | 'essay',
    userAnswer: string | boolean,
    correctAnswer: string | boolean,
    refDivMain: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null
  ) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: userAnswer }))
    const isCorrect = userAnswer === correctAnswer
    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === questionId && a.mode === mode)
      const updated = { id: questionId, mode, userAnswer, isCorrect, refDivMain }
      if (existingIndex !== -1) {
        const next = [...prev]
        next[existingIndex] = updated
        return next
      }
      return [...prev, updated]
    })
  }

  const [isEndTest, setIsEndTest] = useState(false)

  // Refs
  const refTrueFalse = useRef<(HTMLDivElement | null)[]>([])
  const refMultiple = useRef<(HTMLDivElement | null)[]>([])
  const refEssay = useRef<(HTMLInputElement | HTMLDivElement | null)[]>([])
  const refInputEssay = useRef<(HTMLInputElement | null)[]>([])
  const refDivMain = useRef<HTMLDivElement>(null)
  const refButtonSubmitTest = useRef<HTMLButtonElement>(null)

  // answered arrays
  const answeredTrueFalse = useRef<boolean[]>([])
  const answeredMultiple = useRef<boolean[]>([])
  const answeredEssay = useRef<boolean[]>([])

  useEffect(() => {
    answeredTrueFalse.current = new Array(dividedData.trueFalse.length).fill(false)
    answeredMultiple.current = new Array(dividedData.multiple.length).fill(false)
    answeredEssay.current = new Array(dividedData.essay.length).fill(false)
  }, [dividedData])

  // Navigation handleNext
  const handleNext = (
    currentIndex: number,
    ref: React.RefObject<(HTMLDivElement | HTMLInputElement | null)[]>,
    answered: boolean[],
    mode: 'trueFalse' | 'multiple' | 'essay'
  ) => {
    const jumpToNextUnanswered = (
      ref: React.RefObject<(HTMLDivElement | HTMLInputElement | null)[]>,
      answered: boolean[]
    ) => {
      const nextIndex = answered.findIndex((a) => !a)
      if (nextIndex !== -1 && ref.current[nextIndex]) {
        const next = ref.current[nextIndex]
        next.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (ref === refEssay) {
          setTimeout(() => refInputEssay.current[nextIndex]?.focus({ preventScroll: true }), 250)
        }
        return true
      }
      return false
    }
    let nextIndex = currentIndex + 1
    while (nextIndex < answered.length && answered[nextIndex]) nextIndex++
    if (nextIndex < answered.length) {
      const next = ref.current[nextIndex]
      if (next) {
        next.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (mode === 'essay') {
          setTimeout(() => refInputEssay.current[nextIndex]?.focus({ preventScroll: true }), 250)
        }
      }
      return
    }
    if (mode === 'trueFalse') {
      if (isTestMultiple && jumpToNextUnanswered(refMultiple, answeredMultiple.current)) return
      if (isTestEssay && jumpToNextUnanswered(refEssay, answeredEssay.current)) return
    } else if (mode === 'multiple') {
      if (isTestEssay && jumpToNextUnanswered(refEssay, answeredEssay.current)) return
    }
    refButtonSubmitTest.current?.focus()
  }

  // Submit test
  const [isOpenSummary, setIsOpenSummary] = useState(false)

  const handleSubmitEndTest = () => {
    const findFirstUnanswered = (
      ref: React.RefObject<(HTMLDivElement | HTMLInputElement | null)[]>,
      answered: boolean[]
    ) => {
      const index = answered.findIndex((a) => !a)
      if (index !== -1 && ref.current[index]) {
        const el = ref.current[index]
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (ref === refEssay) setTimeout(() => refInputEssay.current[index]?.focus({ preventScroll: true }), 250)
        return true
      }
      return false
    }
    if (
      (isTestTrueFalse && findFirstUnanswered(refTrueFalse, answeredTrueFalse.current)) ||
      (isTestMultiple && findFirstUnanswered(refMultiple, answeredMultiple.current)) ||
      (isTestEssay && findFirstUnanswered(refEssay, answeredEssay.current))
    ) {
      alert('⚠️ Bạn vẫn còn câu hỏi chưa trả lời!')
      return
    }
    setIsEndTest(true)
    stopTimer()
    setIsOpenSummary(true)
  }

  // Setup modal
  const [isOpenSetup, setIsOpenSetup] = useState(false)
  useEffect(() => {
    setIsOpenSetup(true)
  }, [])

  const handleSubmitSetupTest = useCallback(() => {
    resetTimer()
    startTimer()
    setIsOpenSetup(false)
    setIsEndTest(false)
    setIsOpenSummary(false)
    setUserAnswers([])
    setSelectedAnswers({})
    setORIGINAL_DATA(getRandomItems(initialData, Number(batchSize)))
  }, [initialData, batchSize, resetTimer, startTimer])

  const scrollToTop = () => {
    if (!refDivMain.current) return
    window.scrollTo({ top: refDivMain.current.offsetTop - 60, behavior: 'smooth' })
  }

  return {
    ORIGINAL_DATA,
    batchSize,
    setBatchSize,
    isTestTrueFalse,
    setIsTestTrueFalse,
    isTestMultiple,
    setIsTestMultiple,
    isTestEssay,
    setIsTestEssay,
    countEnabled,
    questionCountByMode,
    dividedData,
    multipleOptions,
    userAnswers,
    selectedAnswers,
    handleSelectAnswer,
    isEndTest,
    handleSubmitEndTest,
    formatTime,
    startTimer,
    stopTimer,
    resetTimer,
    isOpenSetup,
    setIsOpenSetup,
    handleSubmitSetupTest,
    isOpenSummary,
    setIsOpenSummary,
    handleNext,
    refTrueFalse,
    refMultiple,
    refEssay,
    refInputEssay,
    refDivMain,
    refButtonSubmitTest,
    answeredTrueFalse,
    answeredMultiple,
    answeredEssay,
    scrollToTop
  }
}

export type UseTestExamReturn = ReturnType<typeof useTestExam>
