# Launch checklist: Lasya & Koushik portfolio

Status as of 21 Nov 2026. "Verified" means I tested it on the real files in a simulated browser. I could not open Chrome, Safari or a phone, so the live-site test in section 3 is yours.

## 1. Already done in the code (verified)

| Your item | Status |
|---|---|
| Mobile friendly | Done. Swipe carousels, bottom dock, vertical timeline, thumb-size buttons. Test on a real phone (section 3). |
| Check every link | Done. Every in-page link has a target, no dead "#" links. External links: Homely Hub, Arogya Adarsh, Instagram, email. Open each once yourself. |
| Contact form works | Code and fallbacks verified. A real email test needs your EmailJS keys (section 2). |
| Form validation, spam protection | Done. Field messages, hidden spam trap, 30-second brake, consent box (18+ and Privacy Policy), review-before-send window. |
| Fast loading | Done. Script 67 KB compressed, styles 11 KB, fonts bundled (no Google request), images load lazily. |
| Compress images | Done. 12 images went from 708 KB to 448 KB (37% smaller, looks identical). Unzip `project-images-compressed.zip` into `public/`. |
| HTTPS padlock | Your host gives this. The site loads nothing over plain http. Check the padlock after upload. |
| Secrets off the front end | Verified. No passwords or API keys in the built site. The EmailJS public key is meant to be public, so restrict it to your domain in EmailJS. |
| Privacy, Terms, Refund, Cookie pages | Done at /privacy, /terms, /refunds, /cookies. Drafts: have them reviewed. |
| Cookie banner and consent | Done. Equal-weight buttons, nothing optional runs until accepted, reopen from the footer. |
| What data do you collect? | Listed in the Privacy Policy: name, email, package, budget, message, consent; optional campaign tags only after consent. |
| Third-party embeds / SDKs | None. No iframes, maps, trackers or external scripts. |
| Meta title and description | Done ("Duo Portfolio | Lasya & Koushik..."). |
| Social preview image, favicon | Done (og-image.png, favicon.svg, apple-touch-icon.png). The full image address is created when you build with your site address. |
| Sitemap and robots.txt | Done, with one condition. See section 5. |
| Alt text | Done. All 12 images have it. |
| Colour contrast | Checked. All main text and button colours pass the accessibility minimum. |
| Keyboard friendly | Done. Skip link, visible focus, labelled fields, dialogs trap Tab and close with Escape, search opens with "/". |
| Custom 404 page | Done. |
| One clear call to action | "Start a project" in the menu and hero. |
| No fake reviews | None on the site. The testimonials section stays hidden until you add real quotes. |
| Fonts | Syne and Figtree under the SIL Open Font License, credited in the footer. |
| Typos | Spell-checked all text on all five pages. No mistakes found. |

## 2. Only you can do these, in this order

1. **EmailJS.** Fill the three values in `src/data.js`, send a real test enquiry with a different email address, and check it arrives and that Reply goes to that address.
2. **Images.** Unzip `project-images-compressed.zip` into `public/` and replace the old ones.
3. **Confirm your own words.** Case studies for Homely Hub and Arogya are drafts. Also check the FAQ, the policy numbers (12 months, 14 days, 7 days, 50/30/20), the prices, "We reply within one working day", "Weekly previews", and the "Taking on new projects" banner. Remove anything that is not true.
4. **Photos you may not own.** The hotel, food and spa pictures inside your project mockups: confirm you have the right to use them, or swap in real screenshots. The Serenova About image shows "1K+ clients, 8+ years, 100% satisfaction": remove that slide if it is not real.
5. **Build with the site address, then check.** In PowerShell:
   ```
   $env:VITE_SITE_URL="https://duo-portfolio.embarko.app"
   npm run build
   npm run preflight
   ```
   Fix anything marked [FAIL]. Upload the contents of `dist`.
6. **Run the live test** (section 3).
7. **Google Search Console** (section 5).
8. **Instagram.** I could not check that `@thelr_studio` exists. Open the link yourself, and put the portfolio address in the Instagram bio.
9. **Domain (optional).** Buy it, then tell me the name and I will register it on Embarko and give you the DNS record.

## 3. Live-site test (Chrome, Safari, a real phone)

- Home loads, no layout jumping, the hero name "Koushik" is fully visible on a small phone.
- Menu opens and closes. Bottom bar (phones): Work, Pricing, Ask AI, Instagram, Contact.
- Swipe Work, Team and Pricing. Slideshow images change by themselves. Case study opens, swipes down closed.
- Fill the form wrongly (see messages), then correctly (see the confirm window and the thank-you screen). Check the email.
- Tap Instagram: your profile opens and the message is copied.
- Open /privacy, /terms, /refunds, /cookies directly, and a made-up address (should show the 404 page).
- Dark mode toggle. Cookie banner buttons. Search ("/" or the magnifier).
- Safari (iPhone and Mac): form fields do not zoom on tap, the sun/moon icon may change without animating on older Safari (that is fine).
- Padlock shows. Page opens at `http://` and jumps to `https://`.
- PageSpeed Insights (pagespeed.web.dev) on the live address. Aim for green on mobile.

## 4. Skipped (not needed here)

- Password show/hide: there are no passwords.
- Unsubscribe link: you send no marketing email.
- Age check beyond the checkbox: you do not collect age.
- Analytics: you said you have none. It stays off. Search Console (below) is free and shows how people find you.
- Loading splash screen: it slows the site and hurts search ranking.
- "Green style sheet": unclear what you meant. The site already uses bundled fonts, compressed images and respects reduced motion.
- Server-run AI assistant on a static host: on Embarko it falls back to price and timing answers.

## 5. Search, honestly

Nobody can promise "first on Google". What you control is the 3 basics:

1. **Sitemap.** Yes, it is built in. It is created only when you build with `VITE_SITE_URL` set. Without it there is no sitemap and no canonical link. The build now prints a warning and `npm run preflight` fails. After upload, open `/sitemap.xml` to confirm.
2. **On-page.** Title, description, one h1, headings in order, alt text, canonical link, business details for Google, mobile friendly, fast. All done.
3. **Search Console.** Not done until you do it:
   - Go to search.google.com/search-console, add your address, and verify. On an `embarko.app` address use the "HTML tag" method (add the meta tag Google gives you inside `<head>` in `index.html`, rebuild, upload). With your own domain use the DNS method.
   - Open Sitemaps, enter `sitemap.xml`, press Submit.
   - Open URL inspection, paste your home address, press Request indexing.
   - Google decides how often it visits. Expect days to weeks, not hours.

Searching your own names ("Lasya Koushik portfolio") will work before the generic "duo portfolio" does. A domain with your names and links from your Instagram, LinkedIn and GitHub help most.

## 6. Legal

Privacy, Terms, Refund and Cookie pages are written for how this site works and follow India's Digital Personal Data Protection Act (consent, deletion, contact). They are drafts, not legal advice. Add your GST number only if you are registered.
