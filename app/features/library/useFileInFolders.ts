import { useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '~/store/hook'
import { getFolderFilesThunk, type IFolder } from '../api/folder/folderThunk'
import { getUserFoldersThunk } from '../api/folder/folderThunk'

/**
 * Hook kiểm tra file đã được lưu vào những thư mục nào
 * Load danh sách thư mục và check từng thư mục xem có chứa file không
 *
 * @param fileID - ID của file cần check
 * @param enabled - Có bật hook này không (default: true)
 * @returns {
 *   folders: Danh sách tất cả thư mục
 *   folderHasFile: Map { folderID -> boolean } chỉ ra thư mục nào có file
 *   isLoading: Đang load hay không
 *   hasFileSaved: Có file được lưu trong bất kỳ thư mục nào không
 *   refetch: Hàm để reload dữ liệu
 * }
 */
export const useFileInFolders = (fileID?: string, enabled = true) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const [folders, setFolders] = useState<IFolder[]>([])
  const [folderHasFile, setFolderHasFile] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  const fetchFileStatus = useCallback(async () => {
    if (!user?.userID || !fileID || !enabled) return

    setIsLoading(true)
    try {
      // Bước 1: Lấy danh sách tất cả thư mục của user
      const foldersResult = await dispatch(
        getUserFoldersThunk({
          userID: user.userID,
          page: 1,
          limit: 100 // Lấy tối đa 100 thư mục
        })
      ).unwrap()

      const foldersList = foldersResult.data || []
      setFolders(foldersList)

      // Bước 2: Check từng thư mục xem có chứa file này không
      const hasFileMap: Record<string, boolean> = {}

      for (const folder of foldersList) {
        try {
          const filesResult = await dispatch(
            getFolderFilesThunk({
              folderID: folder.folderID,
              userID: user.userID,
              page: 1,
              limit: 100
            })
          ).unwrap()

          const files = filesResult.data || []
          hasFileMap[folder.folderID] = files.some((f) => f.fileID === fileID)
        } catch (error) {
          hasFileMap[folder.folderID] = false
        }
      }

      setFolderHasFile(hasFileMap)
    } catch (error) {
      console.error('Lỗi khi check file trong thư mục:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, user?.userID, fileID, enabled])

  // Auto fetch khi component mount hoặc dependencies thay đổi
  useEffect(() => {
    fetchFileStatus()
  }, [fetchFileStatus])

  // Lắng nghe sự kiện toàn cục khi trạng thái lưu file trong thư mục thay đổi
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ fileID?: string }>
      if (!fileID) return
      if (custom?.detail?.fileID && custom.detail.fileID === fileID) {
        // Re-check trạng thái khi có thay đổi liên quan tới file hiện tại
        fetchFileStatus()
      }
    }
    // Tên sự kiện: 'folderFileChanged'
    window.addEventListener('folderFileChanged', handler as EventListener)
    return () => {
      window.removeEventListener('folderFileChanged', handler as EventListener)
    }
  }, [fileID, fetchFileStatus])

  // Check xem file đã được lưu trong bất kỳ thư mục nào
  const hasFileSaved = Object.values(folderHasFile).some((has) => has === true)

  return {
    folders,
    folderHasFile,
    isLoading,
    hasFileSaved,
    refetch: fetchFileStatus
  }
}
