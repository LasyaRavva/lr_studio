# Duo freelance portfolio (React + Vite)

    npm install
    npm run dev       # local preview
    npm run build     # production build in dist/ (deploy to Vercel or Netlify)

- All content lives in `src/data.js`. Search for `TODO` and replace each one.
- Real photo behind the hero: drop `hero.jpg` into `public/` (it shows faintly behind the illustration).
- Team photos: put files in `public/` and set `photo: '/lasya.jpg'` in `src/data.js`.
- Colours and fonts are CSS variables at the top of `src/styles.css`.

## Before you publish

1. `src/data.js` → `formEndpoint`: create a free form at formspree.io and paste its URL, so enquiries land in your inbox.
2. `src/data.js` → `instagram` and `instagramMessage`: the corner button copies the message and opens your Instagram DM (Instagram does not allow pre-filled DMs).
3. Real screenshots: save them in `public/` and set `image: '/homely-hub.png'` on each project. Add live links in `href`.
4. Add real client quotes to `testimonials` and a testimonials block appears on its own.
5. Replace `public/og-image.png` if you want a different link-preview image.

## AI assistant (chat widget + /api/chat)

The widget talks to `api/chat.js`, a small serverless function. The key stays on the server and you choose the provider with environment variables.

| Use case | Set these |
|---|---|
| Free demo on your own portfolio | `LLM_PROVIDER=groq` and `LLM_API_KEY` (key from console.groq.com/keys) |
| Paid, for client sites | `LLM_PROVIDER=anthropic` and `ANTHROPIC_API_KEY` (key from console.anthropic.com, set a spending limit) |
| Others | `openrouter` or `gemini` with `LLM_API_KEY`, or `custom` with `LLM_BASE_URL` and `LLM_MODEL` |

1. Local test: copy `.env.example` to `.env`, fill it in, run `npm run dev`.
2. On Vercel: Project Settings → Environment Variables → add the same names, then redeploy.
3. The assistant answers from `src/data.js` (packages, team, projects), so edit prices there and it stays in sync.
4. Without a key, the widget still answers price and timeline questions and otherwise points visitors to your email.
5. Free tiers have rate caps and some log or train on prompts. Use a paid plan for paying clients.

`npm run preview` does not serve `/api`; use `npm run dev` or Vercel to test the live assistant.

## Pricing

Edit `packages`, `customApp`, `addons` and `pricingNote` in `src/data.js`. The "Ask about this" buttons preselect the package in the contact form.

## Policies, privacy and compliance (read this before launch)

The Privacy, Terms, Refund and Cookie pages are drafts written from how this site really works. They are not legal advice, so have them checked, and make sure they match what you actually do.

Fill these in `src/data.js` (`studio`):
- `address`, `gstin` (only if registered), `courtCity`: shown in the footer and Terms.
- `retentionMonths`, `warrantyDays`, `refundDays`: numbers quoted in the policies. Change them to what you will honour.
- `formEndpoint`: Formspree URL so enquiries are delivered. Mention Formspree in the Privacy Policy (already done).
- `analytics`: leave empty unless you add a tool. It loads only after a visitor accepts.
- `availability`: only keep "Taking on new projects" if it is true. Set to '' to hide it.
- Before deploy, set the share image in `index.html` to a full URL: `https://yourdomain/og-image.png`.

What is stored in the browser: `theme` and `consent-v1` only. UTM tags are kept in memory and sent with an enquiry only if the visitor accepted analytics.
Fonts (Syne, Figtree) are bundled with the site under the SIL Open Font License, so no request goes to Google.
Images: the project screenshots are yours. Make sure the photos inside them are ones you have the right to use.

Handy shortcuts: press `/` or Ctrl/Cmd+K to search the site.

## Mobile experience

- Under 860px, Selected work and Pricing become swipe carousels (hidden scrollbar, snap, dots, depth effect).
- Under 760px, a glass bottom dock replaces the two floating buttons: Work, Pricing, Ask AI, Instagram, Contact. It hides while a form field is focused, and gives a tiny vibration on Android.
- The hero scene is cropped tighter on phones so the two developers are bigger.
- Test on a real phone as well as Chrome's device mode: touch, swipe and the on-screen keyboard behave differently.

## Launch checklist

Run `npm run preflight` any time. It lists what must be fixed ([FAIL]), what to review ([WARN]) and what is ready ([ OK ]).

Deploy on Vercel:
1. Push the project to GitHub and import it on vercel.com (Framework: Vite).
2. Environment variables (Project Settings → Environment Variables):
   - `VITE_SITE_URL` = your final address, e.g. `https://yourname.com` (no trailing slash). This switches on the canonical link, full share-image URL, structured data and sitemap.
   - `LLM_PROVIDER` and `LLM_API_KEY` (or `ANTHROPIC_API_KEY`) for the assistant. Set a monthly spending limit with the provider.
3. Deploy, then open the live site and test: the contact form (check the email arrives), the assistant, a policy page directly (`/privacy`), and a made-up address like `/nothing` (should show the 404 page).
4. Submit `https://yourname.com/sitemap.xml` in Google Search Console.
5. Test on a real phone: swipe the carousels, use the bottom dock, open the keyboard in the form.

Policy pages use real addresses (`/privacy`, `/terms`, `/refunds`, `/cookies`). `vercel.json` makes them work when opened directly. Old `#privacy` links are converted automatically.
