import { useEffect, useState } from 'react'
import { studio } from '../data.js'

const I = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }

const ITEMS = [
  { id: 'work', label: 'Work', href: '#work', icon: <svg viewBox="0 0 24 24" {...I}><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg> },
  { id: 'pricing', label: 'Pricing', href: '#pricing', icon: <svg viewBox="0 0 24 24" {...I}><path d="M20 12l-8 8-9-9V3h8z" /><circle cx="7.5" cy="7.5" r="1.2" /></svg> },
  { id: 'ai', label: 'Ask AI', center: true },
  { id: 'ig', label: 'Instagram', icon: <svg viewBox="0 0 24 24" {...I}><rect x="3" y="3" width="18" height="18" rx="5.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></svg> },
  { id: 'contact', label: 'Contact', href: '#contact', icon: <svg viewBox="0 0 24 24" {...I}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg> },
]

export default function Dock() {
  const [active, setActive] = useState('')
  const [hidden, setHidden] = useState(false)

  // Highlight the section currently in the middle of the screen.
  useEffect(() => {
    const ids = ['work', 'pricing', 'contact']
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: '-45% 0px -45% 0px' })
    els.forEach((el) => io.observe(el))
    const clear = () => { if (window.scrollY < 300) setActive('') }
    window.addEventListener('scroll', clear, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', clear) }
  }, [])

  // Hide while the on-screen keyboard is likely open.
  useEffect(() => {
    const isField = (t) => /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)
    const inn = (e) => isField(e.target) && setHidden(true)
    const out = () => setHidden(false)
    window.addEventListener('focusin', inn)
    window.addEventListener('focusout', out)
    return () => { window.removeEventListener('focusin', inn); window.removeEventListener('focusout', out) }
  }, [])

  const buzz = () => { try { navigator.vibrate?.(8) } catch { /* not supported */ } }
  const act = (id) => {
    buzz()
    if (id === 'ai') window.dispatchEvent(new Event('open-assistant'))
  }

  return (
    <nav className={`dock ${hidden ? 'dock--hide' : ''}`} aria-label="Quick actions">
      {ITEMS.map((it) => {
        if (it.id === 'ig' && !studio.instagram) return null
        const cls = `dock__item ${it.center ? 'dock__item--ai' : ''} ${active === it.id ? 'on' : ''}`
        const inner = it.center
          ? <><span className="dock__ai"><i /><i /></span><span>{it.label}</span></>
          : <>{it.icon}<span>{it.label}</span></>
        if (it.id === 'ig') {
          return (
            <a key={it.id} className={cls} href={`https://www.instagram.com/${studio.instagram}/`} target="_blank" rel="noopener noreferrer"
              onClick={() => { buzz(); window.dispatchEvent(new Event('ig-copy')) }}>{inner}</a>
          )
        }
        return it.href
          ? <a key={it.id} className={cls} href={it.href} onClick={buzz}>{inner}</a>
          : <button key={it.id} className={cls} onClick={() => act(it.id)}>{inner}</button>
      })}
    </nav>
  )
}
