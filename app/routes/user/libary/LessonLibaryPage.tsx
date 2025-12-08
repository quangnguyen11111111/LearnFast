interface CourseItem {
  id: string
  title: string
  terms: number
  author: string
  avatar: string
  isTeacher: boolean
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
      isTeacher: false,
      date: '2 thuật ngữ',
      month: 'THÁNG 11 NĂM 2025'
    },
    {
      id: '2',
      title: 'ETS 2022 Part 1 Vocabulary #1',
      terms: 37,
      author: 'ETMinhVu',
      avatar: '',
      isTeacher: true,
      date: '37 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '3',
      title: 'ETS 2022 Part 1 Vocabulary #6',
      terms: 40,
      author: 'ETMinhVu',
      avatar: '',
      isTeacher: true,
      date: '40 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '4',
      title: 'ETS 2023 Part 1 Vocabulary #1',
      terms: 41,
      author: 'ETMinhVu',
      avatar: '',
      isTeacher: true,
      date: '41 thuật ngữ',
      month: 'THÁNG 3 NĂM 2025'
    },
    {
      id: '5',
      title: 'ETS 2023 Part 1 Vocabulary #2',
      terms: 38,
      author: 'ETMinhVu',
      avatar: '',
      isTeacher: true,
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

  return (
    <div>
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
                        {course.isTeacher && (
                          <span className='text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded'>👨‍🏫</span>
                        )}
                        <span className='text-sm text-gray-700 font-medium'>{course.author}</span>
                        {course.isTeacher && (
                          <span className='text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded'>Giáo viên</span>
                        )}
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
