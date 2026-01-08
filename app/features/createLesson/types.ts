// Types for Create Lesson feature

export interface LessonItem {
  source: string
  target: string
  index: number
}

export interface AIGenerateData {
  topic: string
  count: number
  sourceLang: string
  targetLang: string
}

export interface CreateLessonState {
  title: string
  description: string
  isLoading: boolean
  isAIGenerating: boolean
  isAIModalOpen: boolean
  globalSourceLang: string
  globalTargetLang: string
  visibility: 'public' | 'private'
  lessonItems: LessonItem[]
  isRemove: boolean
}

export interface CreateLessonActions {
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setIsAIModalOpen: (isOpen: boolean) => void
  setGlobalSourceLang: (lang: string) => void
  setGlobalTargetLang: (lang: string) => void
  setVisibility: (visibility: 'public' | 'private') => void
  handleItemChange: (index: number, key: 'source' | 'target', value: string) => void
  handleAddItem: () => void
  handleDeleteItem: (index: number) => void
  handleAIGenerate: (data: AIGenerateData) => Promise<void>
  handleCreateLesson: (shouldNavigateToLearn?: boolean) => Promise<void>
  setIsRemove: (isRemove: boolean) => void
}

export type UseCreateLessonReturn = CreateLessonState & CreateLessonActions
