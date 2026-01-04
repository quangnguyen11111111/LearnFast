import SetUpGame from '~/components/learnComponent/SetUpGame'
import type { Question, summaryItem } from '~/features/cardMatching/types'
import useCardMatching from '~/features/cardMatching/useCardMatching'
import imgCardMatching from '~/assets/match_hero.png'
import item from '~/assets/logo.png'
import imgSumary from '~/assets/permafetti.e8a628fc.svg'
import Button from '~/components/button/Button'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { getFileDetailThunk } from '~/features/api/file/fileThunk'
import Loading from '~/components/Loading'

const CardMatchingPage = () => {
  //lấy fileID từ URL
  const [searchParams] = useSearchParams()
  const fileID = searchParams.get('fileId')
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const userID = user?.userID
  useEffect(() => {
    if (fileID) {
      // Gọi thunk để lấy chi tiết file
      dispatch(getFileDetailThunk({ fileID: fileID }))
    }
  }, [fileID])

  // Lấy dữ liệu chi tiết file từ store
  const { fileDetail, loadingDetail, loadingTopUsers, topUsers, loadingUpdateTopUsers } = useAppSelector(
    (state) => state.file
  )

  // Chuẩn bị dữ liệu cho trò chơi ghép thẻ
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

  const {
    cardPairs,
    selectedIndices,
    matchedIds,
    shakeIndices,
    isSetUpGame,
    timeSubmit,
    handleSelect,
    handleSetUp,
    time,
    isSummaryOpen,
    resetGame
  } = useCardMatching(cardData, 6, userID, fileID ? fileID : undefined, 'pointCardMatching')
  if (loadingDetail || cardData.length === 0 || loadingTopUsers || loadingUpdateTopUsers) {
    return <Loading text='Đang tải dữ liệu...' />
  }

  return (
    <>
      {isSummaryOpen ? (
        <div className='flex flex-col items-center  bg-gray-100 min-h-[calc(100vh-75px)] max-lg:px-5'>
          <div className='w-full max-w-3xl mt-5 flex flex-col items-star gap-5 '>
            <div className='flex items-center gap-6 justify-between  '>
              <h1 className='font-bold text-4xl text-gray-800 max-w-[410px] max-md:text-3xl max-md:max-w-[300px] max-sm:text-2xl'>
                Bạn thật cừ! Liệu bạn có thể ghép nhanh hơn nữa
              </h1>
              <img src={imgSumary} alt='Summary' className='size-35 max-sm:size-30' />
            </div>
            <p className=' text-gray-600 text-lg font-semibold max-md:text-base'>
              Hãy thử đánh bại kỷ lục <span className='text-gray-700 font-bold  '>{time} giây</span> của bản thân.
            </p>
            <div className='max-sm:static max-sm:bg-gray-100 max-sm:flex-col fixed left-0 bottom-0 bg-white w-full flex justify-center p-3 gap-4'>
              <Button
                onClick={() => resetGame()}
                className='px-6 py-3 font-semibold text-[1rem] max-sm:order-2'
                rounded='rounded-4xl'
                variant='secondary'
              >
                Quay lại học phần
              </Button>
              <Button
                onClick={() => resetGame()}
                className='px-6 py-3 font-semibold text-[1rem] max-sm:order-1'
                rounded='rounded-4xl'
              >
                Chơi lại
              </Button>
            </div>
            <div className=''>
              <p className='font-bold text-gray-600 text-lg'>Top 10</p>
              <div className=''>
                {Array.isArray(topUsers) && topUsers.length > 0 ? (
                  topUsers.map((user, index) => (
                    <div
                      key={user.rank || index}
                      className='flex justify-between items-center bg-white px-5 py-3 rounded-lg mt-3 mb-2'
                    >
                      <div className='flex items-center gap-4'>
                        <p className={`text-sm font-semibold`}>{user.rank || index + 1}</p>
                        <img src={user.ownerAvatar || item} alt='' className='size-10 rounded-full' />
                        <p className='text-sm font-semibold max-w-50 truncate'>{user.ownerName || 'Người dùng'}</p>
                      </div>
                      <p className='text-sm font-semibold'>{user.pointCardMatching || 0} giây</p>
                    </div>
                  ))
                ) : (
                  <div className='text-center py-8 text-gray-500'>Chưa có dữ liệu bảng xếp hạng</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='max-h-screen h-[calc(100vh-75px)] w-full flex items-center justify-center bg-gray-50 relative'>
          {isSetUpGame && (
            <SetUpGame
              handleStartGame={handleSetUp}
              img={imgCardMatching}
              title='Card Matching Game'
              content='Ghép tất cả các thuật ngữ với định nghĩa của chúng càng nhanh càng tốt. Tránh ghép sai vì sẽ mất thêm thời gian!'
            />
          )}
          {!isSetUpGame && (
            <div
              className='w-full h-full grid grid-cols-3 gap-3 p-2 '
              style={{ maxWidth: '1200px', minHeight: '70vh' }}
            >
              {/* Bộ đếm thời gian */}
              <div className='absolute -top-5 left-1/2 translate-x-4/5 z-50 max-lg:-translate-x-1/2 max-lg:-top-10 text-gray-500 '>
                {' '}
                {timeSubmit}
                {time}
              </div>
              {cardPairs.map((card, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`  flex items-center justify-center h-[calc((100vh-9rem)/4)] w-full
                          border rounded-xl shadow text-center text-base font-medium
                          transition  cursor-pointer

                          ${matchedIds.has(card.id) ? 'shrink-hide' : ''}
                          ${selectedIndices.includes(idx) ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'}

                          ${shakeIndices.includes(idx) ? 'shake border-red-500 bg-red-100' : ''}`}
                  >
                    <span className=' w-full px-4 line-clamp-3' title={card.data}>
                      {card.data}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}
export default CardMatchingPage
