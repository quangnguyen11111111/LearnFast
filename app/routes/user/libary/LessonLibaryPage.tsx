import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

interface CourseItem {
  id: string
  title: string
  terms: number
  author: string
  avatar: string
  date: string
  month: string
}

const LessonLibaryPage = () => {

  // Dữ liệu mẫu
  const courses: CourseItem[] = [
    {
      id: '1',
      title: 'ffd',
      terms: 2,
      author: 'quizlette848489',
      avatar: '',
      date: '2 thuật ngữ',
      month: 'THÁNG 11 NĂM 2025'
    },
    {
      id: '2',
      title: 'ETS 2022 Part 1 Vocabulary #1',
      terms: 37,
      author: 'ETMinhVu',
      avatar: '',
      date: '37 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '3',
      title: 'ETS 2022 Part 1 Vocabulary #6',
      terms: 40,
      author: 'ETMinhVu',
      avatar: '',
      date: '40 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '4',
      title: 'ETS 2023 Part 1 Vocabulary #1',
      terms: 41,
      author: 'ETMinhVu',
      avatar: '',
      date: '41 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '5',
      title: 'ETS 2023 Part 1 Vocabulary #2',
      terms: 38,
      author: 'ETMinhVu',
      avatar: '',
      date: '38 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    }
  ]

  // Nhóm courses theo tháng
  const groupedCourses = courses.reduce(
    (acc, course) => {
      if (!acc[course.month]) {
        acc[course.month] = []
      }
      acc[course.month].push(course)
      return acc
    },
    {} as Record<string, CourseItem[]>
  )

    const [searchQuery, setSearchQuery] = useState('')
  return (
    <div>
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

      {Object.entries(groupedCourses).map(([month, items]) => (
        <div key={month}>
          <h2 className='text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide'>{month}</h2>
          <div className='space-y-3'>
            {items.map((course) => (
              <div
                key={course.id}
                className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-sm text-gray-600'>{course.date}</span>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-700 font-medium'>{course.author}</span>
                      </div>
                    </div>
                    <h3 className='text-lg font-bold text-gray-900'>{course.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default LessonLibaryPage
