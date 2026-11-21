import { useState } from 'react'

export default function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const t = document.createElement('textarea')
      t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'
      document.body.appendChild(t); t.select()
      try { document.execCommand('copy') } catch { /* nothing else to try */ }
      t.remove()
    }
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }
  return (
    <button type="button" className={`copy ${done ? 'copy--done' : ''}`} onClick={copy} aria-label={`${label} ${text}`}>
      <span aria-live="polite">{done ? 'Copied ✓' : label}</span>
    </button>
  )
}
