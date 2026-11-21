// Remembers the visitor's cookie choice. Nothing optional runs until they accept.
const KEY = 'consent-v1'

export function getConsent() {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}

export function setConsent(analytics) {
  try { localStorage.setItem(KEY, JSON.stringify({ analytics, at: new Date().toISOString() })) } catch { /* storage blocked */ }
  window.dispatchEvent(new Event('consent-change'))
}
