import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { getFileDetailThunk, getRecentFilesThunk, type IFile } from '~/features/api/file/fileThunk'
import { useNavigate } from 'react-router'

const LessonLibaryPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  // Lấy user từ Redux store
  const user = useAppSelector((state) => state.auth.user)

  // State lưu trữ dữ liệu files
  const [files, setFiles] = useState<IFile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Ref cho observer
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const isLoadingRef = useRef(false)

  // Hàm fetch dữ liệu
  const fetchFiles = useCallback(
    async (page: number, isInitial: boolean = false) => {
      if (!user?.userID || isLoadingRef.current) return

      isLoadingRef.current = true
      setIsLoading(true)

      try {
        const result = await dispatch(
          getRecentFilesThunk({
            userID: user.userID,
            page,
            limit: 12
          })
        ).unwrap()

        if (result.errCode === 0) {
          const newFiles = result.data

          if (isInitial) {
            setFiles(newFiles)
          } else {
            setFiles((prev) => [...prev, ...newFiles])
          }

          setHasMore(result.canNextPage ?? false)
          setCurrentPage(page)
        }
      } catch (error) {
        console.error('Error fetching files:', error)
      } finally {
        setIsLoading(false)
        isLoadingRef.current = false
      }
    },
    [dispatch, user?.userID]
  )

  // Fetch dữ liệu lần đầu khi component mount
  useEffect(() => {
    if (user?.userID) {
      setFiles([])
      setCurrentPage(1)
      setHasMore(true)
      fetchFiles(1, true)
    }
  }, [user?.userID])

  // Hàm load thêm dữ liệu
  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore) {
      fetchFiles(currentPage + 1)
    }
  }, [fetchFiles, currentPage, hasMore])

  // Thiết lập Intersection Observer để load thêm khi scroll đến cuối
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0]
        if (firstEntry.isIntersecting && hasMore && !isLoadingRef.current) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMore, hasMore])

  // Nhóm files theo tháng (createdAt)
  const groupedFiles = useMemo(() => {
    // Filter theo search query
    const filteredFiles = searchQuery
      ? files.filter(
          (file) =>
            file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : files

    return filteredFiles.reduce(
      (acc, file) => {
        // API đã trả về format sẵn "THÁNG 12 NĂM 2025"
        const month = file.createdAt || file.openedAt || 'KHÔNG XÁC ĐỊNH'
        if (!acc[month]) {
          acc[month] = []
        }
        acc[month].push(file)
        return acc
      },
      {} as Record<string, IFile[]>
    )
  }, [files, searchQuery])

  const handleLearnFile = (fileID: string) => {
    console.log('Học file với ID:', fileID)

        navigate(`/learn-lesson?fileId=${fileID}`)

  }
  return (
    <div>
      {/* Filter and Search */}
      <div className='flex gap-4 mb-8'>
        <button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition'>
          Gần đây
          <ChevronDownIcon className='size-4' />
        </button>

        <div className='flex-1 max-w-xl'>
          <div className='relative'>
            <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400' />
            <input
              type='text'
              placeholder='Tìm kiếm thẻ ghi nhớ'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>
      </div>

      {/* Loading skeleton cho lần load đầu */}
      {isLoading && files.length === 0 && (
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='bg-white border border-gray-200 rounded-lg p-4 animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-1/4 mb-2'></div>
              <div className='h-6 bg-gray-200 rounded w-3/4'></div>
            </div>
          ))}
        </div>
      )}

      {/* Hiển thị khi không có dữ liệu */}
      {!isLoading && files.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          <p>Chưa có thẻ ghi nhớ nào</p>
        </div>
      )}

      {/* Danh sách files theo tháng */}
      {Object.entries(groupedFiles).map(([month, items]) => (
        <div key={month} className='mb-6'>
          <h2 className='text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide'>{month}</h2>
          <div className='space-y-3'>
            {items.map((file) => (
              <div
                onClick={()=>{handleLearnFile(file.fileID)}}
                key={file.fileID}
                className='bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <span className='text-sm text-gray-600'>{file.totalWords} thuật ngữ</span>
                      <div className='flex items-center gap-2'>
                        {file.ownerAvatar && (
                          <img src={file.ownerAvatar} alt={file.ownerName} className='w-5 h-5 rounded-full' />
                        )}
                        <span className='text-sm text-gray-700 font-medium'>{file.ownerName}</span>
                      </div>
                    </div>
                    <h3 className='text-lg font-bold text-gray-900'>{file.fileName}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Element trigger để load thêm dữ liệu với spinner */}
      {hasMore && (
        <div ref={loadMoreRef} className='h-20 flex items-center justify-center'>
          {isLoading && files.length > 0 && (
            <div className='flex items-center gap-3 text-gray-500'>
              <div className='w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
              <span>Đang tải thêm...</span>
            </div>
          )}
        </div>
      )}

      {/* Thông báo khi đã hết dữ liệu */}
      {!hasMore && files.length > 0 && (
        <div className='py-6 text-center'>
          <p className='text-gray-400 text-sm'>Đã hiển thị tất cả thẻ ghi nhớ</p>
        </div>
      )}
    </div>
  )
}

export default LessonLibaryPage

// tiêu đề gia diẹnn: Thư viện - Thẻ ghi nhớ
export const meta = () => [{ title: 'Thư viện - Thẻ ghi nhớ' }]
