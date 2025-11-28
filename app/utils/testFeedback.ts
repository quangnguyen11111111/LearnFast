import type { Mode } from '~/features/test/types'

// getButtonStyle: Trả về lớp CSS cho nút đáp án tùy theo trạng thái đã chọn / kết thúc bài test / đúng sai
export const getButtonStyle = (
  isSelected: boolean,
  isEndTest: boolean,
  isCorrect?: boolean,
  isCorrectAnswer?: boolean
) => {
  const baseStyle = 'border-2 rounded-lg w-full px-3 py-4 text-start font-semibold transition-colors'

  if (isEndTest) {
    if (isSelected && isCorrect === true) return `${baseStyle} border-green-500 text-green-700`
    if (isSelected && isCorrect === false) return `${baseStyle} border-red-500 text-red-700`
    if (!isSelected && isCorrectAnswer) return `${baseStyle} border-green-500 border-dashed text-green-700`
    return `${baseStyle} border-gray-100 text-gray-400`
  }

  if (isSelected) return `${baseStyle} border-blue-400 bg-blue-50 text-blue-700`
  return `${baseStyle} border-gray-200 text-gray-600 hover:border-gray-400 cursor-pointer`
}

// getFeedbackText: Sinh thông điệp phản hồi cho từng câu dựa trên mode & trạng thái đúng sai
export const getFeedbackText = (
  mode: Mode,
  isEndTest: boolean,
  isUserCorrect: boolean | undefined,
  questionId: string
): string => {
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

  if (isUserCorrect) {
    const correctMessages = ['Chính xác!', 'Bạn đang tiến bộ từng ngày!']
    const hash = questionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const index = hash % correctMessages.length
    return correctMessages[index]
  }

  const wrongMessages = [
    'Chưa đúng, hãy cố gắng nhé!',
    'Đừng nản chí, học là một quá trình!',
    'Đừng lo, bạn vẫn đang học mà!'
  ]
  const hash = questionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const index = hash % wrongMessages.length
  return wrongMessages[index]
}

// getFeedbackClass: Trả về lớp màu chữ phù hợp theo trạng thái đúng sai / đã kết thúc bài test
export const getFeedbackClass = (isEndTest: boolean, isUserCorrect: boolean | undefined): string => {
  if (!isEndTest || isUserCorrect === undefined) {
    return 'font-semibold text-gray-600 text-sm'
  }
  return isUserCorrect ? 'font-semibold text-green-600 text-sm' : 'font-semibold text-red-600 text-sm'
}
