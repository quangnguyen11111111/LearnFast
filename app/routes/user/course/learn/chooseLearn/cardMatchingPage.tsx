import { use, useMemo } from "react";
import type { Question } from "~/features/cardMatching/types";
import useCardMatching from "~/features/cardMatching/useCardMatching";
import { getRandomItems, shuffleArray } from "~/utils/testUtils";

const CardMatchingPage = () => {
    const initialData: Question[] = [
      { id: '1', source: 'Dog dog hkjfhkjsdhf hskfhsakfjh ahsjkfhjk', target: 'Chó', status: 3, statusMode: 0 },
      { id: '0', source: 'Sun', target: 'Mặt trời', status: 3, statusMode: 0 },
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
    const {} = useCardMatching(initialData);
    const dataRandom = useMemo(() => getRandomItems(initialData, 6), [initialData]);
    // Hàm tách dữ liệu thành mảng gồm các object riêng biệt: { id, source } và { id, target }
    const getCardPairs = (data: Question[]) => {
      const pairs: Array<{ id: string; source?: string; target?: string }> = [];
      data.forEach((item: Question) => {
        pairs.push({ id: item.id, source: item.source });
        pairs.push({ id: item.id, target: item.target });
      });
      return pairs;
    };
    // Sử dụng hàm này với dataRandom
    const cardPairs = shuffleArray( getCardPairs(dataRandom))
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div
          className="w-full h-full grid grid-cols-3 gap-6 p-4"
          style={{ maxWidth: '1200px', minHeight: '80vh' }}
        >
          {cardPairs.map((card, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center border bg-white rounded shadow text-center text-base font-medium h-[120px] w-full overflow-hidden cursor-pointer hover:bg-blue-50 transition"
            >
              <span className="block w-full px-2 truncate" title={card.source || card.target}>
                {card.source || card.target}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
} 
export default CardMatchingPage;