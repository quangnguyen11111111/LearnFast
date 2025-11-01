import React from 'react'

interface ProgressBarProps {
  current?: number
  total?: number
  type?: 'block' | 'solid' // block = thanh gãy đoạn, solid = thanh liền
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current = 0, total = 10, type = 'block' }) => {
  const progress = Math.min(current / total, 1)// đảm bảo không vượt quá 1
  const percent = Math.round(progress * 100)

  return (
    <div className="w-full mb-4">
      {/* Nhãn tiến trình */}
      <div className={`flex justify-between mb-3 ${type === 'solid' ? '' : 'hidden'}`}>
        <span className="font-semibold text-gray-700">
          Tiến trình tổng thể:{' '}
          <span className="font-semibold text-green-600">{percent}%</span>
        </span>
      </div>

      {/* Thanh chính */}
      {type === 'solid' ? (
        // === Thanh liền mạch ===
        <div className="relative flex items-center">
          {/* Vòng tròn trái */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 text-white font-semibold text-sm z-10">
            {current}
          </div>

          {/* Thanh nền */}
          <div className="flex-1 h-4 mx-2 bg-gray-200 rounded-full relative overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full bg-green-600 transition-all duration-500"
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          {/* Vòng tròn phải */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm">
            {total}
          </div>
        </div>
      ) : (
        // === Thanh gãy đoạn ===
        <div className="flex items-center w-full space-x-2">
          {/* Vòng tròn bên trái */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold ${
              progress === 0 ? 'bg-orange-600' : 'bg-green-600'
            }`}
          >
            {current}
          </div>

          {/* Thanh chia đoạn */}
          <div className="flex-1 flex items-center space-x-2">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`h-4 flex-1 rounded-full transition-all duration-500 ${
                  i < Math.floor(progress * 7) ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>

          {/* Vòng tròn bên phải */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 font-semibold text-gray-700">
            {total}
          </div>
        </div>
      )}

      {/* Nhãn dưới */}
      <div className="flex justify-between mt-2  text-gray-600">
        <span className='text-green-700 font-semibold'>Đúng</span>
        <span className='font-semibold'>Tổng số câu hỏi</span>
      </div>
    </div>
  )
}

export default ProgressBar
