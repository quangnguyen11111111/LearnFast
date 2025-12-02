import { use, useMemo, useState } from 'react'
import type { Question } from '~/features/cardMatching/types'
import useCardMatching from '~/features/cardMatching/useCardMatching'
import { getRandomItems, shuffleArray } from '~/utils/testUtils'

const CardMatchingPage = () => {
  const initialData: Question[] = [
    { id: '1', source: 'Dog dog hkjfhkjsdhf hskfhsakfjh ahsjkfhjk dffffffffffffff ffffffffffffff  ', target: 'Chó', status: 3, statusMode: 0 },
    { id: '0', source: 'Sun lorem ipsum dolor sit amet consectetur adipiscing elit lorem ipsum dolor sit amet consectetur adipiscing elitlorem ipsum dolor sit amet consectetur adipiscing elitlorem ipsum dolor sit amet consectetur adipiscing elitlorem ipsum dolor sit amet consectetur adipiscing elitlorem ipsum dolor sit amet consectetur adipiscing elitlorem ipsum dolor sit amet consectetur adipiscing elitlorem ipsum dolor sit amet consectetur adipiscing elit ', target: 'Mặt trời', status: 3, statusMode: 0 },
    { id: '3', source: 'Water', target: 'Nước', status: 3, statusMode: 0 },
    { id: '4', source: 'Cat', target: 'Mèo', status: 3, statusMode: 0 },
    { id: '5', source: 'Moon', target: 'Mặt trăng', status: 3, statusMode: 0 },
    { id: '6', source: 'Fire', target: 'Lửa', status: 3, statusMode: 0 },
    { id: '7', source: 'Tree', target: 'Cây', status: 3, statusMode: 0 },
    { id: '8', source: 'Book', target: 'Sách', status: 3, statusMode: 0 },
    { id: '9', source: 'Pen', target: 'Bút', status: 0, statusMode: 0 },
    { id: '10', source: 'Car', target: 'Xe hơi', status: 0, statusMode: 0 },
    { id: '11', source: 'Cloud', target: 'Đám mây', status: 0, statusMode: 0 },
    { id: '12', source: 'River', target: 'Dòng sông', status: 0, statusMode: 0 }
  ]
  const {} = useCardMatching(initialData)
  const dataRandom = useMemo(() => getRandomItems(initialData, 6), [])
  // Hàm tách dữ liệu thành mảng gồm các object riêng biệt: { id, source } và { id, target }
  const getCardPairs = (data: Question[]) => {
    const pairs: Array<{ id: string; data?: string }> = []
    data.forEach((item: Question) => {
      pairs.push({ id: item.id, data: item.source })
      pairs.push({ id: item.id, data: item.target })
    })
    return pairs
  }
  // Sử dụng hàm này với dataRandom
  const cardPairs = useMemo(() => shuffleArray(getCardPairs(dataRandom)), [dataRandom])
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set()) // thẻ đã ghép đúng
  const [shakeIndices, setShakeIndices] = useState<number[]>([])

  const handleSelect = (idx: number) => {
    // Nếu đã matched thì không cho chọn nữa
    if (matchedIds.has(cardPairs[idx].id)) return
    if (selectedIndices.includes(idx)) return // đã chọn rồi
    const nextSelected = [...selectedIndices, idx].slice(-2) // chỉ giữ 2 lựa chọn
    setSelectedIndices(nextSelected)

    // Khi đủ 2 thẻ → kiểm tra logic
    if (nextSelected.length === 2) {
      const [first, second] = nextSelected
      const isMatch = cardPairs[first].id === cardPairs[second].id

      if (isMatch) {
        // đúng → lưu id đã match
        setTimeout(() => {
          setMatchedIds((prev) => new Set([...prev, cardPairs[first].id]))
        }, 100)
        // xóa selected sau một chút để animation đẹp hơn
        setSelectedIndices([])
      } else {
        // sai → tạo shake
        setShakeIndices([first, second])

        setTimeout(() => {
          setShakeIndices([])
          setSelectedIndices([])
        }, 600)
      }
    }
  }

  return (
    <div className='max-h-screen h-[calc(100vh-75px)] w-full flex items-center justify-center bg-gray-50'>
      <div className='w-full h-full grid grid-cols-3 gap-x-3 p-2 ' style={{ maxWidth: '1200px', minHeight: '70vh' }}>
        {cardPairs.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            className={`  flex items-center justify-center h-[9rem] w-full
                          border  rounded-xl shadow text-center text-base font-medium
                          transition bg-white cursor-pointer

                          ${matchedIds.has(card.id) ? 'shrink-hide' : ''}
                          ${selectedIndices.includes(idx) ? 'border-blue-500 bg-blue-100' : 'border-gray-200'}

                          ${shakeIndices.includes(idx) ? 'shake border-red-500 bg-red-100' : ''}`}
          >
            <span className=' w-full px-4 line-clamp-3' title={card.data}>
              {card.data}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
export default CardMatchingPage
