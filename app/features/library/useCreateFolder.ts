import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { createFolderThunk, type IFolder } from '../api/folder/folderThunk'

interface UseCreateFolderReturn {
  isCreating: boolean
  createFolder: (folderName: string) => Promise<IFolder | null>
}

/**
 * Hook quản lý tạo thư mục mới
 * - Gọi API tạo folder
 * - Hiển thị toast notification
 * - Cập nhật Redux state
 * - Chuyển hướng đến trang /course/{folderID}
 */
export const useCreateFolder = (): UseCreateFolderReturn => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)

  const [isCreating, setIsCreating] = useState(false)

  const createFolder = async (folderName: string): Promise<IFolder | null> => {
    // Validate input
    if (!folderName || !folderName.trim()) {
      toast.error('Vui lòng nhập tên thư mục')
      return null
    }

    if (!user?.userID) {
      toast.error('Vui lòng đăng nhập trước')
      return null
    }

    setIsCreating(true)

    try {
      const result = await dispatch(
        createFolderThunk({
          folderName: folderName.trim(),
          userID: user.userID
        })
      ).unwrap()

      // Hiển thị thông báo thành công
      toast.success(result.message || 'Tạo thư mục thành công')

      // Chuyển hướng đến trang /course/{folderID}
      const folderID = result.data.folderID
      navigate(`/course/${folderID}`, { state: { folderName: result.data.folderName }, replace: true })

      return result.data
    } catch (error: any) {
      const errorMessage = error || 'Không thể tạo thư mục'
      toast.error(errorMessage)
      console.error('Error creating folder:', error)
      return null
    } finally {
      setIsCreating(false)
    }
  }

  return {
    isCreating,
    createFolder
  }
}
