import { useEffect, useState } from 'react'
import { studio } from '../data.js'

export default function Instagram() {
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 6000)
    return () => clearTimeout(t)
  }, [toast])

  // Instagram cannot pre-fill a message, so we copy the starter text. The button itself is a
  // normal link, which browsers never block (a script-opened window can be blocked).
  async function copyMessage() {
    let copied = false
    try {
      await navigator.clipboard.writeText(studio.instagramMessage)
      copied = true
    } catch { /* clipboard blocked: the link still opens */ }
    setToast(copied
      ? 'Message copied. On our profile tap Message and paste it.'
      : `Opening @${studio.instagram} on Instagram.`)
  }

  useEffect(() => {
    window.addEventListener('ig-copy', copyMessage)
    return () => window.removeEventListener('ig-copy', copyMessage)
  })

  if (!studio.instagram) return null

  return (
    <div className="ig">
      {toast && <p className="ig__toast" role="status">{toast}</p>}
      <a
        className="ig__btn"
        href={`https://www.instagram.com/${studio.instagram}/`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={copyMessage}
        aria-label={`Open @${studio.instagram} on Instagram`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
        </svg>
      </a>
    </div>
  )
}
