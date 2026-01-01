// useProgressSync: Hook quản lý việc đồng bộ tiến độ học tập lên server
// - Batch update mỗi 10 giây
// - Gửi khi rời trang (beforeunload)
// - Chỉ gửi những thay đổi chưa sync

import { useCallback, useEffect, useRef } from 'react'
import axiosClient from '~/services/axiosClient'

export interface ProgressChange {
  detailID: string
  flashcardState?: number
  quizState?: number
}

export interface UseProgressSyncOptions {
  fileID: string | null
  userID: string | null
  syncInterval?: number // Mặc định 10 giây
  enabled?: boolean // Cho phép bật/tắt sync
}

export interface UseProgressSyncResult {
  // Thêm một thay đổi vào queue để sync
  queueChange: (change: ProgressChange) => void
  // Thêm nhiều thay đổi cùng lúc (dùng cho reset)
  queueBatchChanges: (changes: ProgressChange[]) => void
  // Force sync ngay lập tức (ví dụ khi nhấn nút lưu)
  syncNow: () => Promise<void>
  // Xóa tất cả pending changes
  clearQueue: () => void
}

// API call để cập nhật tiến độ
const updateProgressAPI = async (
  userID: string,
  fileID: string,
  changes: ProgressChange[]
): Promise<{ success: boolean; failed: string[] }> => {
  const failed: string[] = []

  // Gửi từng change (có thể optimize thành batch API sau)
  await Promise.all(
    changes.map(async (change) => {
      try {
        const response = (await axiosClient.put('/api/files/progress', {
          userID,
          fileID,
          detailID: change.detailID,
          ...(change.flashcardState !== undefined && { flashcardState: change.flashcardState }),
          ...(change.quizState !== undefined && { quizState: change.quizState })
        })) as { data?: { errCode?: number } }
        if (response.data?.errCode !== 0) {
          failed.push(change.detailID)
        }
      } catch (error) {
        console.error('Sync progress failed for:', change.detailID, error)
        failed.push(change.detailID)
      }
    })
  )

  return { success: failed.length === 0, failed }
}

export function useProgressSync({
  fileID,
  userID,
  syncInterval = 10000, // 10 giây
  enabled = true
}: UseProgressSyncOptions): UseProgressSyncResult {
  // Queue các thay đổi chờ sync
  const pendingChangesRef = useRef<Map<string, ProgressChange>>(new Map())
  // Flag để tránh sync trùng lặp
  const isSyncingRef = useRef(false)
  // Interval ID
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Thêm thay đổi vào queue (merge nếu đã có)
  const queueChange = useCallback((change: ProgressChange) => {
    const existing = pendingChangesRef.current.get(change.detailID)
    if (existing) {
      // Merge với change hiện có
      pendingChangesRef.current.set(change.detailID, {
        ...existing,
        ...change
      })
    } else {
      pendingChangesRef.current.set(change.detailID, change)
    }
  }, [])

  // Thêm nhiều thay đổi cùng lúc (dùng cho reset)
  const queueBatchChanges = useCallback((changes: ProgressChange[]) => {
    changes.forEach((change) => {
      const existing = pendingChangesRef.current.get(change.detailID)
      if (existing) {
        pendingChangesRef.current.set(change.detailID, {
          ...existing,
          ...change
        })
      } else {
        pendingChangesRef.current.set(change.detailID, change)
      }
    })
  }, [])

  // Sync tất cả pending changes
  const syncNow = useCallback(async () => {
    if (!enabled || !fileID || !userID) return
    if (isSyncingRef.current) return
    if (pendingChangesRef.current.size === 0) return

    isSyncingRef.current = true

    // Lấy snapshot của pending changes
    const changesToSync = Array.from(pendingChangesRef.current.values())
    // Xóa queue trước khi sync (nếu có change mới trong lúc sync sẽ được queue lại)
    pendingChangesRef.current.clear()

    try {
      const result = await updateProgressAPI(userID, fileID, changesToSync)

      if (!result.success) {
        // Nếu có lỗi, đưa các item failed trở lại queue
        changesToSync
          .filter((c) => result.failed.includes(c.detailID))
          .forEach((c) => pendingChangesRef.current.set(c.detailID, c))

        console.warn('Some progress updates failed:', result.failed)
      }
    } catch (error) {
      // Nếu lỗi network, đưa tất cả trở lại queue
      changesToSync.forEach((c) => pendingChangesRef.current.set(c.detailID, c))
      console.error('Progress sync failed:', error)
    } finally {
      isSyncingRef.current = false
    }
  }, [enabled, fileID, userID])

  // Xóa queue
  const clearQueue = useCallback(() => {
    pendingChangesRef.current.clear()
  }, [])

  // Setup interval sync
  useEffect(() => {
    if (!enabled || !fileID || !userID) return

    // Sync mỗi 10 giây
    intervalRef.current = setInterval(() => {
      syncNow()
    }, syncInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, fileID, userID, syncInterval, syncNow])

  // Sync khi rời trang
  useEffect(() => {
    if (!enabled || !fileID || !userID) return

    const handleBeforeUnload = () => {
      // Sử dụng sendBeacon để đảm bảo request được gửi khi trang đóng
      if (pendingChangesRef.current.size === 0) return

      const changes = Array.from(pendingChangesRef.current.values())
      const payload = JSON.stringify({
        userID,
        fileID,
        changes
      })

      // sendBeacon là cách tốt nhất để gửi data khi trang đóng
      // Tuy nhiên cần backend hỗ trợ batch endpoint
      // Fallback: gửi sync request thường
      navigator.sendBeacon?.('/api/files/progress/batch', payload)
    }

    const handleVisibilityChange = () => {
      // Sync khi tab bị ẩn (user chuyển tab)
      if (document.visibilityState === 'hidden') {
        syncNow()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      // Sync lần cuối khi unmount
      syncNow()
    }
  }, [enabled, fileID, userID, syncNow])

  return {
    queueChange,
    queueBatchChanges,
    syncNow,
    clearQueue
  }
}

export default useProgressSync
