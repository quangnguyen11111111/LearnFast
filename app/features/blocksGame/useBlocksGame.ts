import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { BOARD_GAP_PX, BOARD_SIZE, POOL_CELL_SIZE } from './constants'
import {
  applyPlacement,
  canPlaceBlock,
  computeScore,
  createEmptyBoard,
  generateBlockSet,
  hasAnyValidPlacement
} from './utils'
import { type BlockInstance, type BoardState, type ClearState, type DragState, type MoveSummary } from './types'
import { type Question } from './questions'

export function useBlocksGame({
  QUESTIONS,
  initialBestScore = 0
}: {
  QUESTIONS: Question[]
  initialBestScore?: number
}) {
  const [isSetUpGame, setIsSetUpGame] = useState<boolean>(true)
  const [board, setBoard] = useState<BoardState>(() => createEmptyBoard())
  const [blocks, setBlocks] = useState<BlockInstance[]>(() => generateBlockSet())
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(initialBestScore)
  const [gameOver, setGameOver] = useState(false)
  const [clearedLines, setClearedLines] = useState<ClearState>({ rows: [], cols: [] })
  const [moveSummary, setMoveSummary] = useState<MoveSummary | null>(null)
  const [boardMetrics, setBoardMetrics] = useState(() => ({
    size: 40,
    stepX: 40,
    stepY: 40,
    offsetX: 0,
    offsetY: 0
  }))
  const [poolCellSize, setPoolCellSize] = useState(POOL_CELL_SIZE)

  // Q&A mode states (activated when all 3 blocks are used)
  const [questionMode, setQuestionMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong' | 'revealed'>('idle')

  const boardRef = useRef<HTMLDivElement | null>(null)
  const boardStateRef = useRef(board)
  const blocksStateRef = useRef(blocks)
  const boardMetricsRef = useRef(boardMetrics)
  const questionsRef = useRef(QUESTIONS)

  // Cập nhật questionsRef khi QUESTIONS thay đổi
  useEffect(() => {
    questionsRef.current = QUESTIONS
  }, [QUESTIONS])

  // Cập nhật bestScore khi initialBestScore thay đổi (khi lấy được từ API)
  useEffect(() => {
    if (initialBestScore > 0) {
      setBestScore(initialBestScore)
    }
  }, [initialBestScore])

  useEffect(() => {
    boardStateRef.current = board
  }, [board])

  useEffect(() => {
    blocksStateRef.current = blocks
  }, [blocks])

  useEffect(() => {
    boardMetricsRef.current = boardMetrics
  }, [boardMetrics])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('dig-gold-best-score')
    if (stored) {
      const parsed = Number(stored)
      if (!Number.isNaN(parsed)) setBestScore(parsed)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('dig-gold-best-score', bestScore.toString())
  }, [bestScore])

  useEffect(() => {
    if (!moveSummary) return
    const timeout = window.setTimeout(() => setMoveSummary(null), 1800)
    return () => window.clearTimeout(timeout)
  }, [moveSummary])

  useEffect(() => {
    if (!clearedLines.rows.length && !clearedLines.cols.length) return
    const timeout = window.setTimeout(() => setClearedLines({ rows: [], cols: [] }), 400)
    return () => window.clearTimeout(timeout)
  }, [clearedLines])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 420) setPoolCellSize(26)
      else if (width < 640) setPoolCellSize(32)
      else if (width < 1024) setPoolCellSize(36)
      else setPoolCellSize(POOL_CELL_SIZE)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const updateBoardMetrics = useCallback(() => {
    if (!boardRef.current || typeof window === 'undefined') return
    const boardRect = boardRef.current.getBoundingClientRect()
    const firstCell = boardRef.current.querySelector('[data-cell="0-0"]') as HTMLElement | null
    if (!firstCell) return
    const firstRect = firstCell.getBoundingClientRect()
    const size = firstRect.width || 40
    const offsetX = firstRect.left - boardRect.left
    const offsetY = firstRect.top - boardRect.top

    let stepX = size
    let stepY = size

    const rightCell = boardRef.current.querySelector('[data-cell="0-1"]') as HTMLElement | null
    if (rightCell) {
      const rightRect = rightCell.getBoundingClientRect()
      const delta = rightRect.left - firstRect.left
      if (delta > 0) stepX = delta
    }

    const bottomCell = boardRef.current.querySelector('[data-cell="1-0"]') as HTMLElement | null
    if (bottomCell) {
      const bottomRect = bottomCell.getBoundingClientRect()
      const delta = bottomRect.top - firstRect.top
      if (delta > 0) stepY = delta
    }

    setBoardMetrics({ size, stepX: stepX || size, stepY: stepY || size, offsetX, offsetY })
  }, [])

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    updateBoardMetrics()
    window.addEventListener('resize', updateBoardMetrics)
    return () => window.removeEventListener('resize', updateBoardMetrics)
  }, [updateBoardMetrics])

  // Cập nhật boardMetrics khi board được mount (sau khi tắt setup screen)
  useLayoutEffect(() => {
    if (!isSetUpGame && boardRef.current) {
      // Delay nhỏ để đảm bảo DOM đã render xong
      const timer = setTimeout(() => {
        updateBoardMetrics()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isSetUpGame, updateBoardMetrics])

  const finalizeDrop = useCallback((drag: DragState, clientX: number, clientY: number) => {
    if (!boardRef.current) return
    const activeBlocks = blocksStateRef.current
    const activeBlock = activeBlocks.find((item) => item.id === drag.block.id)
    if (!activeBlock || activeBlock.used) return

    const boardRect = boardRef.current.getBoundingClientRect()
    const { size, stepX, stepY, offsetX, offsetY } = boardMetricsRef.current
    const effectiveStepX = stepX || size
    const effectiveStepY = stepY || size
    const topLeftX = clientX - drag.pointerOffset.x
    const topLeftY = clientY - drag.pointerOffset.y
    const anchorX = topLeftX - boardRect.left - offsetX
    const anchorY = topLeftY - boardRect.top - offsetY
    const targetCol = Math.floor((anchorX + effectiveStepX / 2) / effectiveStepX)
    const targetRow = Math.floor((anchorY + effectiveStepY / 2) / effectiveStepY)

    if (!canPlaceBlock(boardStateRef.current, activeBlock, targetRow, targetCol)) return

    const {
      board: nextBoard,
      clearedRows,
      clearedCols
    } = applyPlacement(boardStateRef.current, activeBlock, targetRow, targetCol)

    const clearedTotal = clearedRows.length + clearedCols.length
    const gainedPoints = computeScore(activeBlock.cells.length, clearedTotal)

    setBoard(nextBoard)
    setClearedLines({ rows: clearedRows, cols: clearedCols })
    setScore((prev) => {
      const updated = prev + gainedPoints
      setBestScore((best) => (updated > best ? updated : best))
      return updated
    })
    setMoveSummary({ points: gainedPoints, lines: clearedTotal, cells: activeBlock.cells.length })

    const updatedBlocks = activeBlocks.map((block) => (block.id === activeBlock.id ? { ...block, used: true } : block))
    const allUsed = updatedBlocks.every((block) => block.used)

    // If all 3 blocks are used, enter question mode instead of generating new blocks immediately
    if (allUsed) {
      setBlocks(updatedBlocks)
      // Pick a random question from current questions data
      const questions = questionsRef.current
      if (questions && questions.length > 0) {
        const random = questions[Math.floor(Math.random() * questions.length)]
        setCurrentQuestion(random)
        setWrongAttempts(0)
        setQuestionMode(true)
      }
      // Do not evaluate game over yet; new blocks will be generated after answering correctly
    } else {
      setBlocks(updatedBlocks)
      const stillPlayable = hasAnyValidPlacement(nextBoard, updatedBlocks)
      setGameOver(!stillPlayable)
    }
  }, [])

  const handlePointerMove = useCallback((event: PointerEvent) => {
    setDragState((prev) => (prev ? { ...prev, position: { x: event.clientX, y: event.clientY } } : prev))
  }, [])

  const handlePointerUp = useCallback(
    (event: PointerEvent) => {
      setDragState((prev) => {
        if (!prev) return prev
        finalizeDrop(prev, event.clientX, event.clientY)
        return null
      })
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    },
    [finalizeDrop, handlePointerMove]
  )

  useEffect(
    () => () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    },
    [handlePointerMove, handlePointerUp]
  )

  const startDragging = useCallback(
    (block: BlockInstance, event: React.PointerEvent<HTMLDivElement>) => {
      if (block.used || gameOver) return
      event.preventDefault()
      event.stopPropagation()
      const rect = event.currentTarget.getBoundingClientRect()
      const offset = { x: event.clientX - rect.left, y: event.clientY - rect.top }
      setDragState({
        block,
        pointerOffset: offset,
        position: { x: event.clientX, y: event.clientY },
        pointerId: event.pointerId
      })
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    },
    [gameOver, handlePointerMove, handlePointerUp]
  )

  const resetGame = useCallback(() => {
    setDragState(null)
    setBoard(createEmptyBoard())
    setBlocks(generateBlockSet())
    setScore(0)
    setGameOver(false)
    setClearedLines({ rows: [], cols: [] })
    setMoveSummary(null)
    // Reset Q&A state
    setQuestionMode(false)
    setCurrentQuestion(null)
    setWrongAttempts(0)
    setAnswerState('idle')
  }, [])

  const dragOverlayStyle: CSSProperties | undefined = useMemo(() => {
    if (!dragState) return undefined
    return {
      transform: `translate(${dragState.position.x - dragState.pointerOffset.x}px, ${dragState.position.y - dragState.pointerOffset.y}px)`
    }
  }, [dragState])

  const boardContainerClasses = useMemo(
    () => 'mx-auto grid grid-cols-10 rounded-3xl bg-slate-200 px-3 py-4 shadow-xl sm:px-5',
    []
  )

  const highlightMap = useMemo(() => {
    const map = new Map<string, boolean>()
    clearedLines.rows.forEach((row) => {
      for (let col = 0; col < BOARD_SIZE; col += 1) map.set(`${row}-${col}`, true)
    })
    clearedLines.cols.forEach((col) => {
      for (let row = 0; row < BOARD_SIZE; row += 1) map.set(`${row}-${col}`, true)
    })
    return map
  }, [clearedLines])

  // Question helpers
  const changeQuestion = useCallback(() => {
    const questions = questionsRef.current
    if (questions && questions.length > 0) {
      const random = questions[Math.floor(Math.random() * questions.length)]
      setCurrentQuestion(random)
      setWrongAttempts(0)
      setAnswerState('idle')
    }
  }, [])

  const submitAnswer = (value: string) => {
    if (!questionMode || !currentQuestion) return
    const normalizedInput = value.trim().toLowerCase()
    const normalizedAnswer = currentQuestion.target.trim().toLowerCase()
    const isCorrect = normalizedInput === normalizedAnswer

    if (isCorrect) {
      // Show correct state briefly then exit question mode
      setAnswerState('correct')
      setTimeout(() => {
        const newBlocks = generateBlockSet()
        setBlocks(newBlocks)
        setQuestionMode(false)
        setCurrentQuestion(null)
        setWrongAttempts(0)
        setAnswerState('idle')
        // After generating, check playability with the current board
        const stillPlayable = hasAnyValidPlacement(boardStateRef.current, newBlocks)
        setGameOver(!stillPlayable)
      }, 800)
    } else {
      setWrongAttempts((prev) => {
        const next = prev + 1
        if (next >= 3) {
          setAnswerState('revealed')
        } else {
          setAnswerState('wrong')
        }

        return next
      })
    }
  }

  return {
    isSetUpGame,
    setIsSetUpGame,
    board,
    blocks,
    dragState,
    score,
    bestScore,
    setBestScore,
    gameOver,
    clearedLines,
    moveSummary,
    poolCellSize,
    startDragging,
    resetGame,
    dragOverlayStyle,
    boardContainerClasses,
    highlightMap,
    boardRef,
    boardMetricsRef,
    BOARD_GAP_PX,
    // Q&A mode API
    questionMode,
    currentQuestion,
    wrongAttempts,
    answerState,
    changeQuestion,
    submitAnswer
  }
}

export type UseBlocksGameReturn = ReturnType<typeof useBlocksGame>
