import React from 'react'

const ProgressBar = ({ current = 0, total = 10 }) => {
  const progress = Math.min(current / total, 1)

  return (
    <div className="flex items-center w-full space-x-2 mb-5">
      {/* Vòng tròn bên trái */}
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-semibold ${
          progress === 0 ? 'bg-orange-600' : 'bg-green-600'
        }`}
      >
        {current}
      </div>

      {/* Thanh chính */}
      <div className="flex-1 flex items-center space-x-2">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`h-4 flex-1 rounded-full transition-all duration-500 ${
              i < Math.floor(progress * 7)
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
          ></div>
        ))}
      </div>

      {/* Vòng tròn bên phải */}
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 font-semibold text-gray-700">
        {total}
      </div>
    </div>
  )
}

export default ProgressBar
