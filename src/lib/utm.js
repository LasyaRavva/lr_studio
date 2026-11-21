import { getConsent } from './consent.js'

// UTM tags (?utm_source=...) and the referrer are kept in memory only, and are
// attached to an enquiry only if the visitor accepted analytics.
const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
let captured = {}

export function captureUtm() {
  try {
    const params = new URLSearchParams(window.location.search)
    keys.forEach((k) => { if (params.get(k)) captured[k] = params.get(k).slice(0, 100) })
    if (document.referrer) {
      const ref = new URL(document.referrer)
      if (ref.hostname !== window.location.hostname) captured.referrer = ref.hostname
    }
  } catch { /* ignore */ }
}

export function getAttribution() {
  return getConsent()?.analytics ? captured : {}
}
