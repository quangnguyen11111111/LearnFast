import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { getRecentFilesThunk, getUserFilesThunk, type IFile } from '../api/file/fileThunk'

type FilterType = 'recent' | 'created' // Loại filter: gần đây hoặc đã tạo

/**
 * Hook quản lý danh sách file (thẻ ghi nhớ) của người dùng
 * Hỗ trợ phân trang, filter theo loại, search và group theo tháng
 *
 * @param initialFilter - Filter ban đầu ('recent' hoặc 'created')
 * @returns {
 *   files: Danh sách file thô
 *   groupedFiles: File đã được nhóm theo tháng
 *   isLoading: Trạng thái loading
 *   hasMore: Còn trang tiếp theo không
 *   currentPage: Trang hiện tại
 *   filterType: Loại filter hiện tại
 *   searchQuery: Từ khóa tìm kiếm
 *   setFilterType: Hàm đổi loại filter
 *   setSearchQuery: Hàm cập nhật từ khóa search
 *   loadMore: Hàm load thêm trang
 * }
 */
export const useUserFiles = (initialFilter: FilterType = 'recent') => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  // Danh sách file đã load
  const [files, setFiles] = useState<IFile[]>([])
  // Trang hiện tại
  const [currentPage, setCurrentPage] = useState(1)
  // Trạng thái loading
  const [isLoading, setIsLoading] = useState(false)
  // Còn trang tiếp theo không
  const [hasMore, setHasMore] = useState(true)
  // Loại filter: 'recent' (gần đây) hoặc 'created' (đã tạo)
  const [filterType, setFilterType] = useState<FilterType>(initialFilter)
  // Từ khóa tìm kiếm (filter phía client)
  const [searchQuery, setSearchQuery] = useState('')

  // Ref để tránh gọi API trùng lặp
  const isLoadingRef = useRef(false)

  /**
   * Hàm fetch danh sách file từ API
   * @param page - Số trang cần load
   * @param isInitial - True nếu là lần fetch đầu tiên (reset data)
   */
  const fetchFiles = useCallback(
    async (page: number, isInitial: boolean = false) => {
      if (!user?.userID || isLoadingRef.current) return

      isLoadingRef.current = true
      setIsLoading(true)

      try {
        // Chọn thunk phù hợp dựa trên filterType
        const thunk = filterType === 'recent' ? getRecentFilesThunk : getUserFilesThunk

        const result = await dispatch(
          thunk({
            userID: user.userID,
            page,
            limit: 12 // Mỗi trang 12 file
          })
        ).unwrap()

        if (result.errCode === 0) {
          const newFiles = result.data

          // Nếu là lần đầu thì thay thế, không thì append
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
    [dispatch, user?.userID, filterType]
  )

  // Effect: Load lại từ đầu khi userID hoặc filterType thay đổi
  useEffect(() => {
    if (user?.userID) {
      setFiles([])
      setCurrentPage(1)
      setHasMore(true)
      fetchFiles(1, true)
    }
  }, [user?.userID, filterType])

  /**
   * Hàm load thêm trang tiếp theo
   */
  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore) {
      fetchFiles(currentPage + 1)
    }
  }, [fetchFiles, currentPage, hasMore])

  /**
   * Memo: Nhóm file theo tháng và filter theo từ khóa search
   * Format: { "THÁNG 12 NĂM 2025": [file1, file2, ...] }
   */
  const groupedFiles = useMemo(() => {
    // Filter theo từ khóa search (tên file hoặc tên tác giả)
    const filteredFiles = searchQuery
      ? files.filter(
          (file) =>
            file.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.ownerName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : files

    // Nhóm theo tháng
    return filteredFiles.reduce(
      (acc, file) => {
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

  return {
    files, // Danh sách file thô
    groupedFiles, // File đã nhóm theo tháng
    isLoading, // Đang load hay không
    hasMore, // Còn trang tiếp theo không
    currentPage, // Trang hiện tại
    filterType, // Loại filter hiện tại
    searchQuery, // Từ khóa tìm kiếm
    setFilterType, // Hàm đổi loại filter
    setSearchQuery, // Hàm cập nhật từ khóa
    loadMore // Hàm load thêm
  }
}
