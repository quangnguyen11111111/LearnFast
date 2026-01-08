import { AnimatePresence, motion } from 'framer-motion'
import MultipleChoise from '~/components/learnComponent/MultipleChoice'
import Essay from '~/components/learnComponent/Essay'
import ListTerm from '~/components/ListTerm'
import ProgressBar from '~/components/ProgressBar'
import imgEndLesson from '~/assets/EndLesson.png'
import Button from '~/components/button/Button'
import { useMixedLearning } from '~/features/mixedLearning/useMixedLearning'
import type { Question } from '~/features/mixedLearning/types'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { useNavigate, useSearchParams } from 'react-router'
import { useEffect, useMemo } from 'react'
import { getFileDetailThunk } from '~/features/api/file/fileThunk'
import Loading from '~/components/Loading'
import useProgressSync from '~/features/sync/useProgressSync'

// MultipleChoicePage (Refactor): sử dụng hook useMixedLearning để tập trung logic.
// Hook quản lý: status, dữ liệu từng chế độ, option, tiến độ, chuyển câu.
// UI chỉ render theo state và xử lý chuyển vòng khi ở ListTerm.
const MultipleChoicePage = () => {
  const initialData: Question[] = [
    { id: '1', source: 'Dog dog', target: 'Chó', status: 3, statusMode: 1 },
    { id: '0', source: 'Sun', target: 'Mặt trời', status: 3, statusMode: 1 },
    { id: '3', source: 'Water', target: 'Nước', status: 3, statusMode: 1 },
    { id: '4', source: 'Cat', target: 'Mèo', status: 3, statusMode: 1 },
    { id: '5', source: 'Moon', target: 'Mặt trăng', status: 3, statusMode: 1 }
  ]
  const dispatch = useAppDispatch()
  // Lấy thông tin user và trạng thái loading từ store
  // loading = true khi đang refreshToken, cần đợi hoàn thành
  const { user, loading: authLoading } = useAppSelector((state) => state.auth)
  //lấy fileID từ URL
  const [searchParams] = useSearchParams()
  const fileID = searchParams.get('fileId')

  // Kiểm tra xem có refreshToken không để quyết định có đợi auth hay không
  const hasRefreshToken = !!localStorage.getItem('refreshToken')

  // Lấy dữ liệu chi tiết file từ store
  const { fileDetail, loadingDetail } = useAppSelector((state) => state.file)

  useEffect(() => {
    // Logic gọi API:
    // - Nếu có refreshToken → đợi authLoading = false VÀ có user
    // - Nếu không có refreshToken (guest) → gọi ngay không cần user
    if (!fileID) return

    if (hasRefreshToken) {
      // Có refreshToken: đợi auth hoàn thành và có user mới gọi
      if (!authLoading && user?.userID) {
        dispatch(getFileDetailThunk({ fileID: fileID, userID: user.userID }))
      }
    } else {
      // Không có refreshToken (guest): gọi ngay không cần userID
      dispatch(getFileDetailThunk({ fileID: fileID }))
    }
  }, [fileID, dispatch, user?.userID, authLoading, hasRefreshToken])

  // Chuyển đổi fileDetail thành format cho các component
  const cardData = useMemo(() => {
    if (!fileDetail || fileDetail.length === 0) return []
    return fileDetail.map((item) => ({
      id: item.detailID,
      source: item.source,
      target: item.target,
      status: item.flashcardState,
      statusMode: item.quizState
    }))
  }, [fileDetail])

  // Loading spinner khi:
  // 1. Có refreshToken và đang chờ auth (authLoading)
  // 2. Đang tải file detail (loadingDetail)
  // 3. Chưa có dữ liệu fileDetail
  // Kiểm tra TRƯỚC khi gọi useMixedLearning để tránh hook chạy với mảng rỗng
  const isWaitingAuth = hasRefreshToken && authLoading
  if (isWaitingAuth || loadingDetail || !fileDetail || fileDetail.length === 0) {
    return <Loading text='Đang tải dữ liệu...' />
  }

  // Chỉ gọi component chính khi đã có dữ liệu
  return <MultipleChoiceContent cardData={cardData} fileID={fileID} userID={user?.userID || null} />
}

