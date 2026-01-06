import { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { getUserFoldersThunk, type IFolder } from '../api/folder/folderThunk'

/**
 * Hook quản lý danh sách thư mục của người dùng với phân trang tự động
 *
 * @returns {
 *   folders: Danh sách thư mục đã load
 *   isLoading: Trạng thái đang tải dữ liệu
 *   hasMore: Còn trang tiếp theo không
 *   currentPage: Trang hiện tại
 *   loadMore: Hàm load thêm trang tiếp theo
 *   fetchFolders: Hàm fetch thủ công (dùng khi cần reset)
 * }
 */
export const useUserFolders = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  // Danh sách thư mục đã load (tích lũy qua các trang)
  const [folders, setFolders] = useState<IFolder[]>([])
  // Trang hiện tại đang load
  const [currentPage, setCurrentPage] = useState(1)
  // Còn trang tiếp theo không
  const [hasMore, setHasMore] = useState(true)
  // Trạng thái loading cho UI
  const [isLoading, setIsLoading] = useState(false)
  // Ref để tránh gọi API trùng lặp khi scroll nhanh
  const isLoadingRef = useRef(false)

  /**
   * Hàm fetch danh sách thư mục từ API
   * @param page - Số trang cần load
   * @param isInitial - True nếu là lần fetch đầu tiên (reset data)
   */
  const fetchFolders = useCallback(
    async (page: number, isInitial = false) => {
      // Kiểm tra điều kiện: có userID và không đang load
      if (!user?.userID || isLoadingRef.current) return

      isLoadingRef.current = true
      setIsLoading(true)

      try {
        const result = await dispatch(
          getUserFoldersThunk({
            userID: user.userID,
            page,
            limit: 12 // Mỗi trang 12 thư mục
          })
        ).unwrap()

        if (result.errCode === 0) {
          const newFolders = result.data || []
          // Nếu là lần đầu thì thay thế, không thì append vào cuối
          if (isInitial) {
            setFolders(newFolders)
          } else {
            setFolders((prev) => [...prev, ...newFolders])
          }
          setHasMore(result.canNextPage ?? false)
          setCurrentPage(page)
        }
      } catch (error) {
        console.error('Error fetching folders:', error)
      } finally {
        setIsLoading(false)
        isLoadingRef.current = false
      }
    },
    [dispatch, user?.userID]
  )

  // Effect: Load trang đầu tiên khi có userID
  useEffect(() => {
    if (user?.userID) {
      setFolders([])
      setCurrentPage(1)
      setHasMore(true)
      fetchFolders(1, true)
    }
  }, [user?.userID, fetchFolders])

  /**
   * Hàm load thêm trang tiếp theo
   * Thường được gọi bởi Intersection Observer khi scroll đến cuối
   */
  const loadMore = useCallback(() => {
    if (!isLoadingRef.current && hasMore) {
      fetchFolders(currentPage + 1)
    }
  }, [fetchFolders, currentPage, hasMore])

  return {
    folders, // Danh sách thư mục
    isLoading, // Đang load hay không
    hasMore, // Còn trang tiếp theo không
    currentPage, // Trang hiện tại
    loadMore, // Hàm load thêm
    fetchFolders // Hàm fetch thủ công
  }
}
