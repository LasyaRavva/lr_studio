import { useCallback, useEffect, useRef, useState } from 'react'

// For horizontal swipe carousels (CSS scroll-snap). Tracks which card is nearest the
// centre, marks it with data-on, and lets dots scroll to a card.
export function useSnap(count) {
  const ref = useRef(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      if (el.scrollWidth <= el.clientWidth + 2) return
      const mid = el.scrollLeft + el.clientWidth / 2
      let best = 0, bestDist = Infinity
      ;[...el.children].forEach((k, i) => {
        const d = Math.abs(k.offsetLeft + k.offsetWidth / 2 - mid)
        if (d < bestDist) { bestDist = d; best = i }
      })
      setIndex(best)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    el.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => { el.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [count])

  useEffect(() => {
    ;[...(ref.current?.children || [])].forEach((k, i) => (i === index ? k.setAttribute('data-on', '1') : k.removeAttribute('data-on')))
  }, [index])

  const go = useCallback((i) => {
    const el = ref.current
    const k = el?.children[i]
    if (!k) return
    el.scrollTo({ left: k.offsetLeft - parseFloat(getComputedStyle(el).scrollPaddingLeft || 0), behavior: 'smooth' })
  }, [])

  return { ref, index, go }
}

export function useNarrow(px = 760) {
  const q = `(max-width: ${px}px)`
  const [narrow, setNarrow] = useState(() => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setNarrow(m.matches)
    on()
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [q])
  return narrow
}
