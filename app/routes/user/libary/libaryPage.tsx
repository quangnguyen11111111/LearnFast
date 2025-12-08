import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Outlet, useNavigate, useLocation } from 'react-router'


const LibaryPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<'flashcards' | 'folders'>('flashcards')
  const [searchQuery, setSearchQuery] = useState('')

  // Khi component mount hoặc URL thay đổi, kiểm tra nếu chưa có subroute thì navigate đến lesson
  useEffect(() => {
    if (location.pathname === '/libary' || location.pathname === '/libary/') {
      navigate('lesson', { replace: true })
    }
    if (location.pathname.includes('/libary/course')) {
      setActiveTab('folders')
    }
  }, [location.pathname, navigate])


  const tabs = [
    { key: 'flashcards', label: 'Thẻ ghi nhớ',link: 'lesson' },
    { key: 'folders', label: 'Thư mục', link: 'course' },
  ]
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Thư viện của bạn</h1>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-300 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any)
                navigate(tab.link)
              }}
              className={`pb-3 font-semibold transition-colors relative ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-4 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter and Search */}
        <div className="flex gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">
            Gần đây
            <ChevronDownIcon className="size-4" />
          </button>

          <div className="flex-1 max-w-xl">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm thẻ ghi nhớ"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LibaryPage