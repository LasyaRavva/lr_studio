import { useEffect, useState } from 'react'

// True while the element is on (or near) the screen. Used to pause endless animations offscreen.
export function useVisible(ref) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return visible
}
