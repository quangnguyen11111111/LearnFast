export interface Question {
  id: string
  source: string
  target: string
  status: number
  statusMode: number // 0: chưa học, 1: qua trắc nghiệm, 2: qua tự luận
}
