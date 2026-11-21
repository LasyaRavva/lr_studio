import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { studio, packages, customApp } from '../data.js'
import { getAttribution } from '../lib/utm.js'
import Modal from './Modal.jsx'
import CopyButton from './CopyButton.jsx'

const EMPTY = { name: '', email: '', pkg: 'Not sure yet', budget: 'Not sure yet', message: '', agree: false, company: '' }

function validate(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please tell us your name.'
  if (!/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.message.trim().length < 10) e.message = 'Please write a few words about your project (at least 10 characters).'
  if (!v.agree) e.agree = 'Please tick this box so we can contact you.'
  return e
}

export default function Contact() {
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | review | sending | ok | mail | error
  const formRef = useRef(null)
  const lastSent = useRef(0)
  const [errMsg, setErrMsg] = useState('')

  useEffect(() => {
    const on = (e) => setV((x) => ({ ...x, pkg: e.detail }))
    window.addEventListener('pick-package', on)
    return () => window.removeEventListener('pick-package', on)
  }, [])

  const set = (k) => (e) => {
    setV((x) => ({ ...x, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  function onSubmit(e) {
    e.preventDefault()
    if (v.company) return // honeypot: only bots fill this in
    const errs = validate(v)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) { formRef.current?.querySelector(`[name="${first}"]`)?.focus(); return }
    setStatus('review')
  }

  async function send() {
    const attribution = getAttribution()
    const ej = studio.emailjs
    if (ej?.serviceId && ej?.templateId && ej?.publicKey) {
      // Basic spam brake: one enquiry per 30 seconds from the same page.
      if (Date.now() - lastSent.current < 30_000) {
        setErrMsg('Please wait a few seconds before sending another enquiry.')
        setStatus('error')
        return
      }
      setStatus('sending')
      try {
        const name = v.name.trim()
        const email = v.email.trim()
        await emailjs.send(
          ej.serviceId,
          ej.templateId,
          {
            subject: `New enquiry from ${name} (${v.pkg})`,
            from_name: name,
            from_email: email,
            reply_to: email,
            package: v.pkg,
            budget: v.budget,
            message: v.message.trim(),
            consent: 'Agreed to the Privacy Policy and confirmed 18+',
            source: Object.entries(attribution).map(([k, x]) => `${k}: ${x}`).join(', ') || 'not shared',
            sent_at: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }),
          },
          { publicKey: ej.publicKey },
        )
        lastSent.current = Date.now()
        setErrMsg('')
        setStatus('ok')
      } catch (err) {
        console.error('EmailJS failed:', err?.status, err?.text || err) // shows the exact reason in the browser console
        setErrMsg('')
        setStatus('error')
      }
      return
    }
    if (!studio.formEndpoint) {
      const subject = encodeURIComponent(`Project enquiry from ${v.name}`)
      const body = encodeURIComponent(`${v.message}\n\nPackage: ${v.pkg}\nBudget: ${v.budget}\nReply to: ${v.email}`)
      window.location.href = `mailto:${studio.email}?subject=${subject}&body=${body}`
      setStatus('mail')
      return
    }
    setStatus('sending')
    try {
      const payload = {
        name: v.name.trim(),
        email: v.email.trim(),
        package: v.pkg,
        budget: v.budget,
        message: v.message.trim(),
        consent: true, // the visitor ticked the box (18+ and Privacy Policy)
        company: v.company, // hidden spam trap, should be empty
        ...attribution,
      }
      const res = await fetch(studio.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('bad response')
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => { setV(EMPTY); setErrors({}); setStatus('idle') }
  const done = status === 'ok' || status === 'mail'

  return (
    <section className="section contact" id="contact">
      <div className="section__head rv"><h2>Tell us what you need</h2></div>
      <div className="contact__grid rv">
        <div className="contact__copy">
          <p>Describe the project in a few lines. We aim to reply within one working day.</p>
          <ol className="next">
            <li><b>1</b><span>We read your message and may ask a question or two.</span></li>
            <li><b>2</b><span>A short call to confirm what you need and your budget.</span></li>
            <li><b>3</b><span>You get a fixed written quote. No obligation to go ahead.</span></li>
          </ol>
          <ul className="contact__list">
            <li><span>Email</span><div className="contact__row"><a href={`mailto:${studio.email}`}>{studio.email}</a><CopyButton text={studio.email} label="Copy" /></div></li>
            {studio.instagram && <li><span>Instagram</span><a href={`https://www.instagram.com/${studio.instagram}/`} target="_blank" rel="noopener noreferrer">@{studio.instagram}</a></li>}
            <li><span>Based in</span>{studio.location}</li>
          </ul>
        </div>

        {done ? (
          <div className="done" role="status">
            <svg viewBox="0 0 52 52" width="64" height="64" aria-hidden="true"><circle cx="26" cy="26" r="24" fill="none" stroke="var(--aqua)" strokeWidth="3" /><path d="M15 27l8 8 14-16" fill="none" stroke="var(--aqua)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <h3>{status === 'ok' ? `Thanks, ${v.name.split(' ')[0]}!` : 'Almost there'}</h3>
            <p>
              {status === 'ok'
                ? `We got your enquiry and will reply to ${v.email} within one working day.`
                : `Your email app should have opened with the message ready. If it did not, email us at ${studio.email}.`}
            </p>
            <button className="btn" onClick={reset}>Send another enquiry</button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={onSubmit} noValidate>
            <label className="hp" aria-hidden="true">Company<input name="company" value={v.company} onChange={set('company')} tabIndex={-1} autoComplete="off" /></label>
            <div className="row2">
              <label>Your name
                <input name="name" value={v.name} onChange={set('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
                {errors.name && <small id="e-name" className="err">{errors.name}</small>}
              </label>
              <label>Email
                <input name="email" type="email" value={v.email} onChange={set('email')} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />
                {errors.email && <small id="e-email" className="err">{errors.email}</small>}
              </label>
            </div>
            <div className="row2">
              <label>Package
                <select name="pkg" value={v.pkg} onChange={set('pkg')}>
                  <option>Not sure yet</option>
                  {packages.map((p) => <option key={p.id}>{p.name}</option>)}
                  <option>{customApp.name}</option>
                </select>
              </label>
              <label>Budget (optional)
                <select name="budget" value={v.budget} onChange={set('budget')}>
                  <option>Not sure yet</option>
                  <option>Under ₹25,000</option>
                  <option>₹25,000 – ₹75,000</option>
                  <option>₹75,000+</option>
                </select>
              </label>
            </div>
            <label>What are you building?
              <textarea name="message" rows="4" value={v.message} onChange={set('message')} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-message' : undefined} />
              {errors.message && <small id="e-message" className="err">{errors.message}</small>}
            </label>
            <label className="check">
              <input name="agree" type="checkbox" checked={v.agree} onChange={set('agree')} aria-invalid={!!errors.agree} aria-describedby={errors.agree ? 'e-agree' : undefined} />
              <span>I am 18 or older and agree to the <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a>. You may use these details only to reply to my enquiry.</span>
            </label>
            {errors.agree && <small id="e-agree" className="err">{errors.agree}</small>}
            {status === 'error' && (
              <p className="banner banner--err" role="alert">
                {errMsg || 'Sorry, that did not send.'} Your message is still here, so you can try again, or email us at <a href={`mailto:${studio.email}`}>{studio.email}</a>.
              </p>
            )}
            <button className="btn btn--solid btn--load" type="submit" disabled={status === 'sending'}>
              {status === 'sending' && <i className="spin" aria-hidden="true" />}
              {status === 'sending' ? 'Sending…' : 'Review and send'}
            </button>
          </form>
        )}
      </div>

      {(status === 'review' || status === 'sending') && (
        <Modal label="Confirm your enquiry" onClose={() => status === 'review' && setStatus('idle')} className="confirm">
          <h3>Ready to send?</h3>
          <dl>
            <dt>Name</dt><dd>{v.name}</dd>
            <dt>Email</dt><dd>{v.email}</dd>
            <dt>Package</dt><dd>{v.pkg}</dd>
            <dt>Budget</dt><dd>{v.budget}</dd>
            <dt>Message</dt><dd>{v.message}</dd>
          </dl>
          <div className="confirm__actions">
            <button className="btn" onClick={() => setStatus('idle')} disabled={status === 'sending'}>Edit</button>
            <button className="btn btn--solid btn--load" data-autofocus onClick={send} disabled={status === 'sending'}>
              {status === 'sending' && <i className="spin" aria-hidden="true" />}
              {status === 'sending' ? 'Sending…' : 'Send enquiry'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  )
}
