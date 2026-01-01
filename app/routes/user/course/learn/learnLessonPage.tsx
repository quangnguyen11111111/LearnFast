import { Square2StackIcon, BookOpenIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/20/solid'
import { BookmarkIcon, FolderPlusIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import ListItem from '~/components/Listitem'
import Flashcard from '~/components/learnComponent/Flashcard'
import logo from '~/assets/logo.png'
import Button from '~/components/button/Button'
import { use, useEffect, useMemo, useState } from 'react'
import MultipleChoise from '~/components/learnComponent/MultipleChoice'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { useNavigate, useSearchParams } from 'react-router'
import { getFileDetailThunk } from '~/features/api/file/fileThunk'
import { useFlashcards } from '~/features/flashcard/useFlashcards'
const LearnLessonPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  // Xử lý chế độ người dùng
  const { user, loading } = useAppSelector((state) => state.auth)
  const isFreeAccessUsed = localStorage.getItem('guestFreeAccessUsed')
  const handleNavigateGuestFreeAccess = (link: string) => {
    if (!user && isFreeAccessUsed === 'false') {
      localStorage.setItem('guestFreeAccessUsed', 'true')
      alert('Bạn đã sử dụng quyền truy cập miễn phí cho khách!')
      navigate(`${link}`)
    } else if (!user && isFreeAccessUsed === 'true') {
      alert('Bạn đã sử dụng hết quyền truy cập miễn phí cho khách! Vui lòng đăng ký tài khoản để tiếp tục học tập.')
    }
  }

  //lấy fileID từ URL
  const [searchParams] = useSearchParams()

  const fileID = searchParams.get('fileId')

  // các chức năng
  const features = [
    { icon: Square2StackIcon, title: 'Thẻ ghi nhớ', links: `flash-card?fileId=${fileID}` },
    { icon: BookOpenIcon, title: 'Học', links: `multiple-choice?fileId=${fileID}` },
    { icon: ClipboardDocumentCheckIcon, title: 'Kiểm tra', links: `test?fileId=${fileID}` },
    { icon: NewspaperIcon, title: 'Blocks', links: `blocks?fileId=${fileID}` },
    { icon: NewspaperIcon, title: 'Ghép thẻ', links: `card-matching?fileId=${fileID}` }
  ]

  useEffect(() => {
    if (fileID) {
      // Gọi thunk để lấy chi tiết file
      dispatch(getFileDetailThunk({ fileID: fileID, ...(user && { userID: user.userID }) }))
    }
  }, [fileID])
  // Lấy dữ liệu chi tiết file từ store
  const { fileDetail, loadingDetail, ownerInfo } = useAppSelector((state) => state.file)

  // Chuyển đổi fileDetail thành format cho các component
  const cardData = useMemo(() => {
    if (!fileDetail || fileDetail.length === 0) return []

    const total = fileDetail.length

    // Số câu cần lấy
    const numberOfCards = total <= 4 ? total : Math.max(4, Math.floor(total * 0.2))

    return fileDetail.slice(0, numberOfCards).map((item) => ({
      id: item.detailID,
      source: item.source,
      target: item.target,
      status: item.flashcardState,
      statusMode: item.quizState
    }))
  }, [fileDetail])

  const [indexMulti, setIndexMulti] = useState<number>(0)
  const [selected, setSelected] = useState<string | null>(null) // Trạng thái lựa chọn của người dùng
  const [isAnswered, setIsAnswered] = useState(false) // Trạng thái đã trả lời hay chưa
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null) // Trạng thái đúng sai
  const [isMultipleChoiceCompleted, setIsMultipleChoiceCompleted] = useState(false) // Trạng thái hoàn thành trắc nghiệm

  // Hàm trỗn dữ liệu ngẫu nhiên cho trắc nghiệm
  const getRandomOptions = (correct: string, allTargets: string[]): string[] => {
    const options = [correct]
    while (options.length < 4) {
      const random = allTargets[Math.floor(Math.random() * allTargets.length)]
      if (!options.includes(random)) {
        options.push(random)
      }
    }
    return options.sort(() => Math.random() - 0.5)
  }
  const handleNextQuestion = () => {
    if (cardData.length === 0) return
    if (indexMulti === cardData.length - 1) {
      // Hoàn thành tất cả câu hỏi
      setIsMultipleChoiceCompleted(true)
      return
    }
    setIndexMulti((prevIndex) => {
      return prevIndex + 1
    })
  }
  // mảng chứa Đích
  const allTargets = useMemo(() => cardData.map((item) => item.target), [cardData])
  const option = useMemo(() => {
    if (cardData.length === 0) return []
    return getRandomOptions(cardData[indexMulti].target, allTargets)
  }, [indexMulti, cardData, allTargets])

  //
  const { isNavigationPage, setIsNavigationPage } = useFlashcards({ initialData: cardData })
  return (
    <div className='mx-30 mb-10 max-md:mx-2'>
      <div className='flex justify-between mt-5 '>
        <div className='flex gap-2'>
          <FolderPlusIcon className='size-6 flex-shrink-0 text-gray-500 font-semibold' />
          <span>Thư mục 1</span>
        </div>
        <div className='flex gap-2'>
          <BookmarkIcon className='size-6 flex-shrink-0 text-gray-500 font-semibold' />
          <span>Lưu</span>
        </div>
      </div>
      <div className='font-bold text-2xl mt-5'>Bộ thẻ 1</div>
      <div className='grid grid-cols-3 max-md:grid-cols-2 gap-x-2 max-md:text-sm'>
        {/* Các chức năng học */}
        {features &&
          features.map((item, index) => {
            const Icon = item.icon
            return (
              <ListItem
                key={index}
                background='bg-gray-50'
                navigatevalue={item.links}
                {...(!user
                  ? {
                      handleClick: () => handleNavigateGuestFreeAccess(item.links)
                    }
                  : {})}
              >
                <div className='flex items-center gap-1'>
                  <Icon className='size-6 flex-shrink-0 text-blue-500' />
                  <span className='font-semibold'>{item.title}</span>
                </div>
              </ListItem>
            )
          })}
      </div>
      {/* flash card */}
      <div className=''>
        {loadingDetail ? (
          <div className='flex justify-center items-center h-40'>
            <span className='text-gray-500'>Đang tải dữ liệu...</span>
          </div>
        ) : cardData.length > 0 ? (
          <Flashcard
            cards={cardData}
            setIsNavigationPage={setIsNavigationPage}
            isNavigationPage={isNavigationPage}
            demo={true}
            fileID={fileID!}
          />
        ) : (
          <div className='flex justify-center items-center h-40'>
            <span className='text-gray-500'>Không có dữ liệu</span>
          </div>
        )}
      </div>
      {/* tác giả */}
      <div className='border-t-2 border-gray-300 flex justify-start mt-5 '>
        <div className='flex items-center gap-3 mt-5'>
          <div className=''>
            <img src={ownerInfo?.avatar || logo} alt='avatar' className='size-10 rounded-full' />
          </div>
          <div className=''>
            <span className='text-[12px] text-gray-400'>Tạo bởi</span>
            <p className='font-semibold'>{ownerInfo?.name}</p>
          </div>
        </div>
      </div>
      {/* câu hỏi ví dụ */}
      <div className=''>
        <p className='font-bold text-2xl mt-8'>Câu hỏi mẫu cho học phần này</p>
        {/* header */}
        <div className='mt-6'>
          <div className='flex items-center p-2 bg-gray-100 justify-between rounded-t-2xl'>
            <div className='flex items-center gap-2'>
              <BookOpenIcon className='size-8 flex-shrink-0 text-blue-500' />
              <span className='font-semibold text-lg'>Học</span>
            </div>
            <div className='text-xl'>
              {indexMulti + 1}/{cardData.length}
            </div>
            <Button
              variant='secondary'
              className='px-3 py-2 transition-all duration-300 font-bold'
              rounded='rounded-2xl'
            >
              Dùng chế độ học
            </Button>
          </div>
          {/* content */}
          {cardData.length > 0 && !isMultipleChoiceCompleted && (
            <MultipleChoise
              ORIGINAL_DATA={cardData}
              handleNextQuestion={handleNextQuestion}
              indexMulti={indexMulti}
              option={option}
              isAnswered={isAnswered}
              setIsAnswered={setIsAnswered}
              isCorrect={isCorrect}
              setIsCorrect={setIsCorrect}
              selected={selected}
              setSelected={setSelected}
              showButtonNext={true}
            />
          )}
          {/* Giao diện hoàn thành trắc nghiệm */}
          {isMultipleChoiceCompleted && (
            <div className='bg-white rounded-b-2xl border border-t-0 border-gray-200 p-8 flex flex-col items-center justify-center'>
              <div className='text-5xl mb-3'>📚</div>
              <h2 className='text-xl font-bold text-indigo-700 mb-2'>Trải nghiệm thêm!</h2>
              <p className='text-gray-600 mb-6 text-center'>Truy cập chế độ Học để luyện tập hiệu quả hơn</p>
              <button
                onClick={() => navigate(`multiple-choice?fileId=${fileID}`)}
                className='flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg'
              >
                <BookOpenIcon className='w-5 h-5' />
                Vào chế độ Học
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Thuật ngữ trong học phần này */}
      <div className='mt-5'>
        <p className='font-bold text-2xl mt-8 mb-5'>Thuật ngữ trong học phần này ({cardData.length})</p>
        <div className='bg-gray-100 p-3 rounded-2xl flex flex-col gap-3'>
          {loadingDetail ? (
            <div className='flex justify-center items-center h-20'>
              <span className='text-gray-500'>Đang tải...</span>
            </div>
          ) : cardData.length > 0 ? (
            cardData.map((item, index) => (
              <div className='bg-white rounded-lg grid grid-cols-[1fr_auto_1fr] p-3 justify-items-center' key={item.id}>
                <p className=''>{item.source}</p>
                <span className='w-[1px] bg-gray-300'></span>
                <p className=''>{item.target}</p>
              </div>
            ))
          ) : (
            <div className='flex justify-center items-center h-20'>
              <span className='text-gray-500'>Không có thuật ngữ</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
// Tiêu đề trang
export const meta = () => [{ title: 'Trang học bài - LearnFast' }]
export default LearnLessonPage
