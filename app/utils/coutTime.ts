import  { useState, useEffect, useRef } from 'react'
interface TimerHook {
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  formatTime:()=>string

}
export const useTimer = (): TimerHook => {
  const [time, setTime] = useState<number>(0) // thời gian tính bằng giây
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Bắt đầu timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true)
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
  }

  // Dừng timer
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRunning(false)
  }

  // Reset timer về 0
  const resetTimer = () => {
    stopTimer()
    setTime(0)
  }

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Chuyển giây sang mm:ss
  const formatTime = (): string => {
    const m = Math.floor(time / 60)
      .toString()
      .padStart(2, '0')
    const s = (time % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }
  return {startTimer,stopTimer,resetTimer,formatTime}
}
