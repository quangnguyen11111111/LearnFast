import React, { use, useEffect, useMemo, useRef, useState } from 'react'
import { useBlocksGame } from '../../../../../features/blocksGame/useBlocksGame'
import { BlockPreview } from '../../../../../components/learnComponent/blocksGame/BlockPreview'
import { BlockGhost } from '../../../../../components/learnComponent/blocksGame/BlockGhost'
import { ScoreCard } from '~/components/learnComponent/blocksGame/ScoreCard'
import SetUpGame from '~/components/learnComponent/SetUpGame'
import { TrophyIcon, SquaresPlusIcon } from '@heroicons/react/24/solid'
import { useNavigate, useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { getFileDetailThunk, getBlockGamePointsThunk, updateGameProgressThunk } from '~/features/api/file/fileThunk'
import Loading from '~/components/Loading'

// BlocksGamePage: Trang chính chơi mini-game đặt block + chế độ hỏi đáp sau mỗi lượt dùng hết block.
// - Sử dụng hook useBlocksGame để quản lý toàn bộ logic (bảng, kéo thả, điểm, question mode).
// - Quản lý state answer cho phần hỏi đáp, auto focus input & nút đổi câu khi cần.
export default function BlocksGamePage() {
  //lấy fileID từ URL
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const fileID = searchParams.get('fileId')
  const dispatch = useAppDispatch()

  // Lấy thông tin user từ store
  const { user } = useAppSelector((state) => state.auth)

  // State lưu điểm tốt nhất từ API
  const [apiBestScore, setApiBestScore] = useState<number>(0)

  useEffect(() => {
    if (fileID) {
      // Gọi thunk để lấy chi tiết file
      dispatch(getFileDetailThunk({ fileID: fileID }))
    }
  }, [fileID])

  // Lấy điểm tốt nhất của người dùng khi vào trang
  useEffect(() => {
    if (fileID && user?.userID) {
      dispatch(getBlockGamePointsThunk({ userID: user.userID, fileID }))
        .unwrap()
        .then((res) => {
          if (res.data?.pointBlockGame) {
            setApiBestScore(res.data.pointBlockGame)
          }
        })
        .catch((err) => {
          console.error('Lỗi khi lấy điểm block game:', err)
        })
    }
  }, [fileID, user?.userID])

  // Lấy dữ liệu chi tiết file từ store
  const { fileDetail, loadingDetail, loadingUpdateTopUsers } = useAppSelector((state) => state.file)

  // Chuẩn bị dữ liệu cho trò chơi ghép thẻ
  const cardData = useMemo(() => {
    if (!fileDetail || fileDetail.length === 0) return []
    return fileDetail.map((item) => ({
      id: item.detailID,
      source: item.source,
      target: item.target
    }))
  }, [fileDetail])
  const {
    isSetUpGame,
    setIsSetUpGame,
    board,
    blocks,
    dragState,
    score,
    bestScore,
    setBestScore,
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
  } = useBlocksGame({ QUESTIONS: cardData, initialBestScore: apiBestScore })

  // Cập nhật điểm tốt nhất lên server khi điểm hiện tại vượt qua điểm tốt nhất
  useEffect(() => {
    if (score > apiBestScore && fileID && user?.userID) {
      // Cập nhật điểm mới lên server
      dispatch(
        updateGameProgressThunk({
          userID: user.userID,
          fileID,
          point: score,
          mode: 'pointBlockGame'
        })
      )
        .unwrap()
        .then(() => {
          // Cập nhật state apiBestScore để tránh gọi API liên tục
          setApiBestScore(score)
        })
        .catch((err) => {
          console.error('Lỗi khi cập nhật điểm:', err)
        })
    }
  }, [score, apiBestScore, fileID, user?.userID])

  // State quản lý input câu trả lời
  const [answer, setAnswer] = useState<string>('')
  // useEffect: Reset input khi trả lời đúng (delay) hoặc sai (xóa ngay)
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
  // useEffect: Focus input khi vào chế độ câu hỏi
  useEffect(() => {
    if (!questionMode) return

    const t = setTimeout(() => {
      refInput.current?.focus()
    }, 50)

    return () => clearTimeout(t)
  }, [questionMode, answerState, wrongAttempts])

  const refButtonChange = useRef<HTMLButtonElement>(null)
  // useEffect: Khi đáp án bị reveal (sai 3 lần) -> focus nút đổi câu hỏi
  useEffect(() => {
    if (answerState === 'revealed') {
      setTimeout(() => {
        refButtonChange.current?.focus()
      }, 50)
    }
  }, [answerState])

  if (isSetUpGame) {
    return (
      <div className='max-h-screen h-[calc(100vh-75px)] pt-10 bg-slate-50 px-4 text-slate-900'>
        <SetUpGame
          handleStartGame={() => setIsSetUpGame(false)}
          img={SquaresPlusIcon}
          isBlocksGame={true}
          instruct={true}
          title='Block Game'
          content='Trả lời đúng các câu hỏi để kiếm được các khối hình. Lấp đầy lưới trò chơi và kiếm điểm bằng cách hoàn thành các đường dọc và ngang'
        />
      </div>
    )
  }
  if (loadingDetail || cardData.length === 0) {
    return <Loading text='Đang tải dữ liệu...' />
  }
  return (
    <div className='max-h-screen h-[calc(100vh-75px)] pt-10 bg-slate-50 px-4 text-slate-900'>
      <div className='mx-auto flex max-w-6xl flex-col gap-10'>
        <div className='flex flex-col gap-10 lg:flex-row'>
          <aside className='flex w-full flex-col items-center gap-6 max-lg:gap-0 rounded-3xl p-6 backdrop-blur lg:w-[280px]'>
            {!questionMode && (
              <div className='flex w-full lg:flex-col max-lg:justify-center items-center gap-6'>
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

          <main className='relative flex-1 flex flex-col items-center'>
            <div className='rounded-3xl p-4' style={{ width: 'min(90vw, 520px)' }}>
              <div className='flex justify-between mb-4 px-1'>
                <div className='text-xl font-bold text-slate-800'>{score}</div>
                <div className='flex items-center gap-1 text-xl font-bold text-yellow-500'>
                  <TrophyIcon className='size-6' />
                  <span>{bestScore}</span>
                </div>
              </div>
              <div ref={boardRef} className={boardContainerClasses} style={{ gap: `${BOARD_GAP_PX}px` }}>
                {board.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const key = `${rowIndex}-${colIndex}`
                    const highlighted = highlightMap.has(key)
                    return (
                      <div
                        key={key}
                        data-cell={key}
                        className={`relative flex aspect-square w-full items-center justify-center rounded-xl border border-white/10 transition-all ${
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
            </div>

            {gameOver && (
              <div className='absolute inset-0 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur'>
                <div className='w-full max-w-sm rounded-3xl bg-white px-8 py-10 text-center shadow-2xl'>
                  <h3 className='text-2xl font-semibold text-slate-900'>Bạn không còn nước đi nào!</h3>
                  <p className='mt-2 text-sm text-slate-600'>Điểm số {score}</p>
                  <p className='mt-2 text-sm text-slate-600'>Điểm kỉ lục {bestScore}</p>
                  <div className='flex justify-center gap-4'>
                    <button
                      onClick={resetGame}
                      className='mt-6 inline-flex items-center justify-center rounded-full bg-gray-200 px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300'
                    >
                      Chơi lại
                    </button>
                    <button
                      onClick={() => {
                        navigate(-1)
                      }}
                      className='mt-6 inline-flex items-center justify-center rounded-full bg-blue-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-600'
                    >
                      Thử các chế độ khác
                    </button>
                  </div>
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

// Tiêu đề trang
export const meta = () => [{ title: 'Blocks Game - LearnFast' }]
