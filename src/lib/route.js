import { legalKeys } from './legal.js'

// Policy pages live at real paths (/privacy, /terms, /refunds, /cookies).
// Old links like /#privacy still work and are rewritten to the real path.
export function pageFromLocation() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '')
  if (legalKeys.includes(path)) return path
  const hash = window.location.hash.replace('#', '')
  return legalKeys.includes(hash) ? hash : null
}

export function navigate(to) {
  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event('navigate'))
}

// Use on <a href="/privacy" onClick={(e) => onLinkClick(e, '/privacy')}> so the page does not reload.
export function onLinkClick(e, to) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  e.preventDefault()
  navigate(to)
}
