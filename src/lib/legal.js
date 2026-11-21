import { studio } from '../data.js'

// Draft policies written for this site. Have them reviewed against how you really work.
const where = studio.address || 'India'
const contact = `You can reach us at ${studio.email}${studio.instagram ? ` or on Instagram at @${studio.instagram}` : ''}.`

export const legalPages = {
  privacy: {
    title: 'Privacy Policy',
    intro: `This policy explains what personal data this website collects, why, and what you can do about it. The website is run by ${studio.legalName}, based in ${where}.`,
    sections: [
      { h: 'What we collect', p: [
        'Enquiry form: your name, email address, the package you are interested in, your budget range (optional) and the message you write. Nothing else is required.',
        'AI assistant: the messages you type into the chat are sent to an AI provider so it can write a reply. Please do not put personal or confidential details in the chat.',
        'Analytics (only if you accept them in the cookie banner): the page you came from and any campaign tags in the link (utm_source, utm_medium, utm_campaign), and, if you have set it up, basic visit counts from a privacy-friendly analytics tool.',
        'Hosting logs: our hosting provider records technical data such as your IP address and browser when you load the site, to keep it secure and working.',
        'We do not ask for your age, phone number or address, and we do not run advertising trackers.',
      ] },
      { h: 'Why we use it', p: [
        'To reply to your enquiry, prepare a quote and start the project if you decide to go ahead. We rely on your consent, which you give by ticking the box on the form. You can withdraw it at any time.',
      ] },
      { h: 'Who receives it', p: [
        `Your enquiry reaches us by email. ${studio.emailjs?.publicKey ? 'It is sent through EmailJS, an email-sending service, to our studio mailbox on Gmail.' : 'It is sent through our own server to our email inbox (Gmail).'} The AI assistant uses an AI provider chosen by us. Our website is hosted on Vercel. These companies process data only to provide their service.`,
      ] },
      { h: 'How long we keep it', p: [
        `If we do not end up working together, we delete your enquiry after ${studio.retentionMonths} months. If we do work together, we keep project records for as long as the work and any related payments or legal duties require.`,
      ] },
      { h: 'Your rights', p: [
        'You can ask to see the data we hold about you, correct it, delete it, or withdraw your consent. Under India’s Digital Personal Data Protection Act, 2023, and similar laws elsewhere, you also have the right to raise a complaint with us first and then with the relevant authority.',
        'We answer deletion and access requests within 30 days. We may need to confirm that the request comes from the email address you used.',
      ], deletion: true },
      { h: 'Children', p: [
        'This website is for businesses and adults. If you are under 18, please ask a parent or guardian to contact us for you. We do not knowingly collect data from children, and we delete it if we find we have.',
      ] },
      { h: 'Security', p: [
        'The site uses HTTPS. API keys for the AI assistant stay on the server and are never sent to your browser. No system is perfectly secure, so please do not send passwords or payment details through the form or chat.',
      ] },
      { h: 'Changes and contact', p: [
        'If we change this policy we update the date at the top. ' + contact,
      ] },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: `These terms apply when you use this website or hire ${studio.legalName} to build a website or web app.`,
    sections: [
      { h: 'Quotes and scope', p: [
        'Prices on this site are starting ranges. A project starts only after you accept a written quote that lists what is included, the price and the timeline. Answers from the AI assistant or the FAQ are general information, not an offer or a quote.',
      ] },
      { h: 'Payments', p: [
        'Unless the quote says otherwise, payment is 50% to start, 30% midway and 20% at launch. Prices are in Indian rupees and exclude GST if it applies. Domain, hosting and paid third-party tools are billed at cost, in your name, and agreed with you first. If a payment is late, we may pause work until it is made.',
      ] },
      { h: 'Revisions and delays', p: [
        'The quote states how many rounds of revisions are included, usually two. Extra work is quoted before we start it. If feedback, content or approvals reach us late, the timeline moves by the same amount.',
      ] },
      { h: 'Your content', p: [
        'You are responsible for the text, images, logos and other material you give us, and you confirm you have the right to use it. We are not liable for claims about material you supplied.',
      ] },
      { h: 'Ownership', p: [
        'When the final payment is made, you own the website and the content made specifically for you. We keep the right to reuse our general tools, code patterns and know-how, and to show the finished work in our portfolio unless you ask us not to.',
      ] },
      { h: 'Third-party services', p: [
        'Hosting, domains, payment gateways, email and AI services are run by other companies under their own terms and prices. We help you set them up but do not control them.',
      ] },
      { h: 'Support after launch', p: [
        `We fix bugs in the agreed scope for ${studio.warrantyDays} days after launch at no extra cost. After that, changes and support are available as a paid maintenance plan or on request.`,
      ] },
      { h: 'Liability', p: [
        'We work with care, but we cannot promise specific results such as search ranking, sales or uptime of third-party services. Our total liability for any claim is limited to the amount you paid us for the project.',
      ] },
      { h: 'Cancellation and refunds', p: ['See the Refund Policy.'] },
      { h: 'Governing law', p: [
        `These terms are governed by the laws of India${studio.courtCity ? `, and the courts of ${studio.courtCity} have jurisdiction` : ''}. If part of these terms is found unenforceable, the rest still applies.`,
      ] },
      { h: 'Contact', p: [contact] },
    ],
  },
  refunds: {
    title: 'Refund Policy',
    intro: 'We want you to know before you pay what happens if plans change. This policy is part of our Terms of Service.',
    sections: [
      { h: 'If you cancel before we start', p: ['We refund your advance in full.'] },
      { h: 'If you cancel after work has started', p: [
        'We refund the part of your payments that covers work not yet done, based on the stages finished (design, build, launch). Work already delivered stays billable.',
      ] },
      { h: 'If we cannot deliver', p: [
        'If we are unable to deliver what the quote promised, we refund the payments for the parts we did not deliver.',
      ] },
      { h: 'After launch', p: [
        `Payments are not refundable once the project is delivered and approved. If something in the agreed scope does not work, we fix it free for ${studio.warrantyDays} days after launch.`,
      ] },
      { h: 'Costs paid to others', p: [
        'Domain names, hosting, licences and other purchases made for you from third parties cannot be refunded by us once bought, because we do not receive that money.',
      ] },
      { h: 'How refunds are paid', p: [
        `Refunds go back to the original payment method within ${studio.refundDays} working days of us agreeing to them. To ask for one, email ${studio.email} with your project name and the reason.`,
      ] },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro: 'This site is built to use as little browser storage as possible. It sets no advertising or tracking cookies.',
    sections: [
      { h: 'What is stored in your browser', p: [
        'theme: remembers whether you chose light or dark mode. Kept until you clear your browser data. Needed for the setting you asked for.',
        'consent-v1: remembers your cookie choice and the date, so we do not ask again on every visit. Kept until you clear your browser data.',
      ], list: true },
      { h: 'Optional analytics', p: [
        studio.analytics.src
          ? 'If you choose “Accept analytics”, a privacy-friendly analytics script loads and we may keep the campaign tags in a link with your enquiry. If you choose “Essential only”, none of this happens.'
          : 'No analytics tool is active on this site right now. If we add one, it will load only after you choose “Accept analytics”.',
      ] },
      { h: 'Third parties', p: [
        'Fonts and images are served from this site itself, so visiting does not send your details to a font or image provider. If you open our Instagram link, Instagram’s own cookie rules apply there.',
      ] },
      { h: 'Change your choice', p: [
        'Use “Cookie settings” in the footer at any time, or clear this site’s data in your browser.',
      ], settings: true },
    ],
  },
}

export const legalKeys = Object.keys(legalPages)
