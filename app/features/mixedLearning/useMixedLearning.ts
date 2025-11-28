// useMixedLearning: Hook gom toàn bộ logic cho quy trình học nhiều chế độ (Trắc nghiệm -> Tự luận -> Ôn lại -> Kết thúc).
// Mục tiêu:
// - Tách state & xử lý khỏi component trang, giúp tái sử dụng/hạn chế lặp lại.
// - Quản lý tiến độ thông qua statusMode của từng Question.
// - Cung cấp API rõ ràng: dữ liệu mỗi chế độ, tiến độ, thao tác chuyển câu.
// Thiết kế:
// - initialData: nguồn dữ liệu thô được đẩy vào hook (mỗi item có statusMode để nhận biết giai đoạn).
// - batchSize: số phần tử trong mỗi "vòng" (round) học để chia nhỏ nội dung (mặc định 6).
// - Round được tính dựa trên số câu trắc nghiệm đã xử lý (indexMulti / batchSize).
// Luồng chuyển trạng thái:
//   Multiple (statusMode=0) => đúng chuyển sang Essay (statusMode=1) => đúng chuyển sang ListTerm (statusMode=2).
//   Khi hết câu ở một chế độ hoặc đủ điều kiện (đủ batch) thì chuyển sang chế độ tiếp theo.
// Ghi chú mở rộng:
// - Có thể bổ sung thuật toán lặp lại theo khoảng cách (Spaced Repetition) bằng cách dùng thêm trường 'status'.
// - Có thể tách phần sinh option trắc nghiệm ra util riêng nếu muốn test độc lập.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Question } from './types'

export interface UseMixedLearningOptions {
  initialData: Question[] // Mảng câu hỏi đầu vào.
  batchSize?: number // Kích thước 1 vòng học (default: 6).
}

export interface UseMixedLearningResult {
  status: string // Chế độ hiện tại: Multiple | Essay | ListTerm | EndLesson.
  numberQuestion: number // Tổng số câu đã trả lời đúng (tích lũy qua các chế độ).
  indexQuestion: number // Chỉ số câu hiện tại trong mảng đang hiển thị.
  indexEssay: number // Số câu đã hoàn tất ở Essay.
  indexMulti: number // Số câu đã hoàn tất ở Multiple.
  dataMulti: Question[] // Danh sách câu ở chế độ Trắc nghiệm (statusMode=0).
  dataEssay: Question[] // Danh sách câu ở chế độ Tự luận (statusMode=1).
  dataCorrect: Question[] // Danh sách câu đã đạt (statusMode!=0) để hiển thị ở ListTerm.
  option: string[] // Tập các lựa chọn trắc nghiệm cho câu hiện tại.
  isAnswered: boolean // Đã chọn đáp án ở Multiple.
  isCorrect: boolean | null // Kết quả câu trả lời gần nhất (true/false/null).
  selected: string | null // Lựa chọn người dùng tại Multiple.
  valueInput: string // Giá trị nhập vào ở Essay.
  setSelected: (v: string | null) => void // Setter expose cho component con.
  setValueInput: (v: string) => void // Setter cho input Essay.
  setIsAnswered: (v: boolean) => void // Đánh dấu đã trả lời Multiple.
  setIsCorrect: (v: boolean | null) => void // Cập nhật trạng thái đúng sai.
  setStatus: (v: string) => void // Thay đổi chế độ thủ công (trường hợp đặc biệt / nút tiếp tục).
  handleNextQuestionMultil: (correct: boolean) => void // Xử lý chuyển câu ở Multiple.
  handleNextQuestionEssay: (correct: boolean) => void // Xử lý chuyển câu ở Essay.
  progressTotal: number // Tổng mốc tiến độ (logic hiện tại = ORIGINAL_DATA.length * 2).
  buttonRef: React.RefObject<HTMLButtonElement | null> // Ref nút tiếp tục để focus.
  ORIGINAL_DATA: Question[] // Dữ liệu gốc cập nhật dần theo statusMode.
}

// fetchQuestions: Trích ra một batch (mặc định 6 câu) theo round hiện tại.
// round * batchSize = điểm bắt đầu, end = start + batchSize.
function fetchQuestions(data: Question[], round: number, batchSize: number): Question[] {
  const start = round * batchSize
  const end = start + batchSize
  return data.slice(start, end)
}

