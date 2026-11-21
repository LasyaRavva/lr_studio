import { useEffect, useState } from 'react'
import { getConsent, setConsent } from '../lib/consent.js'
import { onLinkClick } from '../lib/route.js'

export default function CookieBanner() {
  const [open, setOpen] = useState(() => getConsent() === null)

  useEffect(() => {
    const reopen = () => setOpen(true)
    window.addEventListener('open-cookie-settings', reopen)
    return () => window.removeEventListener('open-cookie-settings', reopen)
  }, [])

  if (!open) return null
  const choose = (analytics) => { setConsent(analytics); setOpen(false) }

  return (
    <section className="cookie" role="region" aria-label="Cookie notice">
      <p>
        This site stores only your theme choice and this cookie preference. Analytics stay off unless you accept them.{' '}
        <a href="/cookies" onClick={(e) => onLinkClick(e, '/cookies')}>Cookie Policy</a>
      </p>
      <div className="cookie__actions">
        <button className="btn" onClick={() => choose(false)}>Essential only</button>
        <button className="btn" onClick={() => choose(true)}>Accept analytics</button>
      </div>
    </section>
  )
}
