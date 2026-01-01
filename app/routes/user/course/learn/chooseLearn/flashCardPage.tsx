import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import Flashcard from '~/components/learnComponent/Flashcard'
import Loading from '~/components/Loading'
import { getFileDetailThunk } from '~/features/api/file/fileThunk'
import { useFlashcards } from '~/features/flashcard/useFlashcards'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import useProgressSync from '~/features/sync/useProgressSync'

// FlashCardPage: Hiển thị danh sách flashcards để ôn tập từ vựng
// - ORIGINAL_DATA: Dữ liệu mẫu; mỗi item có status (0: mặc định, 1: đã biết, 2: chưa biết)
// - onProgress: Bật/tắt chế độ theo dõi tiến độ (hiển thị số thẻ đã biết/chưa biết)
// - knownStatus / unknownStatus: Đếm động số thẻ đã đánh dấu
const FlashCardPage = () => {
  const dispatch = useAppDispatch()
  // Lấy thông tin user và trạng thái loading từ store
  // loading = true khi đang refreshToken, cần đợi hoàn thành
  const { user, loading: authLoading } = useAppSelector((state) => state.auth)
  //lấy fileID từ URL
  const [searchParams] = useSearchParams()
  const fileID = searchParams.get('fileId')

  // Kiểm tra xem có refreshToken không để quyết định có đợi auth hay không
  const hasRefreshToken = !!localStorage.getItem('refreshToken')

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

  // Lấy dữ liệu chi tiết file từ store (nếu cần)
  const { fileDetail, loadingDetail } = useAppSelector((state) => state.file)
  // Chuyển đổi fileDetail thành format cho các component
  const cardData = useMemo(() => {
    if (!fileDetail) return []
    return fileDetail.map((item) => ({
      id: item.detailID,
      source: item.source,
      target: item.target,
      status: item.flashcardState,
      statusMode: item.quizState
    }))
  }, [fileDetail])

  // Hook đồng bộ tiến độ học tập lên server
  // Chỉ bật khi có fileID và userID (chế độ chính, không phải demo)
  const { queueChange, queueBatchChanges, syncNow } = useProgressSync({
    fileID,
    userID: user?.userID || null,
    syncInterval: 10000, // 10 giây
    enabled: !!fileID && !!user?.userID
  })

  // Callback khi status thẻ thay đổi -> queue để sync
  const handleStatusChange = (id: string, newStatus: number) => {
    queueChange({
      detailID: id,
      flashcardState: newStatus
    })
  }

  // Callback khi reset tất cả -> queue batch để sync
  const handleResetAll = (ids: string[]) => {
    const changes = ids.map((id) => ({
      detailID: id,
      flashcardState: 0
    }))
    queueBatchChanges(changes)
    // Sync ngay lập tức khi reset
    syncNow()
  }

  // Sử dụng hook useFlashcards để quản lý trạng thái flashcards
  const {
    cards,
    onProgress,
    knownCount,
    unknownCount,
    toggleProgress,
    markKnown,
    markUnknown,
    resetStatuses,
    isNavigationPage,
    setIsNavigationPage
  } = useFlashcards({
    initialData: cardData,
    onStatusChange: handleStatusChange,
    onResetAll: handleResetAll
  })


  // Loading spinner khi:
  // 1. Có refreshToken và đang chờ auth (authLoading)
  // 2. Đang tải file detail (loadingDetail)
  // 3. Chưa có dữ liệu cards
  const isWaitingAuth = hasRefreshToken && authLoading
  if (isWaitingAuth || loadingDetail || cards.length === 0) {
    return <Loading text='Đang tải dữ liệu...' />
  }

  return (
    <>
      <div className='px-25 overflow-hidden'>
        <div className={`flex justify-between items-center ${onProgress ? '' : 'hidden'}`}>
          <div className='flex items-center gap-2'>
            <p className='border border-red-400 rounded-2xl px-4 font-bold py-1 bg-red-200 text-red-600'>
              {unknownCount}
            </p>
            <span className='text-sm font-semibold text-red-600'>Chưa biết</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-bold text-green-600 '>Đã biết</span>
            <p className='border border-green-400 rounded-2xl px-4 font-bold py-1 bg-green-200 text-green-600'>
              {knownCount}
            </p>
          </div>
        </div>

        <Flashcard
          cards={cards}
          height='h-118'
          onProgress={onProgress}
          knownStatus={knownCount}
          unknownStatus={unknownCount}
          markKnown={markKnown}
          markUnknown={markUnknown}
          resetStatuses={resetStatuses}
          isNavigationPage={isNavigationPage}
          setIsNavigationPage={setIsNavigationPage}
          fileID={fileID!}
        />
        {!isNavigationPage && (
          <div className='flex items-center gap-2'>
            Theo dõi tiến độ
            <button
              onClick={toggleProgress}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                onProgress ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${
                  onProgress ? 'translate-x-6' : ''
                }`}
              ></span>
            </button>
          </div>
        )}
      </div>{' '}
    </>
  )
}
export default FlashCardPage
