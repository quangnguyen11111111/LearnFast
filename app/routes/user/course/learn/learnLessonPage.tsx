import { Square2StackIcon, BookOpenIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/20/solid'
import { BookmarkIcon, FolderPlusIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import ListItem from '~/components/Listitem'
import Flashcard from '~/components/learnComponent/Flashcard'
import logo from '~/assets/logo.png'
import Button from '~/components/button/Button'
import { useMemo, useState } from 'react'
import MultipleChoise from '~/components/learnComponent/MultipleChoice'
const LearnLessonPage = () => {
  // các chức năng
  const features = [
    { icon: Square2StackIcon, title: 'Thẻ ghi nhớ', links: 'flash-card' },
    { icon: BookOpenIcon, title: 'Học', links: 'multiple-choice' },
    { icon: ClipboardDocumentCheckIcon, title: 'Kiểm tra', links: '' },
    { icon: NewspaperIcon, title: 'Blocks', links: '' },
    { icon: NewspaperIcon, title: 'Blast', links: '' },
    { icon: NewspaperIcon, title: 'Ghép thẻ', links: '' }
  ]
  // Dữ liệu mẫu
  const ORIGINAL_DATA = [
    { id: '1', source: 'Dog dog', target: 'Chó', status: 3, statusMode: 1 },
    { id: '2', source: 'Sun', target: 'Mặt trời', status: 3, statusMode: 1 },
    { id: '3', source: 'Water', target: 'Nước', status: 3, statusMode: 1 },
    { id: '4', source: 'Cat', target: 'Mèo', status: 3, statusMode: 1 },
    { id: '5', source: 'Moon', target: 'Mặt trăng', status: 3, statusMode: 1 },
    { id: '6', source: 'Fire', target: 'Lửa', status: 3, statusMode: 1 },
    { id: '7', source: 'Tree', target: 'Cây', status: 3, statusMode: 0 },
    { id: '8', source: 'Book', target: 'Sách', status: 3, statusMode: 0 },
    { id: '9', source: 'Pen', target: 'Bút', status: 0, statusMode: 0 },
    { id: '10', source: 'Car', target: 'Xe hơi', status: 0, statusMode: 0 },
    { id: '11', source: 'Cloud', target: 'Đám mây', status: 0, statusMode: 0 },
    { id: '12', source: 'River', target: 'Dòng sông', status: 0, statusMode: 0 },
    { id: '13', source: 'Mountain', target: 'Núi', status: 0, statusMode: 0 }
  ]
  const [indexMulti, setIndexMulti] = useState<number>(0)
  const [selected, setSelected] = useState<string | null>(null) // Trạng thái lựa chọn của người dùng
  const [isAnswered, setIsAnswered] = useState(false) // Trạng thái đã trả lời hay chưa
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null) // Trạng thái đúng sai
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
    if(indexMulti == ORIGINAL_DATA.length -1){
      alert('Bạn đã hoàn thành tất cả các câu hỏi!')
      return
    }
    setIndexMulti((prevIndex) => {
      return (prevIndex + 1)
    })
  }
  // mảng chứa Đích
  const allTargets = ORIGINAL_DATA.map((item) => item.target)
  const option = useMemo(() => {
    return getRandomOptions(ORIGINAL_DATA[indexMulti].target, allTargets)
  }, [indexMulti])
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
              <ListItem key={index} background='bg-gray-50' navigatevalue={item.links}>
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
        <Flashcard cards={ORIGINAL_DATA} />
      </div>
      {/* tác giả */}
      <div className='border-t-2 border-gray-300 flex justify-start mt-5 '>
        <div className='flex items-center'>
          <img src={`${logo}`} alt='avatar' className='size-16 rounded-2xl' />
          <div className=''>
            <span className='text-[12px] text-gray-400'>Tạo bởi</span>
            <p className='font-semibold'>Người dùng 1</p>
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
            <div className='text-xl'>1/7</div>
            <Button
              variant='secondary'
              className='px-3 py-2 transition-all duration-300 font-bold'
              rounded='rounded-2xl'
            >
              Dùng chế độ học
            </Button>
          </div>
          {/* content */}
          <MultipleChoise
            ORIGINAL_DATA={ORIGINAL_DATA}
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
        </div>
      </div>
      {/* Thuật ngữ trong học phần này */}
      <div className='mt-5'>
        <p className='font-bold text-2xl mt-8 mb-5'>Thuật ngữ trong học phần này</p>
        <div className='bg-gray-100 p-3 rounded-2xl flex flex-col gap-3'>
          {ORIGINAL_DATA &&
            ORIGINAL_DATA.map((item, index) => {
              return (
                <div className='bg-white rounded-lg grid grid-cols-[1fr_auto_1fr] p-3 justify-items-center' key={index}>
                  <p className=''>{item.source}</p>
                  <span className='w-[1px] bg-gray-300'></span>
                  <p className=''>{item.target}</p>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
export default LearnLessonPage