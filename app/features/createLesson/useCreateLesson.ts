import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import { createFileApi, aiGenerateFlashcardsApi } from '~/features/api/file/fileAPI'
import { useAppSelector } from '~/store/hook'
import type { LessonItem, AIGenerateData, UseCreateLessonReturn } from './types'

const MIN_LESSON_ITEMS = 4
const MAX_AI_GENERATE_COUNT = 50

const initialLessonItems: LessonItem[] = [
  { source: '', target: '', index: 1 },
  { source: '', target: '', index: 2 },
  { source: '', target: '', index: 3 },
  { source: '', target: '', index: 4 }
]

export const useCreateLesson = (): UseCreateLessonReturn => {
  const navigate = useNavigate()

  // Get user from Redux store
  const user = useAppSelector((state) => state.auth.user)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [isRemove, setIsRemove] = useState(false)

  // AI Modal state
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)

  // Global language settings for all items
  const [globalSourceLang, setGlobalSourceLang] = useState('english')
  const [globalTargetLang, setGlobalTargetLang] = useState('vietnam')

  // Visibility setting
  const [visibility, setVisibility] = useState<'public' | 'private'>('public')

  // Lesson items
  const [lessonItems, setLessonItems] = useState<LessonItem[]>(initialLessonItems)

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

  // Handle AI generation
  const handleAIGenerate = async (data: AIGenerateData) => {
    // Validate user
    if (!user?.userID) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng AI')
      return
    }

    // Validate count
    const count = Math.min(Math.max(data.count, 1), MAX_AI_GENERATE_COUNT)

    setIsAIGenerating(true)
    setIsAIModalOpen(false)

    try {
      const response = await aiGenerateFlashcardsApi({
        topic: data.topic,
        count,
        sourceLang: data.sourceLang,
        targetLang: data.targetLang,
        userID: user.userID
      })

      if (response.errCode === 0 && response.data && response.data.length > 0) {
        // Update global language settings
        setGlobalSourceLang(data.sourceLang)
        setGlobalTargetLang(data.targetLang)

        // Convert AI response to LessonItem format
        const aiGeneratedItems: LessonItem[] = response.data.map((item) => ({
          source: item.source,
          target: item.target,
          index: item.index
        }))

        // Replace current lesson items with AI generated items
        setLessonItems(aiGeneratedItems)

        // Auto set title if empty
        if (!title.trim()) {
          setTitle(`${data.topic.charAt(0).toUpperCase() + data.topic.slice(1)} - AI Generated`)
        }

        toast.success(`Đã tạo ${response.data.length} thẻ về chủ đề "${data.topic}"`)
      } else {
        toast.error(response.message || 'Không thể tạo flashcards')
      }
    } catch (error: any) {
      console.error('AI Generate error:', error)
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo flashcards bằng AI')
    } finally {
      setIsAIGenerating(false)
    }
  }

  // Validate and create lesson
  const handleCreateLesson = async (shouldNavigateToLearn: boolean = false) => {
    // Validate title
    if (!title.trim()) {
      toast.error('Vui lòng nhập tiêu đề bài học')
      return
    }

    // Validate user
    if (!user?.userID) {
      toast.error('Vui lòng đăng nhập để tạo bài học')
      return
    }

    // Filter valid items (có cả source và target)
    const validItems = lessonItems.filter((item) => item.source.trim().length > 0 && item.target.trim().length > 0)

    // Validate minimum items
    if (validItems.length < MIN_LESSON_ITEMS) {
      toast.error(`Cần tối thiểu ${MIN_LESSON_ITEMS} thẻ có đầy đủ thuật ngữ và định nghĩa`)
      return
    }

    setIsLoading(true)
    try {
      const payload = {
        fileName: title.trim(),
        creatorID: user.userID,
        visibility: visibility,
        sourceLang: globalSourceLang,
        targetLang: globalTargetLang,
        arrFileDetail: validItems.map((item) => ({
          source: item.source.trim(),
          target: item.target.trim()
        }))
      }

      const response = await createFileApi(payload)

      if (response.errCode === 0) {
        toast.success('Tạo bài học thành công!')
        if (shouldNavigateToLearn && response.data?.fileID) {
          navigate(`/learn-lesson?fileId=${response.data.fileID}`)
        } else {
          navigate('/libary/lesson?view=created')
        }
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tạo bài học')
      }
    } catch (error: any) {
      console.error('Create lesson error:', error)
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo bài học')
    } finally {
      setIsLoading(false)
    }
  }


  return {
    // State
    title,
    description,
    isLoading,
    isAIGenerating,
    isAIModalOpen,
    globalSourceLang,
    globalTargetLang,
    visibility,
    lessonItems,
    isRemove,
    // Actions
    setTitle,
    setDescription,
    setIsAIModalOpen,
    setGlobalSourceLang,
    setGlobalTargetLang,
    setVisibility,
    handleItemChange,
    handleAddItem,
    handleDeleteItem,
    handleAIGenerate,
    handleCreateLesson,
    setIsRemove
  }
}
