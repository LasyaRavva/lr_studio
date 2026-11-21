import { useRef } from 'react'
import { useVisible } from '../lib/useVisible.js'

const ITEMS = ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Responsive design', 'Figma', 'Vercel', 'Git']

export default function Marquee() {
  const ref = useRef(null)
  const on = useVisible(ref)
  const row = ITEMS.map((t) => <span key={t}>{t}</span>)
  return (
    <div className={`marquee ${on ? '' : 'is-off'}`} aria-hidden="true" ref={ref}>
      <div className="marquee__track">{row}{row}</div>
    </div>
  )
}
