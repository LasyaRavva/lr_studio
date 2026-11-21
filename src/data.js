// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE. Everything on the site reads from here.
// Search for TODO to find the few things only you can fill in.
// ─────────────────────────────────────────────────────────────

export const studio = {
  email: 'thelrstudio.freelancer@gmail.com',
  instagram: 'thelr_studio',
  // Instagram cannot pre-fill a DM, so the button copies this text and opens the chat.
  instagramMessage: 'Hi! I saw your portfolio and I have a project in mind.',
  // TODO: create a free form at formspree.io and paste its URL here
  // (looks like 'https://formspree.io/f/abcdwxyz'). Until then the form
  // falls back to opening the visitor's email app.
  emailjs: { serviceId: 'service_wlfhtwf', templateId: 'template_5jhquch', publicKey: 'w0KFku65JPh8SohBp' },
  formEndpoint: '/api/enquiry',
  location: 'Andhra Pradesh & Telangana, India · working with clients worldwide',
  // Shown in the hero and chat. Set to '' to hide it. Only keep it if it is true.
  availability: 'Taking on new projects',

  // ── Business details (shown in the footer and legal pages) ──
  legalName: 'Lasya Ravva and Koushik (freelance web developers)',
  address: 'Andhra Pradesh and Telangana, India', // TODO: city, state, country (e.g. 'Hyderabad, Telangana, India')
  gstin: '', // TODO: add only if you are GST-registered
  courtCity: '', // TODO: city whose courts apply in the Terms, e.g. 'Hyderabad'

  // ── Policy numbers used in the legal pages. Change them to what you really offer. ──
  retentionMonths: 12, // how long enquiries are kept if we don't work together
  warrantyDays: 14, // free bug fixes after launch, within the agreed scope
  refundDays: 7, // working days to return a refund

  // ── Optional privacy-friendly analytics (loads ONLY after the visitor accepts) ──
  // Example for Plausible: { src: 'https://plausible.io/js/script.js', domain: 'yourdomain.com' }
  analytics: { src: '', domain: '' },

  lastUpdated: '2026-11-16',
}

export const team = [
  {
    id: 'lasya',
    name: 'Lasya',
    first: 'Lasya',
    photo: '', // optional: put a file in /public and use e.g. '/lasya.jpg'
    role: 'Full-stack developer',
    accent: 'var(--rose)',
    bio: 'I build React front ends and the Node and database layers behind them. I came up through MERN-stack internships, and I like projects where the interface and the data model get designed together.',
    focus: ['React', 'Node.js / Express', 'MongoDB', 'PostgreSQL', 'REST APIs'],
    //links: [{ label: 'Portfolio', href: 'https://lasyaportfolio.netlify.app' }],
  },
  {
    id: 'koushik',
    name: 'Koushik', // TODO: add his full name if you want it shown
    first: 'Koushik',
    photo: '', // optional: e.g. '/koushik.jpg'
    role: 'Full-stack developer',
    accent: 'var(--aqua)',
    bio: 'I am the one you will talk to most. I turn a rough idea into a clear plan, keep you updated in plain language, and I enjoy picking up new technologies and bringing the useful ones into your project.',
    focus: ['Client communication', 'New technologies', 'React', 'Full-stack'],
    //links: [{ label: 'Email', href: 'mailto:thelrstudio.freelancer@gmail.com' }], // TODO: add GitHub / LinkedIn
  },
]

