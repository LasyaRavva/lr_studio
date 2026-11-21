import { packages, customApp, addons, pricingNote } from '../data.js'
import { useSnap } from '../lib/useSnap.js'
import SnapDots from './SnapDots.jsx'

function pick(name) {
  window.dispatchEvent(new CustomEvent('pick-package', { detail: name }))
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Pricing() {
  const { ref, index, go } = useSnap(packages.length)
  return (
    <section className="section pricing" id="pricing">
      <div className="section__head rv">
        <h2>Packages and pricing</h2>
        <p className="pricing__lead">Pick the closest fit. We confirm a fixed quote after a short call.</p>
      </div>
      <div className="plans snap snap--depth rv" ref={ref}>
        {packages.map((p) => (
          <article key={p.id} className="plan" style={{ '--a': p.accent }}>
            <h3>{p.name}</h3>
            <p className="plan__price">{p.price}</p>
            <p className="plan__time">{p.time}</p>
            <p className="plan__fit">{p.fit}</p>
            <ul>
              {p.includes.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <button className="plan__btn" onClick={() => pick(p.name)}>Ask about this</button>
          </article>
        ))}
      </div>
      <SnapDots count={packages.length} index={index} go={go} label="package" />

      <article className="custom rv">
        <div>
          <h3>{customApp.name}</h3>
          <p>{customApp.text}</p>
        </div>
        <div className="custom__side">
          <p className="plan__price">{customApp.price}</p>
          <p className="plan__time">{customApp.time}</p>
          <button className="btn btn--solid" onClick={() => pick(customApp.name)}>Discuss your idea</button>
        </div>
      </article>

      <div className="addons snap rv">
        {addons.map((a) => (
          <div key={a.name} className="addon">
            <h3>{a.name}</h3>
            <p className="addon__price">{a.price}</p>
            <p>{a.text}</p>
            {a.action === 'assistant' && (
              <button className="addon__try" onClick={() => window.dispatchEvent(new Event('open-assistant'))}>Try it now</button>
            )}
          </div>
        ))}
      </div>
      <p className="pricing__note">{pricingNote}</p>
    </section>
  )
}
