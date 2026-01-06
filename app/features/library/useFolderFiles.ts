import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { getFolderFilesThunk, type IFolderFile } from '../api/folder/folderThunk'

interface UseFolderFilesParams {
  folderID?: string // ID của thư mục cần lấy danh sách file
}

/**
 * Hook quản lý danh sách các file (học phần) trong một thư mục cụ thể
 * Dữ liệu được lưu trong Redux store để đồng bộ giữa các component
 *
 * @param folderID - ID của thư mục cần load file
 * @returns {
 *   files: Danh sách file trong thư mục (từ Redux)
 *   isLoading: Trạng thái đang tải
 *   canLoadMore: Còn trang tiếp theo không
 *   loadMore: Hàm load thêm trang
 *   page: Trang hiện tại
 * }
 */
export const useFolderFiles = ({ folderID }: UseFolderFilesParams) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  // Lấy dữ liệu từ Redux store (được quản lý tập trung)
  const { folderFiles, loadingFolderFiles, canNextPageFolderFiles } = useAppSelector((state) => state.folder)

  // Trang hiện tại
  const [page, setPage] = useState(1)
  // Ref để tránh gọi API trùng lặp
  const isLoadingRef = useRef(false)

  /**
   * Hàm fetch danh sách file trong thư mục
   * @param nextPage - Số trang cần load
   * @param isInitial - True nếu là lần fetch đầu tiên
   */
  const fetchFiles = async (nextPage: number, isInitial = false) => {
    if (!folderID) return // Không có folderID thì không fetch
    if (isLoadingRef.current && !isInitial) return // Đang load thì không fetch nữa

    isLoadingRef.current = true
    try {
      await dispatch(
        getFolderFilesThunk({
          folderID,
          userID: user?.userID, // Optional: để check quyền sở hữu
          page: nextPage,
          limit: 12 // Mỗi trang 12 file
        })
      ).unwrap()
      setPage(nextPage)
    } catch (error) {
      console.error('Error fetching folder files:', error)
    } finally {
      isLoadingRef.current = false
    }
  }

  // Effect: Load trang đầu tiên khi folderID thay đổi
  useEffect(() => {
    if (folderID) {
      setPage(1)
      fetchFiles(1, true)
    }
  }, [folderID, user?.userID])

  /**
   * Hàm load thêm trang tiếp theo
   */
  const handleLoadMore = () => {
    if (canNextPageFolderFiles && !isLoadingRef.current) {
      fetchFiles(page + 1)
    }
  }

  return {
    files: folderFiles, // Danh sách file (từ Redux)
    isLoading: loadingFolderFiles, // Trạng thái loading
    canLoadMore: canNextPageFolderFiles, // Còn trang tiếp theo không
    loadMore: handleLoadMore, // Hàm load thêm
    page // Trang hiện tại
  }
}
