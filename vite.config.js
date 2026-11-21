import { existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { studio, team } from './src/data.js'

// In `npm run dev`, serve /api/chat and /api/enquiry from the api/ folder so they work locally.
function devApi(env) {
  return {
    name: 'dev-api',
    configureServer(server) {
      Object.assign(process.env, env)
      const log = server.config.logger
      const usingEmailJs = Boolean(studio.emailjs?.serviceId && studio.emailjs?.templateId && studio.emailjs?.publicKey)
      const status = ['GMAIL_USER', 'GMAIL_APP_PASSWORD', 'MAIL_TO'].map((k) => `${k} ${process.env[k] ? 'found' : 'MISSING'}`)
      if (usingEmailJs) {
        log.info('\n  Contact form: sending through EmailJS (the Gmail settings in .env are not needed).\n')
      } else if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        log.warn(`\n  Email settings: ${status.join(', ')}`)
        if (!existsSync('.env') && existsSync('.env.txt')) log.warn('  Found ".env.txt". Rename it to exactly ".env" (no .txt), then restart this server.')
        else if (!existsSync('.env')) log.warn('  No ".env" file next to package.json. Copy .env.example to .env, fill in the values, then restart this server.')
        else log.warn('  ".env" was found but those values are empty. Fill them in, save, then restart this server.')
        log.warn('')
      } else {
        log.info(`\n  Email settings: ${status.join(', ')}\n`)
      }
      server.middlewares.use('/api', async (req, res, next) => {
        const name = (req.url || '').split('?')[0].replace(/^\/+/, '')
        if (!['chat', 'enquiry'].includes(name)) return next()
        let raw = ''
        for await (const chunk of req) raw += chunk
        try { req.body = raw ? JSON.parse(raw) : {} } catch { req.body = {} }
        const { default: handler } = await server.ssrLoadModule(`/api/${name}.js`)
        handler(req, res)
      })
    },
  }
}

// When VITE_SITE_URL is set (for example https://yourname.com), add the canonical link,
// full share-image URLs, structured data, sitemap.xml and the robots.txt sitemap line.
function siteMeta(env) {
  const site = (env.VITE_SITE_URL || '').trim().replace(/\/+$/, '')
  const pages = ['', 'privacy', 'terms', 'refunds', 'cookies']
  return {
    name: 'site-meta',
    transformIndexHtml(html) {
      return html.replace(/<!--site-start-->([\s\S]*?)<!--site-end-->/, (_, inner) => {
        if (!site) return ''
        const ld = {
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: `${team[0].first} & ${team[1].first}`,
          alternateName: ['Duo Portfolio', `${team[0].first} and ${team[1].first}`],
          description: 'Freelance web developers building responsive websites and React web apps for local businesses and startups.',
          url: `${site}/`,
          email: studio.email,
          areaServed: 'Worldwide',
          founder: team.map((t) => ({ '@type': 'Person', name: t.name })),
          ...(studio.instagram ? { sameAs: [`https://www.instagram.com/${studio.instagram}/`] } : {}),
        }
        return inner.replaceAll('__SITE__', site) + `\n    <script type="application/ld+json">${JSON.stringify(ld)}</script>`
      })
    },
    // Makes /privacy, /terms, /refunds and /cookies open directly on ANY static host
    // (Embarko, Netlify, GitHub Pages...) by giving each its own copy of index.html.
    writeBundle(options) {
      const dir = options.dir || 'dist'
      for (const p of pages.filter(Boolean)) {
        mkdirSync(join(dir, p), { recursive: true })
        copyFileSync(join(dir, 'index.html'), join(dir, p, 'index.html'))
      }
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${site ? `Sitemap: ${site}/sitemap.xml\n` : ''}` })
      if (!site) return
      const urls = pages.map((p) => `  <url><loc>${site}/${p}</loc><lastmod>${studio.lastUpdated}</lastmod></url>`).join('\n')
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n` })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [react(), devApi(env), siteMeta(env)] }
})
