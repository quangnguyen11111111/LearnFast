import { useEffect, useState } from 'react'

export default function useIsScrolled(threshold: number = 50): boolean {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handleScroll = () => {
      const scrolled = window.scrollY > threshold
      setIsScrolled(scrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  return isScrolled
}
