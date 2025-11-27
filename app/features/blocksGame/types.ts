export type Cell = { row: number; col: number }
export type BoardState = (string | null)[][]

export type BlockInstance = {
  id: string
  cells: Cell[]
  width: number
  height: number
  color: string
  used: boolean
}

export type DragState = {
  block: BlockInstance
  pointerOffset: { x: number; y: number }
  position: { x: number; y: number }
  pointerId: number
}

export type ClearState = { rows: number[]; cols: number[] }

export type MoveSummary = {
  points: number
  lines: number
  cells: number
}
