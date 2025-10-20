import { Square2StackIcon, BookOpenIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/20/solid'
import { BookmarkIcon, FolderPlusIcon, NewspaperIcon } from '@heroicons/react/24/outline'
import ListItem from '~/components/Listitem'
import Flashcard from '~/components/learnComponent/Flashcard'
import logo from '~/assets/logo.png'
import Button from '~/components/button/Button'
import { useMemo, useState } from 'react'
import { index } from '@react-router/dev/routes'
const LearnLessonPage = () => {
  // các chức năng
  const features = [
    { icon: Square2StackIcon, title: 'Thẻ ghi nhớ', links: '' },
    { icon: BookOpenIcon, title: 'Học', links: '' },
    { icon: ClipboardDocumentCheckIcon, title: 'Kiểm tra', links: '' },
    { icon: NewspaperIcon, title: 'Blocks', links: '' },
    { icon: NewspaperIcon, title: 'Blast', links: '' },
    { icon: NewspaperIcon, title: 'Ghép thẻ', links: '' }
  ]
  // Dữ liệu mẫu
  const ORIGINAL_DATA = [
    { id: '1', source: 'Dog', target: 'Chó' },
    { id: '2', source: 'Sun', target: 'Mặt trời' },
    { id: '3', source: 'Water', target: 'Nước' },
    { id: '4', source: 'Cat', target: 'Mèo' },
    { id: '5', source: 'Moon', target: 'Mặt trăng' },
    { id: '6', source: 'Fire', target: 'Lửa' },
    { id: '7', source: 'Tree', target: 'Cây' },
    { id: '8', source: 'Book', target: 'Sách' },
    { id: '9', source: 'Pen', target: 'Bút' },
    { id: '10', source: 'Car', target: 'Xe hơi' },
    { id: '11', source: 'Cloud', target: 'Đám mây' },
    { id: '12', source: 'River', target: 'Dòng sông' },
    { id: '13', source: 'Mountain', target: 'Núi' }
  ]
  const [indexMulti,setIndexMulti]=useState<number>(0)
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
  // mảng chứa Đích
  const allTargets = ORIGINAL_DATA.map((item) => item.target)
  const option = useMemo(()=>{return getRandomOptions(ORIGINAL_DATA[indexMulti].target,allTargets)},[indexMulti])
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
              <ListItem key={index} background='bg-gray-50'>
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
        <Flashcard />
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
          <div className='bg-white rounded-b-2xl py-5 px-10  shadow-lg'>
            <p className='mt-10 text-xl'>{ORIGINAL_DATA[indexMulti].source}</p>
            <div className='mt-25'>
              <p className='font-semibold text-gray-500 text-sm mb-5'>Chọn đáp án đúng</p>
              <div className='grid grid-cols-2 gap-4'>
                {
                  option&&option.map((item,index)=>{
                    return(<div className='flex gap-2 border-2 border-gray-200 p-3 rounded-lg hover:border-gray-700' onClick={()=>{setIndexMulti(indexMulti+1)}}>
                  <span className='p-2 size-7 flex items-center justify-center font-bold text-gray-600 bg-gray-200 rounded-[50%]'>
                    {index+1}
                  </span>
                  <p className='text-gray-500 text-lg'>{item}</p>
                </div>)
                  })
                }
                {/* <div className='flex gap-2 border-2 border-gray-200 p-3 rounded-lg hover:border-gray-700'>
                  <span className='p-2 size-7 flex items-center justify-center font-bold text-gray-600 bg-gray-200 rounded-[50%]'>
                    1
                  </span>
                  <p className='text-gray-500 text-lg'>hello</p>
                </div>
                <div className='flex gap-2 border-2 border-gray-200 p-3 rounded-lg hover:border-gray-700'>
                  <span className='p-2 size-7 flex items-center justify-center font-bold text-gray-600 bg-gray-200 rounded-[50%]'>
                    2
                  </span>
                  <p className='text-gray-500 text-lg'>hello</p>
                </div>
                <div className='flex gap-2 border-2 border-gray-200 p-3 rounded-lg hover:border-gray-700'>
                  <span className='p-2 size-7 flex items-center justify-center font-bold text-gray-600 bg-gray-200 rounded-[50%]'>
                    3
                  </span>
                  <p className='text-gray-500 text-lg'>hello</p>
                </div>
                <div className='flex gap-2 border-2 border-gray-200 p-3 rounded-lg hover:border-gray-700'>
                  <span className='p-2 size-7 flex items-center justify-center font-bold text-gray-600 bg-gray-200 rounded-[50%]'>
                    4
                  </span>
                  <p className='text-gray-500 text-lg'>hello</p>
                </div> */}
              </div>
            </div>
            <div className='mt-5 flex justify-center'>
              <span className='text-blue-600 font-semibold text-sm hover:bg-blue-50 px-3 py-2 rounded-2xl'>
                Bạn không biết?
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Thuật ngữ trong học phần này */}
      <div className=''>
        <p>Thuật ngữ trong học phần này</p>
        <div className='bg-gray-100 p-3 rounded-2xl'>
          <div className='bg-white rounded-lg flex gap-20 p-3 '>
            <p>Pile up</p>
            <span className='w-[1px] bg-gray-300'></span>
            <p>chất đống</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LearnLessonPage
