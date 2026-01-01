import { useCallback, useEffect, useMemo, useState } from 'react'

// FlashcardItem: định nghĩa một thẻ từ vựng cơ bản
export interface FlashcardItem {
  id: string
  source: string
  target: string
  status: number // 0: chưa phân loại, 1: đã biết, 2: chưa biết
}

export interface UseFlashcardsOptions {
  initialData: FlashcardItem[]
  // Callback khi status của một thẻ thay đổi (dùng để sync lên server)
  onStatusChange?: (id: string, newStatus: number) => void
  // Callback khi reset tất cả (dùng để sync lên server)
  onResetAll?: (ids: string[]) => void
}

export interface UseFlashcardsResult {
  cards: FlashcardItem[]
  onProgress: boolean
  knownCount: number
  unknownCount: number
  toggleProgress: () => void
  markKnown: (id: string) => void
  markUnknown: (id: string) => void
  resetStatuses: () => void
  demo?: boolean
  isNavigationPage: boolean
  setIsNavigationPage: (value: boolean) => void
}

// useFlashcards: quản lý trạng thái theo dõi tiến độ và đánh dấu đã biết / chưa biết
export function useFlashcards({ initialData, onStatusChange, onResetAll }: UseFlashcardsOptions): UseFlashcardsResult {
  const [cards, setCards] = useState<FlashcardItem[]>(initialData)
  const [onProgress, setOnProgress] = useState(false)
  const [isNavigationPage, setIsNavigationPage] = useState(false)

  // Đồng bộ cards khi initialData thay đổi (sau khi API trả về dữ liệu)
  useEffect(() => {
    if (initialData.length > 0) {
      setCards(initialData)
    }
  }, [initialData])

  const knownCount = useMemo(() => cards.filter((c) => c.status === 1).length, [cards])
  const unknownCount = useMemo(() => cards.filter((c) => c.status === 2).length, [cards])

  const toggleProgress = useCallback(() => setOnProgress((p) => !p), [])

  const markKnown = useCallback(
    (id: string) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 1 } : c)))
      // Gọi callback để sync lên server
      onStatusChange?.(id, 1)
    },
    [onStatusChange]
  )

  const markUnknown = useCallback(
    (id: string) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 2 } : c)))
      // Gọi callback để sync lên server
      onStatusChange?.(id, 2)
    },
    [onStatusChange]
  )

  const resetStatuses = useCallback(() => {
    // Lấy danh sách ID các thẻ có status !== 0 để reset
    const idsToReset = cards.filter((c) => c.status !== 0).map((c) => c.id)
    setCards((prev) => prev.map((c) => (c.status !== 0 ? { ...c, status: 0 } : c)))
    // Gọi callback để sync reset lên server
    if (idsToReset.length > 0) {
      onResetAll?.(idsToReset)
    }
  }, [cards, onResetAll])

  return {
    cards,
    onProgress,
    knownCount,
    unknownCount,
    toggleProgress,
    markKnown,
    markUnknown,
    resetStatuses,
    isNavigationPage,
    setIsNavigationPage
  }
}

export type UseFlashcardsReturn = ReturnType<typeof useFlashcards>
