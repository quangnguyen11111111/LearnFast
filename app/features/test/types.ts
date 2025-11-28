export type Mode = 'trueFalse' | 'multiple' | 'essay'

export interface Question {
  id: string
  source: string
  target: string
  status: number
  statusMode: number
}

export interface TrueFalseItem extends Question {
  displayTarget: string
  isCorrect: boolean
}

export interface UserAnswer {
  id: string
  mode: Mode
  userAnswer: string | boolean
  isCorrect: boolean
  refDivMain: React.RefObject<HTMLDivElement | null> | HTMLDivElement | null
}

export interface DividedData {
  trueFalse: TrueFalseItem[]
  multiple: Question[]
  essay: Question[]
}
