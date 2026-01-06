import { useCallback, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { updateFolderNameThunk, deleteFolderThunk } from '../api/folder/folderThunk'

interface UseFolderManagementParams {
  folderID?: string
}

/**
 * Hook quản lý thông tin và thao tác với một thư mục cụ thể
 * Bao gồm: lấy tên thư mục, đổi tên thư mục
 *
 * @param folderID - ID của thư mục cần quản lý
 * @returns {
 *   folderName: Tên thư mục hiện tại (lấy từ Redux hoặc route state)
 *   isEditModalOpen: Trạng thái mở modal chỉnh sửa
 *   setIsEditModalOpen: Hàm đóng/mở modal
 *   newFolderName: Tên mới đang nhập
 *   setNewFolderName: Hàm cập nhật tên mới
 *   isUpdating: Đang cập nhật hay không
 *   handleUpdateFolderName: Hàm xử lý cập nhật tên
 *   openEditModal: Hàm mở modal chỉnh sửa với tên hiện tại
 * }
 */
export const useFolderManagement = ({ folderID }: UseFolderManagementParams) => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)
  const { folders } = useAppSelector((state) => state.folder)

  // State cho modal chỉnh sửa tên
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  // State cho xóa thư mục
  const [isDeleting, setIsDeleting] = useState(false)

  /**
   * Lấy tên thư mục từ nhiều nguồn:
   * 1. Route state (khi navigate từ trang khác)
   * 2. Redux store (nếu đã load danh sách thư mục)
   * 3. Fallback về folderID nếu không tìm thấy
   */
  const folderName = useMemo(() => {
    const matched = folders?.find((f) => f.folderID === folderID)
    const stateName = (location.state as any)?.folderName
    // Ưu tiên dữ liệu Redux (đã cập nhật sau khi đổi tên), fallback route state
    return matched?.folderName || stateName || folderID
  }, [folders, location.state, folderID])

  /**
   * Hàm mở modal chỉnh sửa tên thư mục
   * Tự động điền tên hiện tại vào input
   */
  const openEditModal = () => {
    setNewFolderName(folderName)
    setIsEditModalOpen(true)
  }

  /**
   * Hàm xử lý cập nhật tên thư mục
   * - Gọi API cập nhật
   * - Redux tự động cập nhật state
   * - Đóng modal khi thành công
   */
  const handleUpdateFolderName = async () => {
    if (!folderID || !user?.userID || !newFolderName.trim()) return

    setIsUpdating(true)
    try {
      await dispatch(
        updateFolderNameThunk({
          folderID,
          userID: user.userID,
          folderName: newFolderName.trim()
        })
      ).unwrap()
      // Đóng modal và reset input
      setIsEditModalOpen(false)
      setNewFolderName('')
    } catch (error) {
      console.error('Error updating folder name:', error)
      const message = typeof error === 'string' ? error : 'Không thể cập nhật tên thư mục'
      toast.error(message)
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Hàm xóa thư mục
   * - Gọi API xóa
   * - Redux tự động xóa khỏi danh sách
   * - Navigate về trang thư mục người dùng
   */
  const deleteFolder = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!folderID || !user?.userID) {
      return { success: false, message: 'Thiếu thông tin thư mục hoặc người dùng' }
    }

    setIsDeleting(true)
    try {
      await dispatch(
        deleteFolderThunk({
          folderID,
          userID: user.userID
        })
      ).unwrap()
      return { success: true, message: 'Xóa thư mục thành công' }
    } catch (error) {
      console.error('Error deleting folder:', error)
      const message = typeof error === 'string' ? error : 'Không thể xóa thư mục'
      return { success: false, message }
    } finally {
      setIsDeleting(false)
    }
  }, [folderID, user?.userID, dispatch])

  return {
    folderName, // Tên thư mục hiện tại
    isEditModalOpen, // Trạng thái modal
    setIsEditModalOpen, // Hàm đóng/mở modal
    newFolderName, // Tên mới đang nhập
    setNewFolderName, // Hàm cập nhật input
    isUpdating, // Đang update hay không
    handleUpdateFolderName, // Hàm xử lý update
    openEditModal, // Hàm mở modal với tên hiện tại
    deleteFolder, // Hàm xóa thư mục
    isDeleting // Đang xóa hay không
  }
}
