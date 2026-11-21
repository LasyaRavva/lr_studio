import { useRef, useState } from 'react'
import { services } from '../data.js'

export default function Services() {
  const [i, setI] = useState(0)
  const s = services[i]
  const tabs = useRef([])

  function onKeyDown(e) {
    const n = services.length
    let next = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % n
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + n) % n
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = n - 1
    if (next === null) return
    e.preventDefault()
    setI(next)
    tabs.current[next]?.focus()
  }
  return (
    <section className="section section--light section--tight" id="services">
      <div className="section__head rv"><h2>What we build</h2></div>
      <div className="svc rv">
        <div className="svc__tabs" role="tablist" aria-label="Services" onKeyDown={onKeyDown}>
          {services.map((x, n) => (
            <button
              key={x.title}
              ref={(el) => (tabs.current[n] = el)}
              tabIndex={i === n ? 0 : -1}
              role="tab"
              id={`tab-${n}`}
              aria-selected={i === n}
              aria-controls="svc-panel"
              className={i === n ? 'on' : ''}
              onClick={() => setI(n)}
              onMouseEnter={() => setI(n)}
            >
              {x.title}
            </button>
          ))}
        </div>
        <div className="svc__panel" id="svc-panel" role="tabpanel" aria-labelledby={`tab-${i}`} key={i}>
          <p>{s.text}</p>
          <ul>
            {s.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
