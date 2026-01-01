import React, { useEffect, useMemo } from 'react'
import Button from '~/components/button/Button'
import imgBottomTest from '~/assets/imgBottomTest.svg'
import IconButton from '~/components/button/ButtonIcon'
import { Cog8ToothIcon } from '@heroicons/react/24/outline'
import { NumberedListIcon } from '@heroicons/react/24/solid'
import TestResult from '~/components/learnComponent/test/TestResult'
import TestSetupModal from '~/components/learnComponent/test/TestSetupModal'
import TestSummarySidebar from '~/components/learnComponent/test/TestSummarySidebar'
import TrueFalseQuestion from '~/components/learnComponent/test/TrueFalseQuestion'
import MultipleChoiceQuestion from '~/components/learnComponent/test/MultipleChoiceQuestion'
import EssayQuestion from '~/components/learnComponent/test/EssayQuestion'
import { useTestExam } from '~/features/test/useTestExam'
import type { Question } from '~/features/test/types'
import { useSearchParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { getFileDetailThunk } from '~/features/api/file/fileThunk'
import Loading from '~/components/Loading'
// Types used in this module
// Types moved to ~/features/test/types

// Example dataset (kept outside component to avoid re-creation on each render)
const defaultData: Question[] = [
  { id: '1', source: 'Dog dog', target: 'Chó', status: 3, statusMode: 1 },
  { id: '0', source: 'Sun', target: 'Mặt trời', status: 3, statusMode: 1 },
  { id: '3', source: 'Water', target: 'Nước', status: 3, statusMode: 1 },
  { id: '4', source: 'Cat', target: 'Mèo', status: 3, statusMode: 1 },
  { id: '5', source: 'Moon', target: 'Mặt trăng', status: 3, statusMode: 1 },
  { id: '6', source: 'Fire', target: 'Lửa', status: 3, statusMode: 1 },
  { id: '7', source: 'Tree', target: 'Cây', status: 3, statusMode: 0 },
  { id: '8', source: 'Book', target: 'Sách', status: 3, statusMode: 0 },
  { id: '9', source: 'Pen', target: 'Bút', status: 0, statusMode: 0 },
  { id: '10', source: 'Car', target: 'Xe hơi', status: 0, statusMode: 0 },
  { id: '11', source: 'Cloud', target: 'Đám mây', status: 0, statusMode: 0 },
  { id: '12', source: 'River', target: 'Dòng sông', status: 0, statusMode: 0 }
]

// TestPage: Trang thực hiện bài kiểm tra với 3 chế độ (Đúng/Sai, Trắc nghiệm, Tự luận)
// - Quản lý chia câu hỏi theo chế độ, theo dõi trả lời, tính trạng thái kết thúc
// - Hỗ trợ thiết lập số lượng câu và loại hình trước khi bắt đầu
const TestPage = () => {
  const { user, loading: authLoading } = useAppSelector((state) => state.auth)
  //lấy fileID từ URL
  const [searchParams] = useSearchParams()
  const fileID = searchParams.get('fileId')
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (fileID) {
      // Gọi thunk để lấy chi tiết file
      dispatch(getFileDetailThunk({ fileID: fileID, ...(user && { userID: user.userID }) }))
    }
  }, [fileID])
  // Lấy dữ liệu chi tiết file từ store
  const { fileDetail, loadingDetail, ownerInfo } = useAppSelector((state) => state.file)
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
    ORIGINAL_DATA,
    batchSize,
    setBatchSize,
    isTestTrueFalse,
    setIsTestTrueFalse,
    isTestMultiple,
    setIsTestMultiple,
    isTestEssay,
    setIsTestEssay,
    countEnabled,
    questionCountByMode,
    dividedData,
    multipleOptions,
    userAnswers,
    selectedAnswers,
    handleSelectAnswer,
    isEndTest,
    handleSubmitEndTest,
    formatTime,
    startTimer,
    isOpenSetup,
    setIsOpenSetup,
    handleSubmitSetupTest,
    isOpenSummary,
    setIsOpenSummary,
    handleNext,
    refTrueFalse,
    refMultiple,
    refEssay,
    refInputEssay,
    refDivMain,
    refButtonSubmitTest,
    answeredTrueFalse,
    answeredMultiple,
    answeredEssay,
    scrollToTop
  } = useTestExam({ initialData: cardData })
  
  if ( loadingDetail || cardData.length === 0) {
    return <Loading text='Đang tải dữ liệu...' />
  }
  let indexNumberNow = 0
  return (
    <div className='px-85 max-xl:px-55 max-lg:px-30 max-md:px-10 flex flex-col items-center gap-8 pb-10 relative'>
      {/* Giao diện hiển thị danh sách tóm tắt các câu hỏi sau khi trả lời */}
      {/* Toggle button to open summary */}
      {!isOpenSummary && isEndTest && (
        <button
          className='fixed top-20 left-5 z-40 border-[1px] border-gray-200 bg-white p-2 rounded-3xl hover:bg-gray-100 transition-colors cursor-pointer'
          onClick={() => setIsOpenSummary(true)}
        >
          <NumberedListIcon className='size-6 text-gray-700' />
        </button>
      )}
      <TestSummarySidebar open={isOpenSummary} onClose={() => setIsOpenSummary(false)} userAnswers={userAnswers} />
      {/* Nút cài đặt bài kiểm tra */}
      <div
        className='fixed top-3 right-28 z-50 max-md:right-15'
        onClick={() => {
          setIsOpenSetup(true)
        }}
      >
        <IconButton icon={Cog8ToothIcon} onClick={() => {}} size={8} variant='secondary' />
      </div>
      {/* GIao diện setup bài kieemr tra */}
      <TestSetupModal
        open={isOpenSetup}
        onClose={() => {
          startTimer()
          setIsOpenSetup(false)
        }}
        batchSize={batchSize}
        setBatchSize={setBatchSize}
        maxCount={cardData.length}
        isTestTrueFalse={isTestTrueFalse}
        setIsTestTrueFalse={setIsTestTrueFalse}
        isTestMultiple={isTestMultiple}
        setIsTestMultiple={setIsTestMultiple}
        isTestEssay={isTestEssay}
        setIsTestEssay={setIsTestEssay}
        countEnabled={countEnabled}
        onStart={() => {
          handleSubmitSetupTest()
          scrollToTop()
        }}
      />
      {/* Thống kê đúng sai khi submit */}
      <div className=' w-full' ref={refDivMain}>
        {isEndTest && (
          <TestResult
            time={`${formatTime()}`}
            correct={userAnswers.filter((a) => a.isCorrect === true).length}
            wrong={userAnswers.filter((a) => a.isCorrect === false).length}
          />
        )}
      </div>
      {/* chế độ đúng sai */}
      {isTestTrueFalse &&
        dividedData.trueFalse.map((items, index) => {
          indexNumberNow += 1
          const userAnswer = userAnswers.find((a) => a.id === items.id && a.mode === 'trueFalse')
          const isSelected = selectedAnswers[items.id]
          return (
            <TrueFalseQuestion
              key={items.id}
              id={items.id}
              source={items.source}
              displayTarget={items.displayTarget}
              correctFlag={items.isCorrect}
              correctTarget={items.target}
              indexNumberNow={indexNumberNow}
              total={ORIGINAL_DATA.length}
              isEndTest={isEndTest}
              userAnswer={userAnswer}
              selected={isSelected as boolean | undefined}
              onSelect={(userChoice) => {
                handleSelectAnswer(items.id, 'trueFalse', userChoice, items.isCorrect, refTrueFalse.current[index])
                answeredTrueFalse.current[index] = true
                handleNext(index, refTrueFalse, answeredTrueFalse.current, 'trueFalse')
              }}
              ref={(el) => {
                refTrueFalse.current[index] = el
              }}
            />
          )
        })}
      {/* chế độ trắc nghiệm */}
      {isTestMultiple &&
        !isOpenSetup &&
        dividedData.multiple.map((items, index) => {
          const option = multipleOptions[index]
          indexNumberNow += 1
          const userAnswer = userAnswers.find((a) => a.id === items.id && a.mode === 'multiple')
          return (
            <MultipleChoiceQuestion
              key={items.id}
              id={items.id}
              target={items.target}
              options={option}
              correctSource={items.source}
              indexNumberNow={indexNumberNow}
              total={ORIGINAL_DATA.length}
              isEndTest={isEndTest}
              userAnswer={userAnswer}
              selected={selectedAnswers[items.id]}
              onSelect={(v: string) => {
                answeredMultiple.current[index] = true
                handleNext(index, refMultiple, answeredMultiple.current, 'multiple')
                handleSelectAnswer(items.id, 'multiple', v, items.source, refMultiple.current[index])
              }}
              ref={(el: HTMLDivElement | null) => {
                refMultiple.current[index] = el
              }}
            />
          )
        })}
      {/* chế độ tự luận */}

      {isTestEssay &&
        dividedData.essay.map((items, index) => {
          indexNumberNow += 1
          const userAnswer = userAnswers.find((a) => a.id === items.id && a.mode === 'essay')
          return (
            <EssayQuestion
              key={items.id}
              id={items.id}
              target={items.target}
              indexNumberNow={indexNumberNow}
              total={ORIGINAL_DATA.length}
              isEndTest={isEndTest}
              userAnswer={userAnswer}
              inputRef={(el: HTMLInputElement | null) => {
                refInputEssay.current[index] = el
              }}
              onEnter={(val: string) => {
                answeredEssay.current[index] = true
                handleNext(index, refEssay, answeredEssay.current, 'essay')
                handleSelectAnswer(
                  items.id,
                  'essay',
                  val.trim().toLowerCase(),
                  items.source.trim().toLowerCase(),
                  refEssay.current[index]
                )
              }}
              isLast={dividedData.essay.length - 1 === index}
              ref={(el: HTMLDivElement | null) => {
                refEssay.current[index] = el
              }}
            />
          )
        })}
      {/* nút hoàn thành */}
      {!isEndTest && (
        <div className='flex flex-col items-center gap-12 mt-5'>
          <img src={imgBottomTest} alt='' className='h-[4rem]' />
          <p className='font-bold text-2xl'>Tất cả đã xong! Bạn đã sẵn sàng gửi bài kiểm tra?</p>
          <Button
            ref={refButtonSubmitTest}
            className='px-9 py-4 font-semibold'
            rounded='rounded-4xl'
            onClick={() => {
              // cuộn lên đầu khi submit
              if (!refDivMain.current) return
              window.scrollTo({
                top: refDivMain.current.offsetTop - 60, // chỉnh theo layout thực tế
                behavior: 'smooth'
              })

              handleSubmitEndTest()
            }}
          >
            Gửi bài kiểm tra
          </Button>
        </div>
      )}
      {/* Hiển thị  */}
      {}
    </div>
  )
}
export default TestPage
