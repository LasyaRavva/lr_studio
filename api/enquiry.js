// POST /api/enquiry
// Emails a new enquiry from the contact form to your inbox using Gmail.
// Needs three environment variables (see .env.example):
//   GMAIL_USER          the Gmail address that sends the mail
//   GMAIL_APP_PASSWORD  a 16-character Google "App password" (NOT your normal password)
//   MAIL_TO             who receives enquiries, comma separated (defaults to GMAIL_USER)
import nodemailer from 'nodemailer'
import { studio, team } from '../src/data.js'

const hits = new Map()
function tooMany(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5 // 5 enquiries per 10 minutes per visitor
}

function send(res, code, body) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

const oneLine = (v, max) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max)
const block = (v, max) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max)
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' })

  const { GMAIL_USER, GMAIL_APP_PASSWORD, MAIL_TO, SEND_CONFIRMATION } = process.env
  const missing = ['GMAIL_USER', 'GMAIL_APP_PASSWORD'].filter((k) => !process.env[k])
  if (missing.length) {
    console.error(`enquiry: missing environment variable(s): ${missing.join(', ')}`)
    // The names are shown only while developing locally, never on the live site.
    return send(res, 503, { error: 'not_configured', ...(process.env.NODE_ENV !== 'production' ? { missing } : {}) })
  }

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (tooMany(ip)) return send(res, 429, { error: 'slow_down' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  body = body || {}

  if (body.company) return send(res, 200, { ok: true }) // hidden field: only bots fill it, so pretend it worked

  const name = oneLine(body.name, 100)
  const email = oneLine(body.email, 200)
  const pkg = oneLine(body.package, 60) || 'Not sure yet'
  const budget = oneLine(body.budget, 60) || 'Not sure yet'
  const message = block(body.message, 3000)
  if (!name || !EMAIL.test(email) || message.length < 10 || body.consent !== true) {
    return send(res, 400, { error: 'invalid' })
  }

  // Campaign tags are only sent by the site when the visitor accepted analytics.
  const extras = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'referrer']
    .filter((k) => body[k]).map((k) => [k, oneLine(body[k], 100)])

  const rows = [['Name', name], ['Email', email], ['Package', pkg], ['Budget', budget], ...extras]
  const text = `New enquiry from your portfolio\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n\nMessage:\n${message}\n\nConsent: agreed to the Privacy Policy and confirmed 18+.\n`
  const html = `<div style="font:15px/1.6 system-ui,sans-serif;color:#14123a">
    <h2 style="margin:0 0 12px">New enquiry from your portfolio</h2>
    <table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#555;padding-right:16px"><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>
    <h3 style="margin:18px 0 6px">Message</h3>
    <p style="white-space:pre-wrap;margin:0">${esc(message)}</p>
    <p style="color:#777;font-size:13px;margin-top:18px">Consent: agreed to the Privacy Policy and confirmed 18+. Press Reply to write to ${esc(name)} at ${esc(email)}. Use Reply all to include your partner.</p>
  </div>`

  // Gmail (like every mail service) only lets us send from the account we log in with, so the
  // visitor's own address can never be the real "From": faking it is spoofing and lands in spam.
  // So the enquiry is built to behave as if it came from the visitor:
  //  - the sender name and the subject show who wrote,
  //  - Reply-To is ONLY the visitor, so pressing Reply writes to them,
  //  - both of you receive it, so "Reply all" also includes your partner.
  // (Set REPLY_TO_TEAM=true if you would rather have every reply copy both of you.)
  const team_emails = [...new Set((MAIL_TO || GMAIL_USER).split(',').map((e) => e.trim()).filter(Boolean))]
  const safeName = name.replace(/["<>,;:\\]/g, '').trim().slice(0, 60) || 'Visitor'
  const replyTo = [`"${safeName}" <${email}>`, ...(process.env.REPLY_TO_TEAM === 'true' ? team_emails : [])]

  try {
    const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD } })
    await transporter.sendMail({
      from: `"${safeName} via portfolio" <${GMAIL_USER}>`,
      to: team_emails,
      replyTo,
      subject: `New enquiry from ${oneLine(name, 60)} <${email}> (${pkg})`,
      text,
      html,
    })

    // Optional: a short receipt to the visitor. Off by default. Turn on with SEND_CONFIRMATION=true.
    if (SEND_CONFIRMATION === 'true') {
      try {
        await transporter.sendMail({
          from: `"${team[0].first} & ${team[1].first}" <${GMAIL_USER}>`,
          to: email,
          replyTo: team_emails, // the visitor's reply goes to both of you
          subject: 'We got your enquiry',
          text: `Hi ${name.split(' ')[0]},\n\nThanks for getting in touch. We received your message and will reply within one working day.\n\n${team[0].first} & ${team[1].first}\n${studio.email}\n`,
        })
      } catch (err) {
        console.error('confirmation email failed', err)
      }
    }
    return send(res, 200, { ok: true })
  } catch (err) {
    console.error('enquiry email failed', err)
    return send(res, 502, { error: 'mail_failed' })
  }
}
