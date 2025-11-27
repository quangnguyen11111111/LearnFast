import React, { useEffect, useRef, useState } from 'react'
import { useBlocksGame } from '../../../../../features/blocksGame/useBlocksGame'
import { BlockPreview } from '../../../../../components/learnComponent/blocksGame/BlockPreview'
import { BlockGhost } from '../../../../../components/learnComponent/blocksGame/BlockGhost'
import { ScoreCard } from '~/components/learnComponent/blocksGame/ScoreCard'

export default function BlocksGamePage() {
  const {
    board,
    blocks,
    dragState,
    score,
    bestScore,
    gameOver,
    poolCellSize,
    startDragging,
    resetGame,
    dragOverlayStyle,
    boardContainerClasses,
    highlightMap,
    boardRef,
    boardMetricsRef,
    BOARD_GAP_PX,
    // Q&A
    questionMode,
    currentQuestion,
    wrongAttempts,
    answerState,
    changeQuestion,
    submitAnswer
  } = useBlocksGame()
  const [answer, setAnswer] = useState<string>('')
  useEffect(() => {
    if (answerState === 'correct') {
      const timer = setTimeout(() => {
        setAnswer('')
      }, 700)
      return () => clearTimeout(timer)
    }

    if (answerState === 'wrong') {
      setAnswer('')
    }
  }, [answerState, wrongAttempts])

  const refInput = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!questionMode) return

    const t = setTimeout(() => {
      refInput.current?.focus()
    }, 50)

    return () => clearTimeout(t)
  }, [questionMode, answerState, wrongAttempts])

  const refButtonChange = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (answerState === 'revealed') {
      setTimeout(() => {
        refButtonChange.current?.focus()
      }, 50)
    }
  }, [answerState])

  return (
    <div className='max-h-screen h-[calc(100vh-75px)] pt-10 bg-slate-50 px-4 text-slate-900'>
      <div className='mx-auto flex max-w-6xl flex-col gap-10'>
        {/* <header className='flex flex-col gap-6 rounded-3xl bg-white/80 p-6 shadow-md backdrop-blur lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex flex-wrap items-center gap-4'>
            <ScoreCard label='Score' value={score} accent='bg-emerald-500' />
            <ScoreCard label='Best' value={bestScore} accent='bg-amber-500' />
            <button
              onClick={resetGame}
              className='rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-500'
            >
              New Game
            </button>
          </div>
        </header> */}

        <div className='flex flex-col gap-10 lg:flex-row'>
          <aside className='flex w-full flex-col items-center gap-6 rounded-3xl p-6 backdrop-blur lg:w-[280px]'>
            {!questionMode && (
              <div className='flex w-full flex-col items-center gap-6'>
                {blocks.map((block) => (
                  <BlockPreview
                    key={block.id}
                    block={block}
                    onPointerDown={(event) => startDragging(block, event)}
                    cellSize={poolCellSize}
                  />
                ))}
              </div>
            )}

            {questionMode && (
              <div className='w-full'>
                <div className='mb-4'>
                  <p className='text-sm text-gray-500'>Câu hỏi</p>
                  <p className='text-xl font-semibold mt-1'>{currentQuestion?.source}</p>
                </div>

                {/* Feedback message */}
                {answerState === 'wrong' && wrongAttempts < 3 && (
                  <p className='text-sm text-red-600 mb-2 font-medium'>Sai rồi! Còn {3 - wrongAttempts} lần thử.</p>
                )}
                {answerState === 'correct' && (
                  <p className='text-sm text-green-600 mb-2 font-medium'>Chính xác! Đang tạo block mới...</p>
                )}
                {answerState === 'revealed' && (
                  <p className='text-sm text-amber-600 mb-2 font-medium'>Bạn đã sai 3 lần. Hiển thị đáp án.</p>
                )}

                {answerState !== 'revealed' && (
                  <div>
                    <input
                      ref={refInput}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && answer.trim()) submitAnswer(answer)
                      }}
                      disabled={answerState === 'correct'}
                      className={`w-full rounded-xl border px-3 py-3 text-sm ${answerState === 'correct' ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}
                      placeholder='Nhập câu trả lời của bạn'
                    />
                    <div className='flex items-center gap-4 mt-3'>
                      <button
                        onClick={() => answer.trim() && submitAnswer(answer)}
                        disabled={!answer.trim() || answerState === 'correct'}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${!answer.trim() || answerState === 'correct' ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                      >
                        Trả lời
                      </button>
                      <button
                        onClick={() => {
                          changeQuestion()
                          setAnswer('')
                        }}
                        className='text-blue-600 text-sm font-semibold px-3 py-2 rounded-full hover:bg-blue-50'
                      >
                        Bạn không biết?
                      </button>
                    </div>
                  </div>
                )}

                {answerState === 'revealed' && (
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <span className='text-gray-600'>Đáp án đúng:</span>
                      <span className='font-semibold text-green-700'>{currentQuestion?.target}</span>
                    </div>
                    <button
                      ref={refButtonChange}
                      onClick={() => {
                        changeQuestion()
                        setAnswer('')
                      }}
                      className='w-full px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 outline-none'
                    >
                      Đổi câu hỏi
                    </button>
                  </div>
                )}
              </div>
            )}
          </aside>

          <main className='relative flex-1'>
            <div
              ref={boardRef}
              className={boardContainerClasses}
              style={{ gap: `${BOARD_GAP_PX}px`, width: 'min(90vw, 520px)' }}
            >
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const key = `${rowIndex}-${colIndex}`
                  const highlighted = highlightMap.has(key)
                  return (
                    <div
                      key={key}
                      data-cell={key}
                      className={`relative flex aspect-square w-full items-center justify-center rounded-xl border border-white/40 transition-all ${
                        cell ? '' : 'bg-white/90'
                      } ${highlighted ? 'ring-2 ring-amber-400' : ''}`}
                      style={{
                        backgroundColor: cell ?? undefined
                      }}
                    />
                  )
                })
              )}
            </div>

            {gameOver && (
              <div className='absolute inset-0 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur'>
                <div className='w-full max-w-sm rounded-3xl bg-white px-8 py-10 text-center shadow-2xl'>
                  <h3 className='text-2xl font-semibold text-slate-900'>Game Over</h3>
                  <p className='mt-2 text-sm text-slate-600'>You scored {score} points.</p>
                  <button
                    onClick={resetGame}
                    className='mt-6 inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400'
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {dragState && (
        <div className='pointer-events-none fixed left-0 top-0 z-50' style={dragOverlayStyle}>
          <BlockGhost block={dragState.block} cellSize={boardMetricsRef.current.size} />
        </div>
      )}
    </div>
  )
}
