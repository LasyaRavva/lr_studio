import { legalPages, legalKeys } from '../lib/legal.js'
import { studio } from '../data.js'
import { onLinkClick } from '../lib/route.js'

function longDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function deletionLink() {
  const subject = encodeURIComponent('Data deletion request')
  const body = encodeURIComponent('Hello,\n\nPlease delete the personal data you hold about me.\n\nThe email address I used to contact you: \nAnything else that helps you find it (name, date of enquiry): \n\nThank you.')
  return `mailto:${studio.email}?subject=${subject}&body=${body}`
}

export default function LegalPage({ page }) {
  const doc = legalPages[page]
  if (!doc) return null
  return (
    <article className="legal">
      <a className="legal__back" href="/" onClick={(e) => onLinkClick(e, '/')}>← Back to the portfolio</a>
      <h1>{doc.title}</h1>
      <p className="legal__date">Last updated {longDate(studio.lastUpdated)}</p>
      <p className="legal__intro">{doc.intro}</p>
      {doc.sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          {s.list
            ? <ul>{s.p.map((t) => <li key={t}>{t}</li>)}</ul>
            : s.p.map((t) => <p key={t}>{t}</p>)}
          {s.deletion && <a className="btn btn--solid" href={deletionLink()}>Request data deletion</a>}
          {s.settings && <button className="btn btn--solid" onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}>Open cookie settings</button>}
        </section>
      ))}
      <nav className="legal__more" aria-label="Other policies">
        {legalKeys.filter((k) => k !== page).map((k) => <a key={k} href={`/${k}`} onClick={(e) => onLinkClick(e, `/${k}`)}>{legalPages[k].title}</a>)}
      </nav>
    </article>
  )
}
