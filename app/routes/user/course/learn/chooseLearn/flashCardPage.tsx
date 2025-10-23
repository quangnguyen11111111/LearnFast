import { useState } from 'react'
import Flashcard from '~/components/learnComponent/Flashcard'

const FlashCardPage = () => {
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
  const [on, setOn] = useState<boolean>(false)
  return (
    <>
      <div className='px-25 overflow-hidden'>
        <div className='flex justify-between items-center'>
          <p>Đang học</p>
          <p>Đã biết</p>
        </div>
        <Flashcard cards={ORIGINAL_DATA} height='h-118' />
        <div className='flex items-center gap-2'>
          Theo dõi tiến độ
          <button
            onClick={() => setOn(!on)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              on ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${
                on ? 'translate-x-6' : ''
              }`}
            ></span>
          </button>
        </div>
      </div>{' '}
    </>
  )
}
export default FlashCardPage
