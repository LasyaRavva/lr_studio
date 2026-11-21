import Modal from './Modal.jsx'
import { team } from '../data.js'

// Case study as a bottom sheet on phones (drag down or tap x to close) and a centred card on desktop.
export default function CaseSheet({ project, onClose }) {
  const names = project.by.map((id) => team.find((t) => t.id === id)?.first).filter(Boolean).join(' and ')
  const first = project.screens?.[0]
  let startY = null

  const down = (e) => { startY = e.clientY; e.currentTarget.setPointerCapture?.(e.pointerId) }
  const move = (e) => {
    if (startY === null) return
    const el = e.currentTarget.closest('.sheet')
    el.style.transition = 'none'
    el.style.transform = `translateY(${Math.max(0, e.clientY - startY)}px)`
  }
  const up = (e) => {
    if (startY === null) return
    const el = e.currentTarget.closest('.sheet')
    const dy = e.clientY - startY
    startY = null
    el.style.transition = ''
    if (dy > 90) onClose()
    else el.style.transform = ''
  }

  const toContact = () => {
    onClose()
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 200)
  }

  return (
    <Modal label={`${project.title} case study`} onClose={onClose} className="sheet" backClass="sheet-back">
      <div className="sheet__grab" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-hidden="true"><span /></div>
      <header className="sheet__head">
        <div>
          <p className="sheet__kind">Case study · {project.kind}</p>
          <h3>{project.title}</h3>
        </div>
        <button className="sheet__close" onClick={onClose} aria-label="Close case study" data-autofocus>×</button>
      </header>
      <div className="sheet__body">
        {first && <img className="sheet__img" src={first.src} width={first.w} height={first.h} alt={`${project.title}: ${first.label}`} />}
        {project.overview && <><h4>Overview</h4><p>{project.overview}</p></>}
        {project.goal && <><h4>Goal</h4><p>{project.goal}</p></>}
        {project.contribution && <><h4>Contribution</h4><p>{project.contribution}</p></>}
        {project.includes?.length > 0 && (
          <>
            <h4>What it includes</h4>
            <ul className="sheet__list">{project.includes.map((i) => <li key={i}>{i}</li>)}</ul>
          </>
        )}
        <h4>Built with</h4>
        <ul className="tags">{project.stack.map((s) => <li key={s}>{s}</li>)}</ul>
        <p className="sheet__by">Built by {names}</p>
        <div className="sheet__cta">
          {project.href && <a className="btn" href={project.href} target="_blank" rel="noopener noreferrer">View live site ↗</a>}
          <button className="btn btn--solid" onClick={toContact}>Discuss a similar project</button>
        </div>
      </div>
    </Modal>
  )
}
