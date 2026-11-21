import { studio, team } from '../data.js'
import { legalPages, legalKeys } from '../lib/legal.js'
import { deletionLink } from './LegalPage.jsx'
import CopyButton from './CopyButton.jsx'
import { onLinkClick } from '../lib/route.js'

function shortDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div>
          <p className="footer__brand">{team[0].first} & {team[1].first}</p>
          <p>{studio.legalName}</p>
          {studio.address && <p>{studio.address}</p>}
          {studio.gstin && <p>GSTIN: {studio.gstin}</p>}
          <p className="footer__row">
            <a href={`mailto:${studio.email}`}>{studio.email}</a>
            <CopyButton text={studio.email} label="Copy" />
          </p>
          {studio.instagram && <p><a href={`https://www.instagram.com/${studio.instagram}/`} target="_blank" rel="noopener noreferrer">Instagram @{studio.instagram}</a></p>}
        </div>
        <nav aria-label="Policies">
          <p className="footer__head">Policies</p>
          {legalKeys.map((k) => <a key={k} href={`/${k}`} onClick={(e) => onLinkClick(e, `/${k}`)}>{legalPages[k].title}</a>)}
          <button onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}>Cookie settings</button>
          <a href={deletionLink()}>Request data deletion</a>
        </nav>
      </div>
      <p className="footer__small">
        © {new Date().getFullYear()} {team[0].name} and {team[1].name}. Last updated {shortDate(studio.lastUpdated)}.
        Fonts: Syne and Figtree, used under the SIL Open Font License.
      </p>
    </footer>
  )
}
