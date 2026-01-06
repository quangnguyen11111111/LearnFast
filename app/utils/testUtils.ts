import type { Question, TrueFalseItem } from '~/features/test/types'

// shuffleArray: Trộn mảng theo thuật toán Fisher-Yates, trả về bản sao đã trộn
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// getRandomItems: Lấy ngẫu nhiên x phần tử từ mảng câu hỏi đầu vào
export function getRandomItems(arr: Question[], x: number): Question[] {
  const shuffled = shuffleArray(arr)
  return shuffled.slice(0, x)
}

// getRandomOptions: Tạo danh sách lựa chọn (1 đúng + tối đa 3 sai) cho câu trắc nghiệm
export const getRandomOptions = (correct: string, allSources: string[]): string[] => {
  const options = [correct]
  // Lọc ra các source duy nhất khác với đáp án đúng
  const uniqueSources = [...new Set(allSources)].filter((s) => s !== correct)

  // Số lượng options tối đa có thể tạo (tối đa 4, bao gồm đáp án đúng)
  const maxOptions = Math.min(4, uniqueSources.length + 1)

  // Thêm các options ngẫu nhiên cho đến khi đủ số lượng
  while (options.length < maxOptions && uniqueSources.length > 0) {
    const randomIndex = Math.floor(Math.random() * uniqueSources.length)
    options.push(uniqueSources[randomIndex])
    uniqueSources.splice(randomIndex, 1) // Xóa để tránh trùng lặp
  }

  return options.sort(() => Math.random() - 0.5)
}

// generateTrueFalseData: Sinh dữ liệu dạng Đúng/Sai dựa trên tỉ lệ trueRatio
// - Nếu đúng: hiển thị target thật
// - Nếu sai: thay target bằng target của câu hỏi khác trong pool
export const generateTrueFalseData = (data: Question[], pool: Question[], trueRatio = 0.4): TrueFalseItem[] => {
  return data.map((item) => {
    const isCorrect = Math.random() < trueRatio
    if (isCorrect) {
      return { ...item, displayTarget: item.target, isCorrect: true }
    }

    const wrongOptions = pool.filter((d) => d.id !== item.id)
    const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
    return { ...item, displayTarget: randomWrong.target, isCorrect: false }
  })
}
