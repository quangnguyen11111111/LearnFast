import { useCallback, useEffect, useMemo, useState } from 'react'

// FlashcardItem: định nghĩa một thẻ từ vựng cơ bản
export interface FlashcardItem {
  id: string
  source: string
  target: string
  status: number // 0: chưa phân loại, 1: đã biết, 2: chưa biết, 3: học tập trung
}

export interface UseFlashcardsOptions {
  initialData: FlashcardItem[]
  // Callback khi status của một thẻ thay đổi (dùng để sync lên server)
  onStatusChange?: (id: string, newStatus: number) => void
  // Callback khi reset tất cả (dùng để sync lên server)
  onResetAll?: (ids: string[]) => void
  // Callback khi bắt đầu chế độ học tập trung (gọi API cập nhật status 2->3)
  onStartFocusMode?: (ids: string[]) => void
}

export interface UseFlashcardsResult {
  cards: FlashcardItem[]
  allCards: FlashcardItem[] // tất cả thẻ gốc
  onProgress: boolean
  knownCount: number
  unknownCount: number
  focusCount: number // số thẻ đang học tập trung (status = 3)
  isFocusMode: boolean // đang ở chế độ học tập trung hay không
  sessionKey: number // tăng khi bắt đầu chế độ mới để reset UI
  toggleProgress: () => void
  markKnown: (id: string) => void
  markUnknown: (id: string) => void
  resetStatuses: () => void
  startFocusMode: () => void // chuyển unknownCards sang status 3 và lọc chỉ hiển thị chúng
  resetFocusMode: () => void // reset tất cả status 3 về 0
  demo?: boolean
  isNavigationPage: boolean
  setIsNavigationPage: (value: boolean) => void
}

// useFlashcards: quản lý trạng thái theo dõi tiến độ và đánh dấu đã biết / chưa biết
export function useFlashcards({
  initialData,
  onStatusChange,
  onResetAll,
  onStartFocusMode
}: UseFlashcardsOptions): UseFlashcardsResult {
  const [allCards, setAllCards] = useState<FlashcardItem[]>(initialData)
  const [cards, setCards] = useState<FlashcardItem[]>(initialData)
  const [onProgress, setOnProgress] = useState(false)
  const [isNavigationPage, setIsNavigationPage] = useState(false)
  const [isFocusMode, setIsFocusMode] = useState(false) // theo dõi đang ở chế độ tập trung hay không
  const [sessionKey, setSessionKey] = useState(0) // dùng để ép remount UI khi bắt đầu lại

  // Đồng bộ cards khi initialData thay đổi (sau khi API trả về dữ liệu)
  useEffect(() => {
    if (initialData.length > 0) {
      setAllCards(initialData)
      // Kiểm tra nếu có thẻ status = 3 thì chỉ hiển thị những thẻ đó (học tập trung)
      const focusCards = initialData.filter((c) => c.status === 3)
      if (focusCards.length > 0) {
        // Chuyển status 3 về 0 để học như mới (reset counter)
        const focusCardsReset = focusCards.map((c) => ({ ...c, status: 0 }))
        setCards(focusCardsReset)
        setIsFocusMode(true)
      } else {
        setCards(initialData)
        setIsFocusMode(false)
      }
    }
  }, [initialData])

  // Tính count từ cards đang hiển thị (không phải allCards) để reset về 0 khi focus mode
  const knownCount = useMemo(() => cards.filter((c) => c.status === 1).length, [cards])
  const unknownCount = useMemo(() => cards.filter((c) => c.status === 2).length, [cards])
  const focusCount = useMemo(() => allCards.filter((c) => c.status === 3).length, [allCards])

  const toggleProgress = useCallback(() => setOnProgress((p) => !p), [])

  const markKnown = useCallback(
    (id: string) => {
      // Cập nhật cards đang hiển thị
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 1 } : c)))
      // Luôn cập nhật allCards để phản ánh trạng thái mới
      // (đảm bảo lần học tập trung tiếp theo dựa trên dữ liệu hiện tại)
      setAllCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 1 } : c)))
      // Gọi callback để sync lên server
      onStatusChange?.(id, 1)
    },
    [onStatusChange]
  )

  const markUnknown = useCallback(
    (id: string) => {
      // Cập nhật cards đang hiển thị
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 2 } : c)))
      // Luôn cập nhật allCards để phản ánh trạng thái mới
      // (đảm bảo lần học tập trung tiếp theo dựa trên dữ liệu hiện tại)
      setAllCards((prev) => prev.map((c) => (c.id === id ? { ...c, status: 2 } : c)))
      // Gọi callback để sync lên server
      onStatusChange?.(id, 2)
    },
    [onStatusChange]
  )

  const resetStatuses = useCallback(() => {
    // Reset tất cả về trạng thái ban đầu với đầy đủ dữ liệu
    const idsToReset = allCards.filter((c) => c.status !== 0).map((c) => c.id)

    // Reset allCards về status = 0
    const resetAllCards = allCards.map((c) => ({ ...c, status: 0 }))
    setAllCards(resetAllCards)

    // Hiển thị tất cả cards (không còn focus mode)
    setCards(resetAllCards)
    setIsFocusMode(false)
    // Tăng sessionKey để UI remount về từ đầu
    setSessionKey((v) => v + 1)

    // Gọi callback để sync reset lên server
    if (idsToReset.length > 0) {
      onResetAll?.(idsToReset)
    }
  }, [allCards, onResetAll])

  // Chuyển thẻ chưa biết (status = 2) sang chế độ học tập trung (status = 3)
  const startFocusMode = useCallback(() => {
    // Lấy danh sách thẻ chưa biết (status = 2)
    const unknownCards = allCards.filter((c) => c.status === 2)
    const unknownIds = unknownCards.map((c) => c.id)

    if (unknownIds.length > 0) {
      // Gọi callback API để cập nhật status từ 2 -> 3 trên server
      onStartFocusMode?.(unknownIds)

      // Cập nhật allCards: chuyển status 2 -> 3
      setAllCards((prev) => prev.map((c) => (c.status === 2 ? { ...c, status: 3 } : c)))

      // Tạo cards mới với status = 0 để học như lần đầu (reset counter)
      const focusCardsReset = unknownCards.map((c) => ({ ...c, status: 0 }))
      setCards(focusCardsReset)
      setIsFocusMode(true)
      // Tăng sessionKey để UI remount khi vào chế độ tập trung
      setSessionKey((v) => v + 1)
    }
  }, [allCards, onStartFocusMode])

  // Reset tất cả status = 3 về 0 và quay lại hiển thị tất cả cards
  const resetFocusMode = useCallback(() => {
    // Reset status 3 về 0 trong allCards
    const resetAllCards = allCards.map((c) => (c.status === 3 ? { ...c, status: 0 } : c))
    setAllCards(resetAllCards)

    // Hiển thị tất cả cards với status đã reset
    setCards(resetAllCards)
    setIsFocusMode(false)
  }, [allCards])

  return {
    cards,
    allCards,
    onProgress,
    knownCount,
    unknownCount,
    focusCount,
    isFocusMode,
    sessionKey,
    toggleProgress,
    markKnown,
    markUnknown,
    resetStatuses,
    startFocusMode,
    resetFocusMode,
    isNavigationPage,
    setIsNavigationPage
  }
}

export type UseFlashcardsReturn = ReturnType<typeof useFlashcards>
