import React from 'react'

interface ProgressBarProps {
  current?: number
  total?: number
  type?: 'block' | 'solid'
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current = 0, total = 10, type = 'block' }) => {
  const progress = Math.min(current / total, 1)
  const percent = Math.round(progress * 100)

  const BLOCKS = 7
  const progressPerBlock = 1 / BLOCKS

  return (
    <div className='w-full mb-4'>
      {type === 'block' ? (
        <div className='flex items-center w-full space-x-2'>
          {/* Trái */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold ${
              progress === 0 ? 'bg-orange-600' : 'bg-green-600'
            }`}
          >
            {current}
          </div>

          {/* Block tiến trình */}
          <div className='flex-1 flex items-center space-x-2'>
            {[...Array(BLOCKS)].map((_, i) => {
              const start = i * progressPerBlock
              const end = (i + 1) * progressPerBlock

              // Mức độ lấp đầy của block (0 → 1)
              const fillLevel = Math.min(Math.max((progress - start) / progressPerBlock, 0), 1)

              return (
                <div key={i} className='h-4 flex-1 bg-gray-300 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-green-500 transition-all duration-500 origin-left'
                    style={{ transform: `scaleX(${fillLevel})` }}
                  ></div>
                </div>
              )
            })}
          </div>

          {/* Phải */}
          <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 font-semibold text-gray-700'>
            {total}
          </div>
        </div>
      ) : (
        // === solid ===
        <div className='relative flex items-center'>
          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-green-700 text-white font-semibold text-sm'>
            {current}
          </div>

          <div className='flex-1 h-4 mx-2 bg-gray-200 rounded-full overflow-hidden'>
            <div
              className='h-full rounded-full bg-green-600 transition-all duration-500'
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm'>
            {total}
          </div>
        </div>
      )}

      {/* Label dưới */}
      <div className='flex justify-between mt-2 text-gray-600'>
        <span className='text-green-700 font-semibold'>Đúng</span>
        <span className='font-semibold'>Tổng số câu hỏi</span>
      </div>
    </div>
  )
}

export default ProgressBar
