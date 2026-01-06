import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'

const LibaryPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'flashcards' | 'folders'>('flashcards')

  // Khi component mount hoặc URL thay đổi, kiểm tra nếu chưa có subroute thì navigate đến lesson
  useEffect(() => {
    if (location.pathname === '/libary' || location.pathname === '/libary/') {
      navigate('lesson', { replace: true })
    }

    if (location.pathname.includes('/libary/course')) {
      setActiveTab('folders')
    } else if (location.pathname.includes('/libary/lesson')) {
      setActiveTab('flashcards')
    }
  }, [location.pathname, navigate])

  const tabs = [
    { key: 'flashcards', label: 'Thẻ ghi nhớ', link: 'lesson' },
    { key: 'folders', label: 'Thư mục', link: 'course' }
  ]
  return (
    <div className='min-h-screen bg-gray-50 px-6 py-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <h1 className='text-4xl font-bold text-gray-900 mb-8'>Thư viện của bạn</h1>

        {/* Tabs */}
        <div className='flex gap-8 border-b border-gray-300 mb-6'>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any)
                navigate(tab.link)
              }}
              className={`pb-3 font-semibold transition-colors relative ${
                activeTab === tab.key ? 'text-blue-600 border-b-4 border-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course List */}
        <div className='space-y-8'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LibaryPage
