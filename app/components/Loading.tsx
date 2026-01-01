interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  fullScreen?: boolean
  color?: string
}

const Loading = ({
  size = 'md',
  text = 'Đang tải dữ liệu...',
  fullScreen = true,
  color = 'border-blue-500'
}: LoadingProps) => {
  // Kích thước spinner theo size
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  }

  const spinner = (
    <div className='flex flex-col items-center gap-4'>
      <div className={`${sizeClasses[size]} ${color} border-t-transparent rounded-full animate-spin`}></div>
      {text && <p className='text-gray-600 font-medium'>{text}</p>}
    </div>
  )

  if (fullScreen) {
    return <div className='flex justify-center items-center h-screen'>{spinner}</div>
  }

  return <div className='flex justify-center items-center py-8'>{spinner}</div>
}

export default Loading
