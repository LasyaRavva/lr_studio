import { useEffect, useMemo, useRef, useState } from 'react'
import Modal from './Modal.jsx'
import { packages, services, projects, faq, addons, customApp } from '../data.js'
import { legalPages } from '../lib/legal.js'
import { navigate } from '../lib/route.js'

function buildIndex() {
  const items = [
    { title: 'Selected work', text: 'projects portfolio case studies', target: '#work', tag: 'Section' },
    { title: 'Why clients work with us', text: 'two developers updates front end database', target: '#why', tag: 'Section' },
    { title: 'The two of us', text: 'team about Lasya Koushik', target: '#team', tag: 'Section' },
    { title: 'What we build', text: 'services websites web apps redesigns', target: '#services', tag: 'Section' },
    { title: 'Packages and pricing', text: 'price cost rates rupees', target: '#pricing', tag: 'Section' },
    { title: 'How a project runs', text: 'process steps talk design build launch', target: '#process', tag: 'Section' },
    { title: 'Contact us', text: 'enquiry form email instagram start a project', target: '#contact', tag: 'Section' },
  ]
  packages.forEach((p) => items.push({ title: p.name, text: `${p.price} ${p.time} ${p.fit} ${p.includes.join(' ')}`, target: '#pricing', tag: 'Package' }))
  items.push({ title: customApp.name, text: `${customApp.price} ${customApp.text}`, target: '#pricing', tag: 'Package' })
  addons.forEach((a) => items.push({ title: a.name, text: `${a.price} ${a.text}`, target: '#pricing', tag: 'Add-on' }))
  services.forEach((s) => items.push({ title: s.title, text: `${s.text} ${s.points.join(' ')}`, target: '#services', tag: 'Service' }))
  projects.forEach((p) => items.push({ title: p.title, text: `${p.kind} ${p.summary} ${p.stack.join(' ')}`, target: '#work', tag: 'Project' }))
  faq.forEach((f) => items.push({ title: f.q, text: f.a, target: '#faq', faq: f.id, tag: 'FAQ' }))
  Object.entries(legalPages).forEach(([key, pg]) => items.push({ title: pg.title, text: pg.intro, page: key, tag: 'Policy' }))
  return items
}

export default function Search() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const index = useMemo(buildIndex, [])
  const list = useRef(null)

  useEffect(() => {
    const show = () => { setQ(''); setI(0); setOpen(true) }
    const key = (e) => {
      const typing = /input|textarea|select/i.test(e.target.tagName)
      if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); show() }
    }
    window.addEventListener('open-search', show)
    window.addEventListener('keydown', key)
    return () => { window.removeEventListener('open-search', show); window.removeEventListener('keydown', key) }
  }, [])

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
    if (!terms.length) return index.filter((x) => x.tag === 'Section').slice(0, 7)
    return index
      .map((x) => {
        const t = x.title.toLowerCase(), all = `${t} ${x.text.toLowerCase()}`
        if (!terms.every((w) => all.includes(w))) return null
        return { x, score: terms.reduce((s, w) => s + (t.includes(w) ? 3 : 1), 0) }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((r) => r.x)
  }, [q, index])

  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [i, results])

  function go(item) {
    setOpen(false)
    setTimeout(() => {
      if (item.page) { navigate(`/${item.page}`); return }
      const openFaq = () => item.faq && window.dispatchEvent(new CustomEvent('open-faq', { detail: item.faq }))
      if (window.location.pathname !== '/') {
        navigate(`/${item.target}`)
        setTimeout(openFaq, 700)
        return
      }
      document.querySelector(item.target)?.scrollIntoView({ behavior: 'smooth' })
      history.replaceState(null, '', item.target)
      setTimeout(openFaq, 400)
    }, 50)
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(n + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(n - 1, 0)) }
    if (e.key === 'Enter' && results[i]) { e.preventDefault(); go(results[i]) }
  }

  if (!open) return null
  return (
    <Modal label="Search this site" onClose={() => setOpen(false)} className="search">
      <div className="search__box">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        <input
          data-autofocus
          value={q}
          onChange={(e) => { setQ(e.target.value); setI(0) }}
          onKeyDown={onKeyDown}
          placeholder="Search pricing, services, FAQ, policies"
          aria-label="Search"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-list"
          aria-activedescendant={results[i] ? `sr-${i}` : undefined}
        />
        <kbd>Esc</kbd>
      </div>
      <ul id="search-list" role="listbox" ref={list} className="search__list">
        {results.map((r, n) => (
          <li key={`${r.tag}-${r.title}`} id={`sr-${n}`} role="option" aria-selected={n === i} className={n === i ? 'on' : ''} onMouseEnter={() => setI(n)} onClick={() => go(r)}>
            <span className="search__tag">{r.tag}</span>
            <span className="search__title">{r.title}</span>
          </li>
        ))}
        {!results.length && <li className="search__none">No matches. Try “price”, “refund” or “AI”.</li>}
      </ul>
    </Modal>
  )
}
