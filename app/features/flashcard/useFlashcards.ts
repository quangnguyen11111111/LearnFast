import { useCallback, useMemo, useState } from 'react'

// FlashcardItem: định nghĩa một thẻ từ vựng cơ bản
export interface FlashcardItem {
  id: string
  source: string
  target: string
  status: number // 0: chưa phân loại, 1: đã biết, 2: chưa biết
}

export interface UseFlashcardsOptions {
  initialData: FlashcardItem[]
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
}

// useFlashcards: quản lý trạng thái theo dõi tiến độ và đánh dấu đã biết / chưa biết
export function useFlashcards({ initialData }: UseFlashcardsOptions): UseFlashcardsResult {
  const [cards, setCards] = useState<FlashcardItem[]>(initialData)
  const [onProgress, setOnProgress] = useState(false)

  const knownCount = useMemo(() => cards.filter((c) => c.status === 1).length, [cards])
  const unknownCount = useMemo(() => cards.filter((c) => c.status === 2).length, [cards])

  const toggleProgress = useCallback(() => setOnProgress((p) => !p), [])

  const markKnown = useCallback((id: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 1 } : c)))
  }, [])

  const markUnknown = useCallback((id: string) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 2 } : c)))
  }, [])

  const resetStatuses = useCallback(() => {
    setCards((prev) => prev.map((c) => (c.status !== 0 ? { ...c, status: 0 } : c)))
  }, [])

  return { cards, onProgress, knownCount, unknownCount, toggleProgress, markKnown, markUnknown, resetStatuses }
}

export type UseFlashcardsReturn = ReturnType<typeof useFlashcards>
