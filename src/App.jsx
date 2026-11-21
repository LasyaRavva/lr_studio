import { useEffect, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Work from './components/Work.jsx'
import Why from './components/Why.jsx'
import Team from './components/Team.jsx'
import Services from './components/Services.jsx'
import Pricing from './components/Pricing.jsx'
import Process from './components/Process.jsx'
import Faq from './components/Faq.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import LegalPage from './components/LegalPage.jsx'
import Instagram from './components/Instagram.jsx'
import Assistant from './components/Assistant.jsx'
import Search from './components/Search.jsx'
import Dock from './components/Dock.jsx'
import CookieBanner from './components/CookieBanner.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import BackToTop from './components/BackToTop.jsx'
import { pageFromLocation } from './lib/route.js'
import { legalKeys, legalPages } from './lib/legal.js'
import { getConsent } from './lib/consent.js'
import { captureUtm } from './lib/utm.js'
import { studio } from './data.js'

captureUtm()

function loadAnalytics() {
  const { src, domain } = studio.analytics
  if (!src || !getConsent()?.analytics || document.querySelector('script[data-analytics]')) return
  const s = document.createElement('script')
  s.defer = true
  s.src = src
  if (domain) s.dataset.domain = domain
  s.dataset.analytics = 'on'
  document.head.appendChild(s)
}

export default function App() {
  const [page, setPage] = useState(pageFromLocation)

  useEffect(() => {
    const sync = () => {
      const h = window.location.hash.replace('#', '')
      if (legalKeys.includes(h)) window.history.replaceState(null, '', `/${h}`) // old #privacy style links
      setPage(pageFromLocation())
    }
    sync()
    window.addEventListener('popstate', sync)
    window.addEventListener('navigate', sync)
    window.addEventListener('hashchange', sync)
    loadAnalytics()
    window.addEventListener('consent-change', loadAnalytics)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('navigate', sync)
      window.removeEventListener('hashchange', sync)
      window.removeEventListener('consent-change', loadAnalytics)
    }
  }, [])

  // Legal pages open at the top; going back to a section scrolls to it once it is on screen.
  useEffect(() => {
    if (page) { window.scrollTo(0, 0); document.title = `${legalPages[page].title} | Lasya & Koushik`; return }
    document.title = 'Duo Portfolio | Lasya & Koushik: Freelance Web Developers (React & Full-Stack)'
    const id = window.location.hash
    if (id && id.length > 1) requestAnimationFrame(() => document.querySelector(id)?.scrollIntoView())
    else window.scrollTo(0, 0)
  }, [page])

  // Fade sections in as they scroll into view.
  useEffect(() => {
    const els = [...document.querySelectorAll('.rv:not(.in)')]
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [page])

  return (
    <>
      <a className="skip" href="#main" onClick={() => document.getElementById('main')?.focus()}>Skip to content</a>
      <ScrollProgress />
      <Nav page={page} />
      <main id="main" tabIndex={-1}>
        {page ? <LegalPage page={page} /> : (
          <>
            <Hero />
            <Marquee />
            <Work />
            <Why />
            <Team />
            <Services />
            <Pricing />
            <Process />
            <Faq />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <BackToTop />
      {!page && <Dock />}
      <Instagram />
      <Assistant />
      <Search />
      <CookieBanner />
    </>
  )
}
