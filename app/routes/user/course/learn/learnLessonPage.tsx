import { Square2StackIcon, BookOpenIcon, ClipboardDocumentCheckIcon, SquaresPlusIcon } from '@heroicons/react/20/solid'
import {
  ArrowDownCircleIcon,
  ArrowPathIcon,
  BookmarkIcon,
  FolderPlusIcon,
  NewspaperIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import ListItem from '~/components/Listitem'
import Flashcard from '~/components/learnComponent/Flashcard'
import logo from '~/assets/logo.png'
import Button from '~/components/button/Button'
import { use, useEffect, useMemo, useState, Fragment } from 'react'
import MultipleChoise from '~/components/learnComponent/MultipleChoice'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { useNavigate, useSearchParams } from 'react-router'
import { getFileDetailThunk } from '~/features/api/file/fileThunk'
import { useFlashcards } from '~/features/flashcard/useFlashcards'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'
import ModalSaveToFolder from '~/components/ModalSaveToFolder'
import { useFileInFolders } from '~/features/library/useFileInFolders'
import { toast } from 'react-toastify'
import { deleteFileThunk } from '~/features/api/file/fileThunk'
const LearnLessonPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  // Xử lý chế độ người dùng
  const { user, loadingRefresh, loading } = useAppSelector((state) => state.auth)
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

  // Lấy dữ liệu chi tiết file từ store
  const { fileDetail, loadingDetail, ownerInfo, errorDetail } = useAppSelector((state) => state.file)

  // các chức năng
  const features = [
    { icon: Square2StackIcon, title: 'Thẻ ghi nhớ', links: `flash-card?fileId=${fileID}` },
    { icon: BookOpenIcon, title: 'Học', links: `multiple-choice?fileId=${fileID}` },
    { icon: ClipboardDocumentCheckIcon, title: 'Kiểm tra', links: `test?fileId=${fileID}` },
    { icon: SquaresPlusIcon, title: 'Blocks', links: `blocks?fileId=${fileID}` },
    { icon: NewspaperIcon, title: 'Ghép thẻ', links: `card-matching?fileId=${fileID}` }
  ]
  const refet = localStorage.getItem('refreshToken')
  useEffect(() => {
    // Chờ auth finish loading rồi mới gọi thunk (đảm bảo user data đã được load từ refresh token)
    if (refet && fileID && !loading && !loadingRefresh && user) {
      // Gọi thunk để lấy chi tiết file
      dispatch(getFileDetailThunk({ fileID: fileID, userID: user.userID }))
    }
    if (!refet && fileID && !loading && !loadingRefresh) {
      // Gọi thunk để lấy chi tiết file
      dispatch(getFileDetailThunk({ fileID: fileID }))
    }
  }, [fileID, loading, loadingRefresh, dispatch, user])
  // Xử lý lỗi khi truy cập file
  useEffect(() => {
    if (errorDetail) {
      // errCode 3 = Bạn không có quyền truy cập file này
      if (errorDetail.errCode === 3) {
        toast.error(errorDetail.message || 'Bạn không có quyền truy cập file này')
        navigate('/latest', { replace: true }) // Quay lại trang trước
      } else {
        toast.error(errorDetail.message || 'Lỗi khi tải file')
      }
    }
  }, [errorDetail, navigate])

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

  // Hàm trộn dữ liệu ngẫu nhiên cho trắc nghiệm
  const getRandomOptions = (correct: string, allTargets: string[]): string[] => {
    const options = [correct]
    // Lọc ra các target duy nhất khác với đáp án đúng
    const uniqueTargets = [...new Set(allTargets)].filter((t) => t !== correct)

    // Số lượng options tối đa có thể tạo (tối đa 4, bao gồm đáp án đúng)
    const maxOptions = Math.min(4, uniqueTargets.length + 1)

    // Thêm các options ngẫu nhiên cho đến khi đủ số lượng
    while (options.length < maxOptions && uniqueTargets.length > 0) {
      const randomIndex = Math.floor(Math.random() * uniqueTargets.length)
      options.push(uniqueTargets[randomIndex])
      uniqueTargets.splice(randomIndex, 1) // Xóa để tránh trùng lặp
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

  const [isEllipsisMenuOpen, setIsEllipsisMenuOpen] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  // Hook check file đã lưu vào những thư mục nào
  const {
    hasFileSaved,
    folderHasFile,
    isLoading: isCheckingFolders
  } = useFileInFolders(fileID || undefined, !!fileID && !!user)

  // Handler xóa file
  const handleDeleteFile = () => {
    if (!user?.userID || !fileID || isDeleting) return
    setDeleteConfirmOpen(true)
    setIsEllipsisMenuOpen(false)
  }

  // Handler xác nhận xóa file
  const handleConfirmDelete = async () => {
    if (!user?.userID || !fileID) return

    setIsDeleting(true)
    try {
      await dispatch(
        deleteFileThunk({
          fileID,
          creatorID: user.userID
        })
      ).unwrap()

      toast.success('Đã xóa bài học thành công')
      navigate('/latest', { replace: true })
    } catch (error: any) {
      toast.error(error || 'Không thể xóa bài học. Vui lòng thử lại!')
      setDeleteConfirmOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  //
  const { isNavigationPage, setIsNavigationPage } = useFlashcards({ initialData: cardData })
  return (
    <div className='mx-30 mb-10 max-md:mx-2'>
      <div className='flex justify-between mt-5 '>
        <div className='font-bold text-2xl'>{ownerInfo?.fileName}</div>
        <div className='relative flex items-center gap-6'>
          <div
            className={`flex gap-2 cursor-pointer transition-colors ${
              hasFileSaved ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-blue-500'
            }`}
            onClick={() => {
              if (user) {
                setIsSaveModalOpen(true)
              } else {
                toast.error('Vui lòng đăng nhập để lưu file vào thư mục')
              }
            }}
          >
            <BookmarkIcon className='size-6 flex-shrink-0 font-semibold' />
            <span>Lưu </span>
          </div>
          {ownerInfo?.creatorID === user?.userID && (
            <div
              className=' hover:bg-gray-200 rounded-full p-1 cursor-pointer'
              onClick={() => {
                setIsEllipsisMenuOpen(!isEllipsisMenuOpen)
              }}
            >
              <EllipsisHorizontalIcon className='size-6 flex-shrink-0 text-gray-500 font-semibold cursor-pointer' />
            </div>
          )}
          {/* giao diện hiển thi lựa chọn xóa cập nhật */}
          <div
            className={`${isEllipsisMenuOpen ? 'block' : 'hidden'} z-50 absolute top-8 right-0 py-1 w-39 bg-white border border-gray-300 rounded-lg flex flex-col`}
          >
            <p
              className='hover:bg-gray-300 p-2 cursor-pointer'
              onClick={() => {
                navigate(`/edit-lesson?fileId=${fileID}`, { replace: true })
                setIsEllipsisMenuOpen(false)
              }}
            >
              <ArrowPathIcon className='size-5 mx-3 flex-shrink-0 text-gray-500 font-semibold inline-block mr-3' /> Cập
              nhật
            </p>
            <p className='hover:bg-gray-300 p-2 cursor-pointer' onClick={handleDeleteFile}>
              <TrashIcon className='size-5 mx-3 flex-shrink-0 text-gray-500 font-semibold inline-block mr-3' /> Xóa
            </p>
          </div>
        </div>
      </div>

      {/* Modal Lưu vào thư mục */}
      {user && fileID && ownerInfo?.fileName && (
        <ModalSaveToFolder
          isOpen={isSaveModalOpen}
          setIsOpen={setIsSaveModalOpen}
          fileID={fileID}
          fileName={ownerInfo.fileName}
        />
      )}

      {/* Dialog xác nhận xóa bài học */}
      <Transition show={deleteConfirmOpen} as={Fragment}>
        <Dialog as='div' className='relative z-100' onClose={() => !isDeleting && setDeleteConfirmOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black/40' />
          </TransitionChild>

          <div className='fixed inset-0 flex items-center justify-center p-4'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100'>
                      <ExclamationTriangleIcon className='h-6 w-6 text-red-600' />
                    </div>
                    <div>
                      <DialogTitle className='text-lg font-semibold text-gray-900'>Xóa bài học?</DialogTitle>
                      <p className='mt-2 text-sm text-gray-600'>
                        Bạn có chắc chắn muốn xóa bài học <span className='font-semibold'>"{ownerInfo?.fileName}"</span>
                        ?
                      </p>
                      <div className='mt-3 space-y-1'>
                        <p className='text-sm text-red-700 font-medium'>❌ Dữ liệu sẽ bị xóa VĨNH VIỄN</p>
                        <p className='text-sm text-red-700 font-medium'>❌ Không thể khôi phục</p>
                        <p className='text-sm text-red-700 font-medium'>❌ Tất cả tiến trình học tập sẽ biến mất</p>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end gap-3 pt-2'>
                    <button
                      className='px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 font-medium'
                      onClick={() => setDeleteConfirmOpen(false)}
                      disabled={isDeleting}
                    >
                      Hủy
                    </button>
                    <button
                      className='px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium'
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Đang xóa...' : 'Xóa'}
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>

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