export const projects = [
  {
    title: 'Homely Hub',
    kind: 'Hotel booking platform',
    summary: 'Search destinations and dates, browse stays, see photos, amenities and prices, and check availability. Designed to feel the same on desktop and mobile.',
    // DRAFT case study: read each line and change anything that is not exactly true.
    overview: 'A hotel and homestay booking platform. Guests search by destination, dates and number of guests, compare stays, and check availability.',
    goal: 'Help guests find a place to stay and see the price, photos, amenities and availability in one place, on desktop and on mobile.',
    contribution: 'Built together by Lasya and Koushik as a full-stack web app: the React interface, the Node.js and Express back end, and the MongoDB database.',
    includes: ['Search by destination, dates and guests', 'Stay listings with ratings and price per night', 'Stay page with photos, amenities and availability check', 'Layout that works on phones'],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    by: ['lasya', 'koushik'],
    screens: [
      { src: '/projects/homely-home.webp', label: 'Homepage', w: 741, h: 492 },
      { src: '/projects/homely-browse.webp', label: 'Browse stays', w: 738, h: 494 },
      { src: '/projects/homely-detail.webp', label: 'Stay details', w: 742, h: 495 },
      { src: '/projects/homely-mobile.webp', label: 'On mobile', w: 738, h: 492 },
    ],
    href: 'https://homelyhub-chi.vercel.app/',
  },
  {
    title: 'Arogya Adarsh',
    kind: 'Organic snacks and dry fruits store',
    summary: 'An online shop for organic snacks, dry fruits and wellness products, with categories, product pages and a cart. It is designed to feel just as good on a phone.',
    // DRAFT case study: read each line and change anything that is not exactly true.
    overview: 'An online store for organic snacks, dry fruits and wellness products, with an admin portal for running it.',
    goal: 'Let customers browse organic products by category and order online, and give the owner one place to manage the store.',
    contribution: 'Built the store and its admin portal with React, Node.js, Express and PostgreSQL, including a cart admin page and a search that works across paginated orders.',
    includes: ['Category browsing and product search', 'Product pages with prices and add to cart', 'Admin portal with a cart admin page', 'Order search across paginated results'],
    stack: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    by: ['lasya'],
    screens: [
      { src: '/projects/arogya-home.webp', label: 'Homepage', w: 748, h: 490 },
      { src: '/projects/arogya-shop.webp', label: 'Shop', w: 747, h: 490 },
      { src: '/projects/arogya-product.webp', label: 'Product page', w: 748, h: 499 },
      { src: '/projects/arogya-mobile.webp', label: 'On mobile', w: 747, h: 498 },
    ],
    href: 'https://arogyaadarshorganic.com/',
  },
  {
    title: 'Serenova Salon & Spa',
    kind: 'Salon booking web app',
    summary: 'Online booking for a salon in Banjara Hills, Hyderabad: browse services, pick a slot and book without calling.',
    overview: 'A salon and spa service experience for Serenova in Banjara Hills, Hyderabad. Customers can browse services, choose a time slot and book online, while staff can view upcoming bookings.',
    goal: 'Customers can browse salon services and book a time without calling, while staff need a shared view of upcoming bookings.',
    contribution: 'Built the salon service discovery and booking experience, including service filters, time-slot selection, online booking, and a staff view of upcoming bookings.',
    includes: ['Service browsing and filters', 'Time-slot booking', 'Staff view of upcoming bookings'],
    stack: ['React', 'Supabase'],
    by: ['lasya'], // add 'koushik' here if he worked on it too
    screens: [
      { src: '/projects/serenova-home.webp', label: 'Homepage', w: 732, h: 488 },
      { src: '/projects/serenova-services.webp', label: 'Services', w: 732, h: 488 },
      { src: '/projects/serenova-about.webp', label: 'About', w: 732, h: 488 },
      { src: '/projects/serenova-mobile.webp', label: 'On mobile', w: 732, h: 488 },
    ],
    href: '', // TODO: add the live link if there is one
  },
]


export const reasons = [
  { title: 'Two developers, one team', text: 'Both of us work on every project, so there is always a second pair of eyes on your code.' },
  { title: 'Updates you can follow', text: 'Plain-language progress notes and a preview link while we build, so you always know where things stand.' },
  { title: 'Front end to database', text: 'We build the screens and the server behind them, so nothing gets lost between two vendors.' },
]

// Add real client quotes here and a testimonials section appears automatically.
// Example: { quote: 'They delivered on time.', name: 'Client name', role: 'Owner, Business name' }
export const testimonials = []

export const services = [
  {
    title: 'Websites for local businesses',
    text: 'Built to load quickly, read well on a phone, and make it easy for customers to find you and get in touch.',
    points: ['Services, gallery and contact pages', 'Google Maps and WhatsApp links', 'Mobile-first and fast'],
  },
  {
    title: 'Web apps for startups',
    text: 'Dashboards, sign-in, bookings and the workflow your idea depends on, built to grow past version one.',
    points: ['React front end, Node back end', 'Sign-in and user roles', 'Booking and admin dashboards'],
  },
  {
    title: 'Fixes and redesigns',
    text: 'Slow, broken or dated site? We audit it, fix what matters first, and tell you what we changed.',
    points: ['Speed and mobile fixes', 'Fresh look, same content', 'Clear list of changes'],
  },
]

export const process = [
  { title: 'Talk', text: 'A short call to understand your goal, budget and deadline. You get a fixed quote after.' },
  { title: 'Design', text: 'Wireframes and a visual direction you can react to before any code is written.' },
  { title: 'Build', text: 'Weekly previews on a live link, so you see real progress and can steer it.' },
  { title: 'Launch', text: 'We deploy, test on real devices, and hand over everything you need to run it.' },
]

