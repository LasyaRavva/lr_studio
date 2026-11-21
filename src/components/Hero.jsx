import { useEffect, useRef, useState } from 'react'
import { team, studio } from '../data.js'
import Scene from './Scene.jsx'
import { useVisible } from '../lib/useVisible.js'

const WORDS = ['websites', 'web apps', 'booking systems', 'admin dashboards']

function useTyped(words) {
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let w = 0, i = words[0].length, del = true, t
    const tick = () => {
      const word = words[w]
      i += del ? -1 : 1
      setText(word.slice(0, i))
      let wait = del ? 45 : 85
      if (!del && i === word.length) { del = true; wait = 1600 }
      else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 250 }
      t = setTimeout(tick, wait)
    }
    t = setTimeout(tick, 1800)
    return () => clearTimeout(t)
  }, [words])
  return text
}

export default function Hero() {
  const typed = useTyped(WORDS)
  const ref = useRef(null)
  const on = useVisible(ref)
  return (
    <section className={`hero ${on ? '' : 'is-off'}`} id="top" ref={ref}>
      <div className="hero__photo" aria-hidden="true" />
      <div className="hero__text">
        {studio.availability && <p className="hero__status"><span className="pulse" /> {studio.availability}</p>}
        <p className="hero__kicker">Duo portfolio · freelance web developers</p>
        <h1 className="hero__title">
          <span className="hero__a">{team[0].first}</span>{' '}
          <span className="hero__amp">&amp;</span>{' '}
          <span className="hero__b">{team[1].first}</span>
        </h1>
        <p className="hero__lede">
          We build <span className="typed">{typed}</span><span className="caret" aria-hidden="true" /> for local businesses and startups.
        </p>
        <div className="hero__actions">
          <a className="btn btn--solid btn--shine" href="#contact">Start a project</a>
          <a className="btn" href="#work">See our work</a>
        </div>
      </div>
      <Scene a={team[0].first} b={team[1].first} />
    </section>
  )
}
