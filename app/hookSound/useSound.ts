import { useCallback } from 'react'

export const useSound = () => {
  const playSuccessSound = useCallback(() => {
    try {
      // Tạo audio context để phát âm thanh
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const now = audioContext.currentTime
      
      // Tạo oscillator cho nốt nhạc cao (success sound)
      const oscillator1 = audioContext.createOscillator()
      const oscillator2 = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      // Kết nối các node
      oscillator1.connect(gainNode)
      oscillator2.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Thiết lập các nốt nhạc
      oscillator1.frequency.value = 800 // Tần số cao
      oscillator2.frequency.value = 1200 // Tần số cao hơn
      
      // Thiết lập độ lớn âm thanh
      gainNode.gain.setValueAtTime(0.3, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      
      // Phát âm thanh
      oscillator1.start(now)
      oscillator2.start(now + 0.05)
      oscillator1.stop(now + 0.2)
      oscillator2.stop(now + 0.2)
    } catch (error) {
      console.log('Không thể phát âm thanh:', error)
    }
  }, [])

  return { playSuccessSound }
}
