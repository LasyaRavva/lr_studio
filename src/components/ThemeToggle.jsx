import { useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch { /* storage blocked */ }
  }

  return (
    <button className="icon-btn tt" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title={dark ? 'Light mode' : 'Dark mode'}>
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <mask id="tt-mask">
          <rect width="24" height="24" fill="#fff" />
          <circle className="tt__cut" cx="24" cy="0" r="8" fill="#000" />
        </mask>
        <circle className="tt__core" cx="12" cy="12" r="5" fill="currentColor" mask="url(#tt-mask)" />
        <g className="tt__rays" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="2.2" x2="12" y2="4.2" transform={`rotate(${a} 12 12)`} />
          ))}
        </g>
      </svg>
    </button>
  )
}