// ── Pricing ── adjust the numbers to whatever you decide to charge.
export const packages = [
  {
    id: 'starter', name: 'Starter page', price: '₹10,000 – 15,000', time: '5–7 days', accent: '#ffd166',
    fit: 'A simple online presence or personal page.',
    includes: ['One page with 3–5 sections', 'Mobile-ready design', 'Contact form and WhatsApp link', 'Deployed on a live link'],
  },
  {
    id: 'landing', name: 'Landing page', price: '₹15,000 – 25,000', time: '1–2 weeks', accent: '#ff6b95',
    fit: 'One page built to get enquiries for an offer or campaign.',
    includes: ['Custom design for your brand', 'Enquiry form and WhatsApp button', 'Basic SEO and analytics', '2 rounds of revisions'],
  },
  {
    id: 'business', name: 'Business website', price: '₹30,000 – 55,000', time: '2–3 weeks', accent: '#45e0dc',
    fit: 'Local businesses that need several pages and to be found on Google.',
    includes: ['5–8 pages (services, gallery, about, contact)', 'Google Maps and WhatsApp', 'SEO basics and speed tuning', '2 rounds of revisions'],
  },
  {
    id: 'pro', name: 'Business Pro', price: '₹75,000 – 1,50,000', time: '4–6 weeks', accent: '#8f87ff',
    fit: 'Businesses that want bookings or enquiries managed online.',
    includes: ['Everything in Business website', 'Booking or enquiry system', 'Simple admin panel', 'Email notifications'],
  },
]

export const customApp = {
  name: 'Custom web app',
  price: 'from ₹1,50,000',
  time: '2–4 months',
  text: 'Sign-in, database, dashboards and payments built around your workflow. Homely Hub is an example of this kind of project. We quote after a short call.',
}

export const addons = [
  { name: 'AI chat assistant', price: '₹10,000 – 30,000', text: 'A chat helper on your site that answers visitor questions and collects leads.', action: 'assistant' },
  { name: 'Monthly maintenance', price: '₹1,500 – 5,000 / month', text: 'Updates, backups, small fixes and uptime checks.' },
  { name: 'Extra pages', price: '₹2,000 – 4,000 each', text: 'More pages after launch, designed to match.' },
]

export const pricingNote = 'Prices are starting ranges in Indian rupees, before GST if it applies. We give a fixed written quote after a short call, so there are no surprise charges. Domain, hosting and paid third-party tools are billed at cost and agreed with you first. Payment: 50% to start, 30% midway, 20% at launch.'

export const assistantChips = ['What do you charge?', 'How long does a website take?', 'Can you add an AI assistant to my site?']

// ── FAQ ── These answers state your working terms. Edit them so they match what you really do.
export const faq = [
  { id: 'cost', q: 'How much will my website cost?', a: 'Each package on this page shows a starting range. After a short call we send a fixed written quote. The price depends on the number of pages, features such as bookings or sign-in, and how much design and writing help you need.' },
  { id: 'time', q: 'How long does a project take?', a: 'A starter page takes 5 to 7 days, a landing page 1 to 2 weeks, a business website 2 to 3 weeks, and Business Pro 4 to 6 weeks. Custom web apps usually take 2 to 4 months. Delays in feedback or content can add time.' },
  { id: 'pay', q: 'How and when do I pay?', a: 'We ask for 50% to start, 30% midway and 20% at launch. Domain and hosting are bought in your name and billed at cost, and we agree any extra cost with you before it is spent.' },
  { id: 'revisions', q: 'How many changes can I ask for?', a: 'Landing page, Business website and Business Pro include 2 rounds of revisions. If you want more, we tell you the price before we start.' },
  { id: 'own', q: 'Will I own the website?', a: 'Yes. Once the final payment is made, the website we built for you is yours. We may show the finished work in our portfolio unless you ask us not to.' },
  { id: 'ai', q: 'Can you add an AI assistant to my site?', a: 'Yes. It answers visitors’ questions using only the information you give us and can collect enquiries for you. AI can still get things wrong, so we add a clear way to reach a human. You can try ours with the “Ask our assistant” button.' },
  { id: 'abroad', q: 'Do you work with clients outside India?', a: 'Yes. We work online, and our prices are in Indian rupees.' },
  { id: 'data', q: 'What do you do with the details I send?', a: 'We use them only to reply to your enquiry and prepare a quote. Read the Privacy Policy for details, including how to ask us to delete your data.' },
]
