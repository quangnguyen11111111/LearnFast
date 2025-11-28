import { useState } from 'react'
import { useNavigate } from 'react-router'
import Flashcard from '~/components/learnComponent/Flashcard'

// FlashCardPage: Hiển thị danh sách flashcards để ôn tập từ vựng
// - ORIGINAL_DATA: Dữ liệu mẫu; mỗi item có status (0: mặc định, 1: đã biết, 2: chưa biết)
// - onProgress: Bật/tắt chế độ theo dõi tiến độ (hiển thị số thẻ đã biết/chưa biết)
// - knownStatus / unknownStatus: Đếm động số thẻ đã đánh dấu
const FlashCardPage = () => {
  // ORIGINAL_DATA: Dữ liệu mẫu (nên thay bằng API sau này)
  const ORIGINAL_DATA = [
    { id: '1', source: 'Dog', target: 'Chó', status: 0 },
    { id: '2', source: 'Sun', target: 'Mặt trời', status: 0 },
    { id: '3', source: 'Water', target: 'Nước', status: 0 },
    { id: '4', source: 'Cat', target: 'Mèo', status: 0 },
    { id: '5', source: 'Moon', target: 'Mặt trăng', status: 0 },
    { id: '6', source: 'Fire', target: 'Lửa', status: 0 },
    { id: '7', source: 'Tree', target: 'Cây', status: 0 },
    { id: '8', source: 'Book', target: 'Sách', status: 0 },
    { id: '9', source: 'Pen', target: 'Bút', status: 0 },
    { id: '10', source: 'Car', target: 'Xe hơi', status: 0 },
    { id: '11', source: 'Cloud', target: 'Đám mây', status: 0 },
    { id: '12', source: 'River', target: 'Dòng sông', status: 0 },
    { id: '13', source: 'Mountain', target: 'Núi', status: 0 }
  ]
  const [onProgress, setOnProgress] = useState<boolean>(false) // trạng thái theo dõi tiến độ
  const [knownStatus, setKnownStatus] = useState<number>(ORIGINAL_DATA.filter((item) => item.status === 1).length) // số thẻ đã biết
  const [unknownStatus, setUnknownStatus] = useState<number>(ORIGINAL_DATA.filter((item) => item.status === 2).length) // số thẻ chưa biết
  return (
    <>
      <div className='px-25 overflow-hidden'>
        <div className={`flex justify-between items-center ${onProgress ? '' : 'hidden'}`}>
          <div className='flex items-center gap-2'>
            <p className='border border-red-400 rounded-2xl px-4 font-bold py-1 bg-red-200 text-red-600'>
              {unknownStatus}
            </p>
            <span className='text-sm font-semibold text-red-600'>Chưa biết</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-bold text-green-600 '>Đã biết</span>
            <p className='border border-green-400 rounded-2xl px-4 font-bold py-1 bg-green-200 text-green-600'>
              {knownStatus}
            </p>
          </div>
        </div>
        <Flashcard
          cards={ORIGINAL_DATA}
          height='h-118'
          onProgress={onProgress}
          setKnownStatus={setKnownStatus}
          setUnknownStatus={setUnknownStatus}
          knownStatus={knownStatus}
          unknownStatus={unknownStatus}
        />
        <div className='flex items-center gap-2'>
          Theo dõi tiến độ
          <button
            onClick={() => setOnProgress(!onProgress)}
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
      </div>{' '}
    </>
  )
}
export default FlashCardPage
