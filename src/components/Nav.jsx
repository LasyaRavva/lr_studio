import { useEffect, useState } from 'react'
import { team } from '../data.js'
import ThemeToggle from './ThemeToggle.jsx'
import { onLinkClick } from '../lib/route.js'

const LINKS = [['Work', '#work'], ['Team', '#team'], ['Services', '#services'], ['Pricing', '#pricing'], ['Process', '#process'], ['FAQ', '#faq']]

export default function Nav({ page }) {
  const base = page ? '/' : ''
  const click = (e, href) => { setOpen(false); if (page) onLinkClick(e, `/${href}`) }
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={`nav ${open ? 'nav--open' : ''}`}>
      {open && <button className="nav__scrim" aria-label="Close menu" tabIndex={-1} onClick={() => setOpen(false)} />}
      <a className="nav__brand" href={page ? '/' : '#top'} aria-label="Home" onClick={(e) => { setOpen(false); if (page) onLinkClick(e, '/') }}>
        <span className="dot" style={{ background: team[0].accent }} />
        <span className="dot" style={{ background: team[1].accent }} />
        <span>{team[0].first} & {team[1].first}</span>
      </a>
      <nav id="primary-nav" aria-label="Primary">
        {LINKS.map(([label, href], n) => (
          <a key={href} href={base + href} style={{ '--i': n }} onClick={(e) => click(e, href)}>{label}</a>
        ))}
        <a className="nav__cta" href={base + '#contact'} style={{ '--i': LINKS.length }} onClick={(e) => click(e, '#contact')}>Start a project</a>
      </nav>
      <div className="nav__tools">
        <button className="icon-btn" onClick={() => window.dispatchEvent(new Event('open-search'))} aria-label="Search this site (press /)" title="Search (/)">
          <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        </button>
        <ThemeToggle />
        <button className="nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  )
}
