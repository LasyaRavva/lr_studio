import { useEffect, useRef, useState } from 'react'
import { packages, customApp, studio, assistantChips } from '../data.js'

const GREETING = 'Hi! I can answer questions about our services, prices and how a project works. What would you like to know?'

// Used only when the AI endpoint is not reachable (not deployed yet, offline, or no API key).
function offlineReply(q) {
  if (/price|cost|charge|package|rate|how much/i.test(q)) {
    return packages.map((p) => `${p.name}: ${p.price}`).join('. ') + `. ${customApp.name}: ${customApp.price}. The final quote comes after a short call.`
  }
  if (/long|time|week|days|deadline/i.test(q)) {
    return packages.map((p) => `${p.name}: ${p.time}`).join('. ') + `. ${customApp.name}: ${customApp.time}.`
  }
  return `The live assistant is offline right now. Please email ${studio.email} and one of us will reply within a working day.`
}

export default function Assistant() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: GREETING }])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const openIt = () => setOpen(true)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('open-assistant', openIt)
    window.addEventListener('keydown', esc)
    return () => { window.removeEventListener('open-assistant', openIt); window.removeEventListener('keydown', esc) }
  }, [])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }) }, [msgs, busy, open])

  async function ask(text) {
    const q = text.trim()
    if (!q || busy) return
    const next = [...msgs, { role: 'user', content: q }]
    setMsgs(next)
    setInput('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      if (!res.ok || !data.reply) throw new Error(data.error || 'failed')
      setMsgs([...next, { role: 'assistant', content: data.reply }])
    } catch {
      setMsgs([...next, { role: 'assistant', content: offlineReply(q) }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {!open && (
        <button className="ai__launch" onClick={() => setOpen(true)} aria-label="Ask our assistant">
          <span className="ai__logo"><i /><i /></span>
          <span>Ask our assistant</span>
        </button>
      )}
      {open && (
        <section className="ai" role="dialog" aria-label="Website assistant">
          <header className="ai__head">
            <span className="ai__logo"><i /><i /></span>
            <div>
              <strong>Studio assistant</strong>
              <small>AI. Replies may be imperfect.</small>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
          </header>
          <div className="ai__log" aria-live="polite">
            {msgs.map((m, i) => <p key={i} className={`ai__msg ai__msg--${m.role}`}>{m.content}</p>)}
            {busy && <p className="ai__msg ai__msg--assistant ai__typing" aria-label="Typing"><span /><span /><span /></p>}
            {msgs.length === 1 && (
              <div className="ai__chips">
                {assistantChips.map((c) => <button key={c} onClick={() => ask(c)}>{c}</button>)}
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form className="ai__form" onSubmit={(e) => { e.preventDefault(); ask(input) }}>
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question" maxLength={500} aria-label="Your question" />
            <button type="submit" disabled={busy || !input.trim()}>Send</button>
          </form>
        </section>
      )}
    </>
  )
}
