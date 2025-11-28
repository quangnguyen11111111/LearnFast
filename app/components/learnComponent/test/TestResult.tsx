import React from 'react'

const TestResult = ({ time, correct, wrong }: { time: string; correct: number; wrong: number }) => {
  const total = Math.max(correct + wrong, 1)
  const percent = Math.round((correct / total) * 100)

  return (
    <div className='px-6 pt-6'>
      <h1 className='text-3xl font-bold mb-6'>Hãy đối tốt với bản thân, và tiếp tục ôn luyện!</h1>
      <div className='flex items-center gap-12'>
        <div className='flex flex-col items-center'>
          <p className='text-xl font-bold text-gray-600'>Thời gian của bạn: {time}</p>
          <div className='relative mt-1'>
            <svg width='120' height='120'>
              <circle cx='60' cy='60' r='50' className='stroke-orange-300' strokeWidth='12' fill='none' />
              <circle
                cx='60'
                cy='60'
                r='50'
                stroke='#3aee86'
                strokeWidth='12'
                fill='none'
                strokeDasharray={`${(percent / 100) * 314} 314`}
                strokeLinecap='round'
                transform='rotate(-90 60 60)'
              />
            </svg>
            <span className='absolute inset-0 flex items-center justify-center text-xl font-bold'>{percent}%</span>
          </div>
        </div>
        <div className='flex flex-col space-y-3'>
          <div className='flex items-center gap-4'>
            <span className='text-green-600 text-xl font-semibold'>Đúng</span>
            <span className='border px-4 py-1 rounded-full text-lg bg-green-50 border-green-300 text-green-700 font-semibold'>
              {correct}
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-orange-600 text-xl font-semibold'>Sai</span>
            <span className='border px-4 py-1 rounded-full text-lg bg-orange-50 border-orange-300 text-orange-700 font-semibold'>
              {wrong}
            </span>
          </div>
        </div>
      </div>
      <h2 className='mt-2 text-lg font-bold text-gray-600'>Đáp án của bạn</h2>
    </div>
  )
}

export default TestResult
