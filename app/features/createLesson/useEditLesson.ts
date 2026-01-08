import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import { updateFileApi } from '~/features/api/file/fileAPI'
import { getFileDetailApi } from '~/features/api/file/fileAPI'
import { useAppSelector } from '~/store/hook'
import type { LessonItem, UseCreateLessonReturn } from './types'

const MIN_LESSON_ITEMS = 4

export const useEditLesson = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fileID = searchParams.get('fileId')

  // Get user và loading từ Redux store
  const { user, loading } = useAppSelector((state) => state.auth)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)

  // Global language settings for all items
  const [globalSourceLang, setGlobalSourceLang] = useState('english')
  const [globalTargetLang, setGlobalTargetLang] = useState('vietnam')

  // Visibility setting
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')

  // Lesson items
  const [lessonItems, setLessonItems] = useState<LessonItem[]>([])

  // Load file detail - chờ auth loading xong rồi mới load file data
  useEffect(() => {
    // Nếu auth đang loading hoặc fileID chưa có, chưa load
    if (loading || !fileID || !user?.userID) {
      if (!loading && (!fileID || !user?.userID)) {
        setIsLoadingInitial(false)
      }
      return
    }

    const loadFileData = async () => {
      try {
        const response = (await getFileDetailApi(fileID, user.userID)) as any
        if (response.errCode === 0 && response.data) {
          const details = response.data as Array<{ detailID: string; source: string; target: string; fileID: string }>
          const ownerInfo = response.ownerInfo

          setTitle(ownerInfo?.fileName || '')
          setVisibility((ownerInfo?.visibility as 'public' | 'private') || 'public')

          // Convert file details to lesson items
          const items: LessonItem[] = details.map((detail: any, idx: number) => ({
            source: detail.source,
            target: detail.target,
            index: idx + 1
          }))

          setLessonItems(
            items.length > 0
              ? items
              : Array(4)
                  .fill(null)
                  .map((_, i) => ({ source: '', target: '', index: i + 1 }))
          )
        } else {
          toast.error('Không thể tải dữ liệu file')
          navigate(-1)
        }
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu file')
        navigate(-1)
      } finally {
        setIsLoadingInitial(false)
      }
    }

    loadFileData()
  }, [fileID, user?.userID, loading, navigate])

  // Update field of one item
  const handleItemChange = (index: number, key: 'source' | 'target', value: string) => {
    setLessonItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  }

  // Add new item
  const handleAddItem = () => {
    setLessonItems((prev) => [
      ...prev,
      { source: '', target: '', index: prev.length > 0 ? prev[prev.length - 1].index + 1 : 1 }
    ])
  }

  // Delete one item
  const handleDeleteItem = (index: number) => {
    if (lessonItems.length <= MIN_LESSON_ITEMS) {
      toast.error(`Tối thiểu phải có ${MIN_LESSON_ITEMS} thẻ`)
      return
    }
    setLessonItems((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle update lesson (only 1 button)
  const handleCreateLesson = async () => {
    // Validate
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài học')
      return
    }

    if (lessonItems.length < MIN_LESSON_ITEMS) {
      toast.error(`Phải có ít nhất ${MIN_LESSON_ITEMS} thẻ`)
      return
    }

    const validItems = lessonItems.filter((item) => item.source.trim().length > 0)
    if (validItems.length < MIN_LESSON_ITEMS) {
      toast.error(`Phải có ít nhất ${MIN_LESSON_ITEMS} thẻ có dữ liệu`)
      return
    }

    if (!fileID || !user?.userID) {
      toast.error('Thiếu thông tin cần thiết')
      return
    }

    setIsLoading(true)
    try {
      const response = await updateFileApi({
        fileID,
        creatorID: user.userID,
        fileName: title.trim(),
        visibility,
        arrFileDetail: validItems.map((item) => ({
          source: item.source.trim(),
          target: item.target.trim()
        }))
      })

      if (response.errCode === 0) {
        toast.success('Cập nhật bài học thành công')
        // Navigate back to lesson detail page
        navigate(`/learn-lesson?fileId=${fileID}`, { replace: true })
      } else {
        toast.error(response.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật bài học')
      console.error('Error updating lesson:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // State
    title,
    description,
    isLoading,
    isLoadingInitial,
    globalSourceLang,
    globalTargetLang,
    visibility,
    lessonItems,
    // Actions
    setTitle,
    setDescription,
    setGlobalSourceLang,
    setGlobalTargetLang,
    setVisibility,
    handleItemChange,
    handleAddItem,
    handleDeleteItem,
    handleCreateLesson,
    fileID
  }
}
