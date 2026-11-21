import { useEffect, useRef, useState } from 'react'
import { process } from '../data.js'

export default function Process() {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section className="section section--light section--tight" id="process">
      <div className="section__head rv"><h2>How a project runs</h2></div>
      <ol className={`steps ${on ? 'in' : ''}`} ref={ref}>
        {process.map((s, i) => (
          <li key={s.title} style={{ '--d': `${i * 0.35}s` }}>
            <span className="steps__n">{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
