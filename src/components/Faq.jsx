import { useEffect, useRef } from 'react'
import { faq } from '../data.js'

export default function Faq() {
  const root = useRef(null)

  // Lets the search box open a specific question.
  useEffect(() => {
    const open = (e) => {
      const el = root.current?.querySelector(`#faq-${e.detail}`)
      if (!el) return
      el.open = true
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.querySelector('summary')?.focus({ preventScroll: true })
    }
    window.addEventListener('open-faq', open)
    return () => window.removeEventListener('open-faq', open)
  }, [])

  return (
    <section className="section section--light section--tight" id="faq">
      <div className="section__head rv"><h2>Questions we often get</h2></div>
      <div className="faq rv" ref={root}>
        {faq.map((f) => (
          <details key={f.id} id={`faq-${f.id}`}>
            <summary>{f.q}<span className="faq__icon" aria-hidden="true" /></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
