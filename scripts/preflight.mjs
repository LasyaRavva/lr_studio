// Run before you deploy:  npm run preflight
// Prints what is ready and what still needs your attention. No network, nothing is changed.
import { existsSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = process.cwd()
const { studio, team, projects, packages, faq } = await import(pathToFileURL(resolve(root, 'src/data.js')).href)

const out = { fail: [], warn: [], ok: [] }
const fail = (m) => out.fail.push(m)
const warn = (m) => out.warn.push(m)
const ok = (m) => out.ok.push(m)
const has = (p) => existsSync(resolve(root, p))

// ---- people ----
team.forEach((t) => {
  if (/your teammate|partner/i.test(t.name) || /TODO/.test(t.bio)) fail(`${t.first}: name or bio is still a placeholder (src/data.js)`)
  else ok(`${t.first}: name and bio filled in`)
  if (!t.photo) warn(`${t.first}: no photo yet, initials are shown (set "photo" in src/data.js and add the file to public/)`)
  else if (!has('public' + t.photo)) fail(`${t.first}: photo file ${t.photo} is missing from public/`)
  if (!t.links?.length) ok(`${t.first}: no profile links shown (by choice)`)
  else if (t.links.some((l) => !l.href || l.href === '#')) fail(`${t.first}: a profile link is empty or "#"`)
})

// ---- business details ----
if (!studio.email) fail('studio.email is empty')
else ok(`Contact email: ${studio.email}`)
const ej = studio.emailjs
if (ej?.serviceId && ej?.templateId && ej?.publicKey) {
  ok('Contact form sends through EmailJS (remember: in the EmailJS dashboard, restrict the public key to your website domain)')
} else if (ej && (ej.serviceId || ej.templateId || ej.publicKey)) {
  fail('studio.emailjs is only partly filled in: you need serviceId, templateId AND publicKey')
} else if (!studio.formEndpoint) fail('studio.formEndpoint is empty: the form only opens the visitor\'s email app. Set it to \'/api/enquiry\' (needs the Gmail settings) or paste a Formspree URL.')
else if (studio.formEndpoint.startsWith('/')) {
  ok(`Contact form posts to ${studio.formEndpoint} (your own server)`)
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) warn('GMAIL_USER / GMAIL_APP_PASSWORD not found in this environment. Add them on Vercel (and in .env to test locally), otherwise enquiries will fail to send.')
  if (!process.env.MAIL_TO) warn('MAIL_TO is not set, so enquiries go only to GMAIL_USER. Add both of your emails, separated by a comma.')
} else ok('Contact form delivers through an external form service')
if (!studio.address) warn('studio.address is empty (shown in the footer; helps the Privacy Policy and Terms)')
if (!studio.courtCity) warn('studio.courtCity is empty (used in the Terms governing-law line)')
if (studio.gstin) ok('GSTIN shown in the footer')
else warn('No GSTIN set. Fine if you are not GST-registered. Prices say "before GST if it applies".')
if (studio.availability) warn(`Availability banner is on ("${studio.availability}"). Keep it only if it is true.`)
if (!studio.analytics?.src) ok('Analytics not used (optional). You will not see visit counts.')
else ok('Analytics configured (loads only after a visitor accepts)')

// ---- projects ----
projects.forEach((p) => {
  const missing = p.screens.filter((s) => !has('public' + s.src))
  if (missing.length) fail(`${p.title}: missing image file(s) ${missing.map((m) => m.src).join(', ')}`)
  else ok(`${p.title}: ${p.screens.length} screens found`)
  if (!p.href) warn(`${p.title}: no live link`)
  if (!p.stack?.length) fail(`${p.title}: tech stack is empty`)
})
if (projects.length < 3) warn(`Only ${projects.length} projects. Clients trust 3 or more. Add one or two, even small ones, with what you built.`)

// ---- content ----
if (!has('src/data.js') || /TODO/.test(readFileSync(resolve(root, 'src/data.js'), 'utf8'))) {
  const lines = readFileSync(resolve(root, 'src/data.js'), 'utf8').split('\n').map((l, i) => [i + 1, l]).filter(([, l]) => /TODO/.test(l) && !/Search for TODO/.test(l))
  lines.forEach(([n, l]) => warn(`src/data.js line ${n}: ${l.trim().slice(0, 90)}`))
}
if (!has('src/data.js')) fail('src/data.js missing')
const prices = packages.map((p) => p.price).join(' ')
ok(`${packages.length} packages and ${faq.length} FAQ answers present. Read the prices and FAQ once more: ${prices.slice(0, 60)}...`)
warn('Read the Privacy, Terms and Refund pages once. They are drafts: confirm the 12-month retention, 14-day bug fixes, 7-day refunds and the 50/30/20 payment terms are what you will honour.')
warn('Testimonials: none yet. Add real client quotes to "testimonials" in src/data.js when you have them.')

// ---- files ----
for (const f of ['public/favicon.svg', 'public/og-image.png', 'public/apple-touch-icon.png', 'public/404.html', 'vercel.json'])
  has(f) ? ok(`${f} present`) : fail(`${f} is missing`)
if (!process.env.VITE_SITE_URL) warn('VITE_SITE_URL is not set. Set it on Vercel to your final address (https://yourname.com) so the share image, canonical link, sitemap and search data are generated.')
else ok(`Site URL: ${process.env.VITE_SITE_URL}`)
if (!process.env.LLM_API_KEY && !process.env.ANTHROPIC_API_KEY) warn('No AI key in this environment. That is fine locally, but add LLM_API_KEY (or ANTHROPIC_API_KEY) on Vercel, set a spending limit with the provider, then test the assistant on the live site.')
else ok('AI key found in this environment')

// ---- the built site (dist) ----
if (has('dist/index.html')) {
  const built = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
  if (has('dist/sitemap.xml')) ok('dist has sitemap.xml')
  else fail('dist/sitemap.xml is missing: rebuild with VITE_SITE_URL set (PowerShell: $env:VITE_SITE_URL="https://your-address"; npm run build)')
  if (built.includes('rel="canonical"')) ok('dist has a canonical link and social-preview URL')
  else fail('dist has no canonical link: rebuild with VITE_SITE_URL set')
  if (has('dist/robots.txt') && has('dist/404.html') && has('dist/privacy/index.html')) ok('dist has robots.txt, 404 page and policy pages')
  else fail('dist is missing robots.txt, 404.html or the policy pages: rebuild')
} else {
  warn('No dist folder yet. Run the build (with VITE_SITE_URL set), then run this check again before uploading.')
}

// ---- report ----
const show = (tag, list) => list.forEach((m) => console.log(`${tag} ${m}`))
console.log('\nLaunch check\n')
show('[FAIL]', out.fail); show('[WARN]', out.warn); show('[ OK ]', out.ok)
console.log(`\n${out.fail.length} must-fix, ${out.warn.length} to review, ${out.ok.length} ready.\n`)
process.exit(out.fail.length ? 1 : 0)