// Tách component chính ra để hook chỉ chạy khi có dữ liệu
const MultipleChoiceContent = ({
  cardData,
  fileID,
  userID
}: {
  cardData: Question[]
  fileID: string | null
  userID: string | null
}) => {
  const navigate = useNavigate()
  console.log('kiểm tra dữ liệu nguwoid dufg đưa vào dòng 103 trang MultipleChoicepage: ', cardData)

  // Hook đồng bộ tiến độ học tập lên server
  const { queueChange, queueBatchChanges, syncNow } = useProgressSync({
    fileID,
    userID,
    syncInterval: 10000, // 10 giây
    enabled: !!fileID && !!userID
  })

  // Callback khi statusMode thay đổi -> queue để sync
  // statusMode trong multiple choice tương ứng với quizState ở database
  const handleStatusModeChange = (questionId: string, newStatusMode: number) => {
    queueChange({
      detailID: questionId,
      quizState: newStatusMode // Sử dụng quizState cho multiple choice
    })
  }

  // Callback khi reset tất cả -> queue batch để sync
  const handleResetAll = (ids: string[]) => {
    const changes = ids.map((id) => ({
      detailID: id,
      quizState: 0 // Reset quizState về 0
    }))
    queueBatchChanges(changes)
    // Sync ngay lập tức khi reset
    syncNow()
  }

  const {
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
    ORIGINAL_DATA,
    resetData
  } = useMixedLearning({
    initialData: cardData,
    onStatusModeChange: handleStatusModeChange,
    onResetAll: handleResetAll
  })
  // Lắng nghe nút "Học lại" từ header để khởi động lại từ đầu
  useEffect(() => {
    if (!cardData || cardData.length === 0) return
    const handler = () => {
      resetData()
    }
    window.addEventListener('learn-restart', handler)
    return () => window.removeEventListener('learn-restart', handler)
  }, [cardData, resetData])
  // Phục vụ nút tiếp tục ở ListTerm.
  const batchSize = 6
  const computeRound = (idx: number) => Math.floor(idx / batchSize)
  const round = computeRound(indexMulti)
  const fetchQuestionsLocal = (data: Question[], r: number) => data.slice(r * batchSize, r * batchSize + batchSize)
  return (
    <div className='px-25 max-md:px-10 pb-5 flex flex-col justify-start relative'>
      {status === 'Multiple' && (
        <div>
          <ProgressBar current={numberQuestion} total={progressTotal} />
          <MultipleChoise
            ORIGINAL_DATA={dataMulti}
            handleNextQuestion={handleNextQuestionMultil}
            indexMulti={indexQuestion}
            option={option}
            isAnswered={isAnswered}
            setIsAnswered={setIsAnswered}
            isCorrect={isCorrect}
            setIsCorrect={setIsCorrect}
            selected={selected}
            setSelected={setSelected}
          />
          <AnimatePresence>
            {isAnswered && !isCorrect && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='fixed bottom-3 left-0 w-full flex justify-center z-50'
              >
                <div className='flex items-center justify-between bg-white px-8 py-3 w-[90%] max-w-2xl'>
                  <p className='text-gray-500 font-semibold max-md:hidden'>Ấn nút tiếp tục để sang câu tiếp theo</p>
                  <button
                    ref={buttonRef}
                    className='bg-blue-600 text-white font-semibold px-6 py-2 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition'
                    onClick={() => {
                      setSelected(null)
                      setIsAnswered(false)
                      setIsCorrect(null)
                      handleNextQuestionMultil(false)
                    }}
                  >
                    Tiếp tục
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {status === 'Essay' && (
        <div>
          <ProgressBar current={numberQuestion} total={progressTotal} />
          <Essay
            ORIGINAL_DATA={dataEssay}
            indexMulti={indexQuestion}
            valueInput={valueInput}
            isCorrect={isCorrect}
            setValueInput={setValueInput}
            handleNextQuestionEssay={handleNextQuestionEssay}
            setIsCorrect={setIsCorrect}
          />
          <AnimatePresence>
            {isCorrect === false && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='fixed bottom-0 left-0 w-full flex justify-center z-50'
              >
                <div className='flex items-center justify-between bg-white px-8 py-3 w-[90%] max-w-2xl'>
                  <p className='text-gray-500 font-semibold max-md:hidden'>Ấn nút tiếp tục để sang câu tiếp theo</p>
                  <button
                    ref={buttonRef}
                    className='bg-blue-600 text-white font-semibold px-6 py-2 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition focus:outline-none'
                    onClick={() => {
                      setIsCorrect(null)
                      setValueInput('')
                      handleNextQuestionEssay(false)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        setIsCorrect(null)
                        setValueInput('')
                        handleNextQuestionEssay(false)
                      }
                    }}
                  >
                    Tiếp tục
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {status === 'ListTerm' && (
        <div className='px-10 pb-10'>
          <div className='mb-3 text-3xl font-bold mt-5'>Tốt lắm, bạn đang tiến bộ đấy.</div>
          <ProgressBar current={numberQuestion} total={progressTotal} type='solid' />
          <div className='border-b-1 border-gray-300'></div>
          <ListTerm ORIGINAL_DATA={dataCorrect} />
          <AnimatePresence>
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className='fixed bottom-0 left-0 w-full flex justify-center z-50'
            >
              <div className='flex items-center justify-between bg-white px-8 py-3 w-[90%] max-w-2xl'>
                <p className='text-gray-500 font-semibold max-md:hidden'>Ấn nút tiếp tục để sang câu tiếp theo</p>
                <button
                  ref={buttonRef}
                  className='bg-blue-600 text-white font-semibold px-6 py-2 max-md:w-full rounded-full shadow-md hover:bg-blue-700 transition'
                  onClick={() => {
                    const prevBatchEssay = fetchQuestionsLocal(ORIGINAL_DATA, round - 1).filter(
                      (q) => q.statusMode === 1
                    ).length
                    const currentBatchEssay = fetchQuestionsLocal(ORIGINAL_DATA, round).filter(
                      (q) => q.statusMode === 1
                    ).length
                    if (prevBatchEssay > 0 || currentBatchEssay > 0) {
                      setStatus('Essay')
                    } else if (dataEssay.length === 0 && dataMulti.length === 0) {
                      setStatus('EndLesson')
                    } else {
                      setStatus('Multiple')
                    }
                  }}
                >
                  Tiếp tục
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {status === 'EndLesson' && (
        <div className='flex flex-col items-center justify-center'>
          <img src={imgEndLesson} alt='ảnh cúp hoàn thành' className='size-30 mt-15' />
          <div className='mt-20 text-2xl font-semibold '>Chúc mừng bạn đã hoàn thành học phần này</div>
          <p className='mt-2 text-xl'>Hãy thử thêm một vòng nữa để bạn có thể tập luyện thêm học phần</p>
          <div className='grid grid-cols-2 max-md:grid-cols-1 gap-5 mt-10'>
            <Button
              rounded='rounded-3xl'
              className='px-10 py-3 font-semibold'
              variant='secondary'
              onClick={() => navigate(`/learn-lesson/test?fileId=${fileID}`, { replace: true })}
            >
              Làm bài kiểm tra
            </Button>
            <Button rounded='rounded-3xl' className='px-10 py-3 font-semibold' onClick={() => resetData()}>
              Tiếp tục ôn luyện
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
export default MultipleChoicePage
