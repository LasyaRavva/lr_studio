import { team } from '../data.js'
import { useSnap } from '../lib/useSnap.js'
import SnapDots from './SnapDots.jsx'

export default function Team() {
  const { ref, index, go } = useSnap(team.length)
  return (
    <section className="section section--light section--tight" id="team">
      <div className="section__head rv"><h2>The two of us</h2></div>
      <div className="team snap snap--depth rv" ref={ref}>
        {team.map((m) => (
          <article key={m.id} className="member" style={{ '--c': m.accent }}>
            <div className="member__avatar">
              {m.photo
                ? <img src={m.photo} alt={m.name} />
                : <span aria-hidden="true">{m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>}
            </div>
            <h3>{m.name}</h3>
            <p className="member__role">{m.role}</p>
            <p className="member__bio">{m.bio}</p>
            <ul className="tags">
              {(m.focus ?? []).map((f) => <li key={f}>{f}</li>)}
            </ul>
            {/* <p className="member__links">
              {m.links.map((l) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
              ))}
            </p> */}
          </article>
        ))}
      </div>
      <SnapDots count={team.length} index={index} go={go} label="team member" />
    </section>
  )
}
