import { BOARD_SIZE, BLOCKS_PER_ROUND, COLOR_PALETTE, SHAPES } from './constants'
import { type BlockInstance, type BoardState, type Cell } from './types'

export const createEmptyBoard = (): BoardState => Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null))

export const randomId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)

export const randomColor = () => COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]

export const normalizeCells = (cells: Cell[]): Cell[] => {
  const minRow = Math.min(...cells.map((cell) => cell.row))
  const minCol = Math.min(...cells.map((cell) => cell.col))
  return cells.map((cell) => ({ row: cell.row - minRow, col: cell.col - minCol }))
}

export const instantiateBlock = (shape: Cell[]): BlockInstance => {
  const normalized = normalizeCells(shape)
  const width = Math.max(...normalized.map((cell) => cell.col)) + 1
  const height = Math.max(...normalized.map((cell) => cell.row)) + 1

  return {
    id: randomId(),
    cells: normalized,
    width,
    height,
    color: randomColor(),
    used: false
  }
}

export const generateBlockSet = (): BlockInstance[] =>
  Array.from({ length: BLOCKS_PER_ROUND }, () => instantiateBlock(SHAPES[Math.floor(Math.random() * SHAPES.length)]))

export const canPlaceBlock = (board: BoardState, block: BlockInstance, baseRow: number, baseCol: number): boolean =>
  block.cells.every((cell) => {
    const row = baseRow + cell.row
    const col = baseCol + cell.col
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] === null
  })

export const applyPlacement = (
  board: BoardState,
  block: BlockInstance,
  baseRow: number,
  baseCol: number
): { board: BoardState; clearedRows: number[]; clearedCols: number[] } => {
  const draft = board.map((row) => [...row])

  block.cells.forEach((cell) => {
    const row = baseRow + cell.row
    const col = baseCol + cell.col
    draft[row][col] = block.color
  })

  const filledRows: number[] = []
  const filledCols: number[] = []

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    if (draft[row].every((value) => value !== null)) {
      filledRows.push(row)
    }
  }

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    let full = true
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      if (draft[row][col] === null) {
        full = false
        break
      }
    }
    if (full) {
      filledCols.push(col)
    }
  }

  filledRows.forEach((row) => {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      draft[row][col] = null
    }
  })

  filledCols.forEach((col) => {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      draft[row][col] = null
    }
  })

  return { board: draft, clearedRows: filledRows, clearedCols: filledCols }
}

export const hasAnyValidPlacement = (board: BoardState, blocks: BlockInstance[]): boolean =>
  blocks
    .filter((block) => !block.used)
    .some((block) => {
      for (let row = 0; row < BOARD_SIZE; row += 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
          if (canPlaceBlock(board, block, row, col)) {
            return true
          }
        }
      }
      return false
    })

export const computeScore = (cellsPlaced: number, linesCleared: number): number => {
  const placementPoints = cellsPlaced * 10
  if (linesCleared === 0) {
    return placementPoints
  }
  const linePoints = linesCleared * 120
  const comboBonus = linesCleared > 1 ? (linesCleared - 1) * 150 : 0
  return placementPoints + linePoints + comboBonus
}
