import { useEffect, useRef, useState } from 'react'
import { projects, team } from '../data.js'
import { useSnap } from '../lib/useSnap.js'
import SnapDots from './SnapDots.jsx'
import CaseSheet from './CaseSheet.jsx'

const byId = Object.fromEntries(team.map((t) => [t.id, t]))
const SLIDE_MS = 4200

function useInView(ref, threshold = 0.15) {
  const [seen, setSeen] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting)
      if (e.isIntersecting) setSeen(true)
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold])
  return [seen, visible]
}

function Frame({ project, color, active, onPick, playing, setPlaying }) {
  const frame = useRef(null)
  const { screens } = project
  const multi = screens.length > 1
  const [loaded, setLoaded] = useState(false)

  // Pointer tilt, skipped on touch screens and for reduced motion.
  function onMove(e) {
    if (e.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = frame.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    frame.current.style.setProperty('--ry', `${x * 7}deg`)
    frame.current.style.setProperty('--rx', `${-y * 6}deg`)
    frame.current.style.setProperty('--sx', `${50 + x * 100}%`)
  }
  function onLeave() {
    frame.current.style.setProperty('--ry', '0deg')
    frame.current.style.setProperty('--rx', '0deg')
  }

  return (
    <div className="stage" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="frame" ref={frame} style={{ '--shadow': color }}>
        <div className="frame__bar" aria-hidden="true">
          <i /><i /><i />
          <span>{project.title}</span>
        </div>
        <div className={`frame__screen ${loaded ? 'loaded' : ''}`} style={{ aspectRatio: '3 / 2' }}>
          {screens.map((sc, i) => (
            <img
              key={sc.src}
              className={`shot ${i === active ? 'on' : ''} ${i < active ? 'past' : ''}`}
              src={sc.src}
              width={sc.w}
              height={sc.h}
              alt={`${project.title}: ${sc.label}`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
          ))}
          <span className="frame__shine" aria-hidden="true" />
        </div>
      </div>
      {multi && (
        <div className="tabs" role="tablist" aria-label={`${project.title} screens`}>
          {screens.map((sc, i) => (
            <button key={sc.label} role="tab" aria-selected={i === active} className={i === active ? 'on' : ''} onClick={() => onPick(i)}>
              <span className="tabs__label">{sc.label}</span>
              <span className="tabs__bar">
                {i === active && playing && <b key={`${active}-${playing}`} style={{ animationDuration: `${SLIDE_MS}ms` }} />}
                {i < active && <b className="full" />}
              </span>
            </button>
          ))}
          <button className="tabs__play" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>
            {playing ? '❚❚' : '▶'}
          </button>
        </div>
      )}
    </div>
  )
}

function Project({ project, index, onCase }) {
  const ref = useRef(null)
  const [seen, visible] = useInView(ref)
  const [active, setActive] = useState(0)
  // Autoplay keeps running while the card is on screen. Hovering or clicking does NOT stop it.
  // The pause button stops it. If the visitor's device asks for reduced motion, it starts paused
  // and they can press play.
  const [playing, setPlaying] = useState(
    () => !(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
  )
  const count = project.screens.length

  useEffect(() => {
    if (count < 2 || !playing || !visible) return
    const t = setTimeout(() => setActive((a) => (a + 1) % count), SLIDE_MS)
    return () => clearTimeout(t)
  }, [active, count, playing, visible])

  const cols = project.by.map((id) => byId[id].accent)
  const color = cols[0]
  const names = project.by.map((id) => byId[id].first).join(' and ')

  return (
    <article
      ref={ref}
      className={`proj ${index % 2 ? 'proj--flip' : ''} ${seen ? 'in' : ''} ${visible ? '' : 'is-off'}`}
    >
      <div className="proj__text">
        <p className="proj__kind">{String(index + 1).padStart(2, '0')} / {project.kind}</p>
        <h3>{project.title}</h3>
        <p className="proj__sum">{project.summary}</p>
        <ul className="tags">
          {project.stack.map((s) => <li key={s}>{s}</li>)}
        </ul>
        <p className="proj__by">
          <span aria-hidden="true">{project.by.map((id) => <i key={id} style={{ background: byId[id].accent }} />)}</span>
          Built by {names}
        </p>
        <div className="proj__actions">
          {(project.overview || project.goal || project.contribution || project.includes?.length) && (
            <button className="proj__case" onClick={() => onCase(project)}>Case study <span aria-hidden="true">→</span></button>
          )}
          {project.href && (
            <a className="proj__link" href={project.href} target="_blank" rel="noopener noreferrer">View live site ↗</a>
          )}
        </div>
      </div>
      <div className="proj__media">
        <Frame project={project} color={color} active={active} onPick={setActive} playing={playing} setPlaying={setPlaying} />
        <span className="float float--a">{project.stack[0]}</span>
        <span className="float float--b">{names}</span>
      </div>
    </article>
  )
}

export default function Work() {
  const { ref, index, go } = useSnap(projects.length)
  const [open, setOpen] = useState(null)
  return (
    <section className="section section--light" id="work">
      <div className="section__head rv">
        <h2>Selected work</h2>
        <p className="legend">
          {team.map((t) => (
            <span key={t.id}><i style={{ background: t.accent }} /> {t.first}</span>
          ))}
        </p>
      </div>
      <div className="projects snap snap--depth" ref={ref}>
        {projects.map((p, i) => <Project key={p.title} project={p} index={i} onCase={setOpen} />)}
      </div>
      <SnapDots count={projects.length} index={index} go={go} label="project" />
      {projects.length > 1 && index === 0 && <p className="swipe" aria-hidden="true">Swipe for more <span>→</span></p>}
      {open && <CaseSheet project={open} onClose={() => setOpen(null)} />}
    </section>
  )
}
