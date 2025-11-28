import { useState, useEffect, useRef } from 'react'

// TimerHook: Định nghĩa các hàm điều khiển đồng hồ đếm thời gian
interface TimerHook {
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  formatTime: () => string
}

// useTimer: Hook đếm thời gian dạng mm:ss
// - startTimer: bắt đầu nếu chưa chạy
// - stopTimer: dừng và xóa interval
// - resetTimer: đưa về 0 giây và dừng
// - formatTime: chuyển số giây -> chuỗi mm:ss
export const useTimer = (): TimerHook => {
  const [time, setTime] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
  }

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }

  const resetTimer = () => {
    stopTimer()
    setTime(0)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const formatTime = (): string => {
    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, '0')
    const s = (time % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return { startTimer, stopTimer, resetTimer, formatTime }
}
