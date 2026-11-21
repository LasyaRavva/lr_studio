// Serverless chat endpoint (works on Vercel as /api/chat, and in `npm run dev`).
// The API key lives in the ANTHROPIC_API_KEY environment variable and never reaches the browser.
import { team, projects, packages, customApp, addons, studio, pricingNote } from '../src/data.js'

const hits = new Map()

function tooMany(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 12
}

function send(res, code, body) {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function systemPrompt() {
  const people = team.map((t) => `${t.name}: ${t.role}. ${t.bio}`).join('\n')
  const work = projects.map((p) => `${p.title} (${p.kind}): ${p.summary}`).join('\n')
  const prices = packages
    .map((p) => `${p.name}: ${p.price}, about ${p.time}. Good for: ${p.fit} Includes: ${p.includes.join('; ')}.`)
    .concat(`${customApp.name}: ${customApp.price}, about ${customApp.time}. ${customApp.text}`)
    .join('\n')
  const extras = addons.map((a) => `${a.name}: ${a.price}. ${a.text}`).join('\n')
  return `You are the website assistant for ${team.map((t) => t.first).join(' and ')}, two freelance web developers in India who build websites and React web apps for local businesses and startups.

About the team:
${people}

Selected work:
${work}

Packages (starting ranges in Indian rupees):
${prices}

Add-ons:
${extras}

${pricingNote}

Contact: email ${studio.email}${studio.instagram ? `, Instagram @${studio.instagram}` : ''}. The contact form on this page also reaches both developers.

Rules:
- Answer only from the information above. If you do not know something, say so and suggest emailing the team. Never invent clients, past projects, discounts or promises.
- Prices are starting ranges. Say the final quote comes after a short call, and what affects price: number of pages, features such as booking or sign-in, and how much copy and design work is needed.
- Keep replies short, friendly and plain, usually 2 to 4 sentences. Use the same language the visitor writes in.
- Plain text only. No markdown, no bullet symbols, no asterisks.
- If the visitor seems ready to start, ask for their name, what they want to build, and a phone or email, then tell them to send it through the contact form or email so the developers can follow up.
- If the question has nothing to do with the team's services, politely say you can only help with questions about their web development work.`
}

// ── Which AI provider to use (set in environment variables, never in code) ──
// LLM_PROVIDER = anthropic | groq | openrouter | gemini | custom
//   anthropic  needs ANTHROPIC_API_KEY
//   others     need LLM_API_KEY  (custom also needs LLM_BASE_URL and LLM_MODEL)
// Optional: LLM_MODEL to override the default model of any provider.
const PRESETS = {
  anthropic: { model: 'claude-haiku-5-5' },
  groq: { base: 'https://api.groq.com/openai/v1', model: 'openai/gpt-oss-20b' },
  openrouter: { base: 'https://openrouter.ai/api/v1', model: 'google/gemma-4-31b-it:free' },
  gemini: { base: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-flash-lite' },
  custom: {},
}

function resolveProvider() {
  const env = process.env
  const name = env.LLM_PROVIDER || (env.ANTHROPIC_API_KEY ? 'anthropic' : env.LLM_API_KEY ? 'groq' : '')
  const preset = PRESETS[name]
  if (!preset) return null
  const key = name === 'anthropic' ? env.ANTHROPIC_API_KEY : env.LLM_API_KEY
  const model = env.LLM_MODEL || (name === 'anthropic' ? env.ANTHROPIC_MODEL : '') || preset.model
  const base = env.LLM_BASE_URL || preset.base
  if (!key || !model || (name !== 'anthropic' && !base)) return null
  return { name, key, model, base }
}

async function callModel(p, system, messages, signal) {
  if (p.name === 'anthropic') {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal,
      headers: { 'content-type': 'application/json', 'x-api-key': p.key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: p.model, max_tokens: 400, system, messages }),
    })
    if (!r.ok) throw new Error(`anthropic ${r.status} ${await r.text()}`)
    const data = await r.json()
    return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim()
  }
  // Any OpenAI-compatible provider (Groq, OpenRouter, Gemini, ...)
  const r = await fetch(`${p.base.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    signal,
    headers: { 'content-type': 'application/json', authorization: `Bearer ${p.key}` },
    body: JSON.stringify({
      model: p.model,
      max_tokens: 800, // reasoning models spend part of this thinking
      temperature: 0.3,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  })
  if (!r.ok) throw new Error(`${p.name} ${r.status} ${await r.text()}`)
  const data = await r.json()
  return String(data.choices?.[0]?.message?.content || '').trim()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' })
  const provider = resolveProvider()
  if (!provider) return send(res, 503, { error: 'not_configured' })

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
  if (tooMany(ip)) return send(res, 429, { error: 'slow_down' })

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  let messages = Array.isArray(body?.messages) ? body.messages : []
  messages = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }))
    .slice(-10)
  while (messages.length && messages[0].role !== 'user') messages.shift()
  if (!messages.length || messages[messages.length - 1].role !== 'user') return send(res, 400, { error: 'bad_request' })

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 25_000)
  try {
    const reply = await callModel(provider, systemPrompt(), messages, controller.signal)
    return send(res, 200, { reply: reply || 'Sorry, I could not come up with an answer. Please email us.' })
  } catch (err) {
    console.error('chat handler failed', err)
    return send(res, 502, { error: 'upstream' })
  } finally {
    clearTimeout(timer)
  }
}