// getRandomOptions: Sinh mảng lựa chọn cho trắc nghiệm gồm 1 đáp án đúng + 3 đáp án nhiễu.
// Logic đơn giản: push đến khi đủ 4 rồi shuffle.
function getRandomOptions(correct: string, allTargets: string[]): string[] {
  const options = [correct]
  while (options.length < 4) {
    const random = allTargets[Math.floor(Math.random() * allTargets.length)]
    if (!options.includes(random)) options.push(random)
  }
  return options.sort(() => Math.random() - 0.5)
}

// getRound: Tính round dựa trên số câu đã hoàn thành ở Multiple (indexMulti).
// Mỗi batchSize câu đúng ở Multiple tương ứng tăng 1 round.
function getRound(indexMulti: number, batchSize: number): number {
  return Math.floor(indexMulti / batchSize)
}

export function useMixedLearning({ initialData, batchSize = 6 }: UseMixedLearningOptions): UseMixedLearningResult {
  // ORIGINAL_DATA: trạng thái gốc của toàn bộ câu hỏi, được cập nhật statusMode nội bộ.
  const [ORIGINAL_DATA, setORIGINAL_DATA] = useState<Question[]>(initialData)

  // indexEssay: số câu đã đạt essay (statusMode=2).
  const [indexEssay, setIndexEssay] = useState<number>(initialData.filter((q) => q.statusMode === 2).length)
  // indexMulti: số câu đã qua trắc nghiệm thành công (statusMode=1) + indexEssay (đã lên essay).
  const [indexMulti, setIndexMulti] = useState<number>(
    initialData.filter((q) => q.statusMode === 1).length + indexEssay
  )
  // numberQuestion: tổng số câu đúng tích lũy (Multiple + Essay) để hiển thị tiến độ.
  const [numberQuestion, setNumberQuestion] = useState<number>(indexMulti + indexEssay)

  // status: chế độ học hiện tại, khởi tạo ở Multiple.
  const [status, setStatus] = useState<string>('Multiple')
  // round: xác định batch hiện tại dựa vào chế độ (Essay dùng indexEssay để không nhảy batch sớm).
  const round = useMemo(
    () => getRound(status === 'Essay' ? indexEssay : indexMulti, batchSize),
    [status, indexMulti, indexEssay, batchSize]
  )

  // selected: lựa chọn đã pick ở Multiple.
  const [selected, setSelected] = useState<string | null>(null)
  // isAnswered: đã trả lời câu multiple hiện tại chưa.
  const [isAnswered, setIsAnswered] = useState(false)
  // isCorrect: kết quả gần nhất (null khi reset).
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // dataMulti: các câu ở chế độ Multiple (statusMode=0) thuộc batch hiện tại.
  const [dataMulti, setDataMulti] = useState<Question[]>(
    fetchQuestions(ORIGINAL_DATA, round, batchSize).filter((q) => q.statusMode === 0)
  )
  // dataEssay: các câu chuyển sang Essay (statusMode=1) ở batch trước.
  const [dataEssay, setDataEssay] = useState<Question[]>(
    fetchQuestions(ORIGINAL_DATA, round - 1, batchSize).filter((q) => q.statusMode === 1)
  )
  // dataCorrect: tập hợp các câu đã qua ít nhất một chế độ (statusMode!=0) để hiển thị ôn lại.
  const [dataCorrect, setDataCorrect] = useState<Question[]>(
    fetchQuestions(ORIGINAL_DATA, round - 1, batchSize).filter((q) => q.statusMode !== 0)
  )

  // indexQuestion: chỉ số câu hiện tại trong mảng chế độ đang hiển thị.
  const [indexQuestion, setIndexQuestion] = useState(0)
  // valueInput: giá trị người dùng nhập ở Essay.
  const [valueInput, setValueInput] = useState('')

  const buttonRef = useRef<HTMLButtonElement | null>(null)

  // Effect: tự động focus nút "Tiếp tục" nếu trả lời sai để tăng tốc thao tác.
  useEffect(() => {
    if (!isCorrect && buttonRef.current && (status === 'Multiple' || status === 'Essay' || status === 'ListTerm')) {
      buttonRef.current.focus()
    }
  }, [isCorrect, status])

  // Effect khởi tạo: xác định chế độ ban đầu dựa trên dữ liệu hiện có.
  useEffect(() => {
    if (numberQuestion % batchSize === 0 && numberQuestion !== 0) {
      setStatus('ListTerm')
    } else if (fetchQuestions(ORIGINAL_DATA, round - 1, batchSize).filter((q) => q.statusMode === 2).length > 0) {
      setStatus('Essay')
    } else {
      setStatus('Multiple')
    }
  }, [])

  // allTargets: danh sách tất cả đáp án đúng (target) dùng để sinh lựa chọn nhiễu.
  const allTargets = ORIGINAL_DATA.map((q) => q.target)
  // option (đã sửa): Sinh 4 đáp án ngẫu nhiên nhưng giữ ổn định theo từng câu hỏi.
  // Tác dụng: Tránh việc mỗi lần người dùng chọn/đổi trạng thái thì danh sách 4 đáp án lại bị random lại.
  // Cách làm: Cache kết quả theo 'id' câu hỏi bằng Map; nếu đã có thì dùng lại, nếu chưa có thì sinh mới và lưu.
  const [optionsMap, setOptionsMap] = useState<Map<string, string[]>>(new Map())
  const option = useMemo(() => {
    const q = dataMulti[indexQuestion]
    if (!q) return []
    const cached = optionsMap.get(q.id)
    if (cached) return cached
    const generated = getRandomOptions(q.target, allTargets)
    setOptionsMap((prev) => {
      const next = new Map(prev)
      next.set(q.id, generated)
      return next
    })
    return generated
  }, [indexQuestion, dataMulti, allTargets, optionsMap])

  // handleNextQuestionMultil: xử lý sau khi chọn đáp án ở Multiple.
  // - correct=true: cập nhật câu sang statusMode=1, chuyển sang danh sách essay và ghi nhận tiến độ.
  // - correct=false: đưa câu sai xuống cuối mảng để lặp lại.
  const handleNextQuestionMultil = useCallback(
    (correct: boolean) => {
      if (correct) {
        setIndexMulti((v) => v + 1)
        setNumberQuestion((v) => v + 1)
        setDataEssay((prev) => [...prev, dataMulti[indexQuestion]])
        setDataCorrect((prev) => [...prev, dataMulti[indexQuestion]])
        const current = dataMulti[indexQuestion]
        setORIGINAL_DATA((prev) => prev.map((q) => (q.id === current.id ? { ...q, statusMode: 1 } : q)))
        const remaining = dataMulti.filter((_, i) => i !== indexQuestion)
        setDataMulti(remaining)
        setSelected(null)
        setIsAnswered(false)
        setIsCorrect(null)
        if (remaining.length === 0) {
          setStatus('ListTerm')
        }
      } else {
        const wrong = dataMulti[indexQuestion]
        const remaining = dataMulti.filter((_, i) => i !== indexQuestion)
        setDataMulti([...remaining, wrong])
        setSelected(null)
        setIsAnswered(false)
        setIsCorrect(null)
      }
    },
    [dataMulti, indexQuestion]
  )

  // handleNextQuestionEssay: xử lý sau khi nhập đáp án ở Essay.
  // - correct=true: chuyển statusMode sang 2, loại khỏi danh sách essay, tăng tiến độ.
  // - correct=false: đưa câu xuống cuối để người học thử lại.
  const handleNextQuestionEssay = useCallback(
    (correct: boolean) => {
      if (correct) {
        const current = dataEssay[indexQuestion]
        setORIGINAL_DATA((prev) => prev.map((q) => (q.id === current.id ? { ...q, statusMode: 2 } : q)))
        setIndexEssay((v) => v + 1)
        setNumberQuestion((v) => v + 1)
        const remaining = dataEssay.filter((_, i) => i !== indexQuestion)
        setDataEssay(remaining)
        setIsCorrect(null)
        setValueInput('')
        if (remaining.length === 0) {
          setStatus('ListTerm')
        }
      } else {
        const wrong = dataEssay[indexQuestion]
        const remaining = dataEssay.filter((_, i) => i !== indexQuestion)
        setDataEssay([...remaining, wrong])
        setIsCorrect(null)
        setValueInput('')
      }
    },
    [dataEssay, indexQuestion]
  )

  // progressTotal: tổng mốc để thanh tiến độ (mỗi item coi như cần qua 2 bước: Multiple & Essay).
  const progressTotal = ORIGINAL_DATA.length * 2

  return {
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
  }
}

export type UseMixedLearningReturn = ReturnType<typeof useMixedLearning>
