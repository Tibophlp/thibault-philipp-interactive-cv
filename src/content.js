/* ── Locked site content ─────────────────────────────────────
   Sourced from Thibault's real CV where possible. Items marked
   PLACEHOLDER are inferred from the brief and need his real detail.
   Editing copy? This is the only file you need to touch. */

/* Site section order — drives the prev/next footer nav on detail pages. */
export const sections = [
  { path: '/experience', label: 'Experience' },
  { path: '/projects', label: 'Projects' },
  { path: '/skills', label: 'Skills & Languages' },
  { path: '/contact', label: 'Contact' },
]

const nowDefault = {
  eyebrow: 'What I do now',
  company: 'Marble',
  location: 'Paris · Fintech (Series A)',
  lead:
    'I onboard fintech clients onto Marble’s AML/KYC compliance platform and run the outreach that fills the pipeline behind it.',
  body:
    'Day to day that means coordinating technical integration, helping teams adopt rule-building and data-configuration workflows, and translating dense regulatory requirements into something the platform can actually enforce — while designing geographic outreach campaigns that qualify the next set of accounts.',
  markets: ['BVI', 'United States', 'United Kingdom', 'Luxembourg', 'France', 'Singapore'],
}

const trackDefault = [
  {
    id: 'marble',
    company: 'Marble',
    role: 'Business Development & Onboarding Intern',
    period: 'Jun 2026 – Aug 2026',
    location: 'Paris, France',
    tag: 'Fintech · BD',
    summary:
      'Onboarded fintech clients onto a Series-A AML/KYC compliance platform and ran the outreach that qualified them.',
    points: [
      'Onboarded major fintech clients onto a SaaS AML/KYC compliance platform, coordinating technical integration and driving adoption of rule-building and data-configuration workflows.',
      'Designed and executed geographic outreach campaigns targeting BVI-registered financial institutions and US-based banks, identifying and qualifying prospects for the Series-A startup.',
      'Worked with compliance and operations teams to map regulatory requirements and translate them into platform configurations.',
    ],
  },
  {
    id: 'deloitte',
    company: 'Deloitte',
    role: 'Business Analyst Intern',
    period: 'Jun 2025 – Dec 2025',
    location: 'Luxembourg',
    tag: 'Consulting · BA',
    summary:
      'Mapped processes and led a contract-lifecycle platform rollout across a 3,000+ employee firm.',
    points: [
      'Streamlined workflows across a 3,000+ employee firm by mapping team processes and identifying bottlenecks, reducing operational friction across Audit, HR, Tax, and Consulting.',
      'Led implementation of a Contract Lifecycle Management platform (Sirion), facilitating adoption sessions with 50–100 employees per division and establishing a single source of truth.',
      'Assessed stakeholder needs across all business lines, translating requirements into tools and process improvements that reduced manual workload.',
    ],
  },
  {
    id: 'ibg',
    company: 'Innovative Beauty Group',
    role: 'Project Manager Intern',
    period: 'Jun 2024 – Aug 2024',
    location: 'Shenzhen, China',
    tag: 'Procurement · PM',
    summary:
      'Delivered 7 procurement projects on time across three sectors and cut project delays by 30%.',
    points: [
      'Delivered 7 procurement projects on time across beauty, retail, and aviation, coordinating global clients and cross-functional timelines to reduce delays by 30%.',
      'Initiated a supplier-consolidation study across China, mapping multi-factory distribution flows into centralized collection hubs to reduce fragmented shipments to Europe and North America.',
    ],
  },
]

const builderDefault = [
  {
    id: 'referme',
    name: 'ReferMe',
    kind: 'Side project',
    blurb: 'A referral-driven way to reach the right people faster.',
    detail:
      'A side project built on a simple observation: warm introductions beat cold applications every time. ReferMe explores how to make referrals the default way to reach the right person — currently in build, learnings already feeding into how I do outreach.',
    stack: [],
    placeholder: true,
  },
  {
    id: 'extension',
    name: 'Chrome Extension',
    kind: 'Browser tool',
    blurb: 'A browser extension that removes friction from a daily workflow.',
    detail:
      'A Chrome extension built to strip the repetitive clicks out of a workflow I ran every day. Small scope, real users: me first — shipped end to end, from idea to a working tool living in the browser toolbar.',
    stack: [],
    placeholder: true,
  },
  {
    id: 'automation',
    name: 'Automation stack',
    kind: 'GTM engineering',
    blurb: 'Outbound and enrichment wired together so the busywork runs itself.',
    detail:
      'A working go-to-market automation stack: Lemlist for sequencing, Attio as the CRM layer, Apify for scraping and enrichment, n8n for orchestration, and Claude Code stitching the custom pieces together. This is the fluency that separates a BD candidate who talks about tools from one who runs them.',
    stack: ['Lemlist', 'Attio', 'Apify', 'n8n', 'Claude Code'],
    placeholder: false,
  },
]

const toolkitDefault = {
  languages: [
    { name: 'French', level: 'Native', dots: 5 },
    { name: 'English', level: 'C1 · Fluent', dots: 4 },
    { name: 'Spanish', level: 'B1', dots: 2 },
    { name: 'Mandarin', level: 'Notions', dots: 1 },
  ],
  frameworks: ['Challenger Sale', 'Jab, Jab, Jab, Right Hook', 'Value-based discovery'],
  finance: ['Financial modeling (P&L, DCF)', 'AMF / MiFID II', 'CSRD / DPEF awareness', 'Bloomberg BMC'],
  tools: [
    'Advanced Excel (VBA, Macros)',
    'Attio · Lemlist · Apify',
    'n8n',
    'Claude Code',
    'Adobe Suite',
    'Prompt engineering',
  ],
}

const educationDefault = [
  {
    id: 'edhec',
    title: 'EDHEC Business School',
    detail: 'BBA, Finance Major',
    meta: 'Lille, France · Class of 2027',
    note: 'Ranked 4th best French business school (Le Point 2026). Coursework: Corporate Finance, CSR, Law, Political Science.',
  },
  {
    id: 'HighSchool',
    title: 'Shekou International School',
    detail: 'Student',
    meta: 'Shenzhen, China · 2026',
    note: 'Passed the International Baccalaureate Diploma. (HL: English, Economics, Film | SL: Math AA, ESS, French)',
  },
  {
    id: 'abc',
    title: 'ABC — Head of Sponsorship',
    detail: 'Student activity',
    meta: 'EDHEC',
    note: 'Managed a team of 5 students to generate leads and organize partnerships with companies. Organized a conference on the Vietnamese economy, secured local media coverage and a sponsored ticket from Vietnam Airlines.',
  },
  {
    id: 'Podcast',
    title: 'Rhetorical — Podcast Host',
    detail: 'Representation',
    meta: 'Sep 2023 – Jun 2024',
    note: 'Co-hosted a podcast on Spotify for 2 years tackling societal issues with a new guest for every episode (100+ listeners tuned in).',
  },
]

const headedDefault = {
  eyebrow: 'Where I’m headed',
  statement:
    'Early-career Sales, BD, or Business Analyst roles — in tech or fintech, based in Dublin or London, from January 2027.',
  sub:
    'Open on the exact title and on internship vs. full-time. What stays fixed: a product worth selling, a team that builds, and room to keep shipping on the side.',
}

const contactDefault = {
  eyebrow: 'Contact',
  line: 'Grab 15 minutes, or just say hi.',
  email: 'thibault.philipp@edhec.com',
  phone: '+33 6 38 29 06 68',
  links: [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'in/thibault-philipp',
      href: 'https://www.linkedin.com/in/thibault-philipp',
      placeholder: false,
    },
    {
      id: 'email',
      label: 'Email',
      handle: 'thibault.philipp@edhec.com',
      href: 'mailto:thibault.philipp@edhec.com',
      placeholder: false,
    },
    {
      id: 'github',
      label: 'GitHub',
      handle: '⚠︎ add your GitHub username',
      href: 'https://github.com/',
      placeholder: true,
    },
    {
      id: 'x',
      label: 'X / Twitter',
      handle: '⚠︎ add if you want it shown',
      href: 'https://x.com/',
      placeholder: true,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      handle: '⚠︎ add if you want it shown',
      href: 'https://instagram.com/',
      placeholder: true,
    },
  ],
}

/* ── Overrides (hidden /studio page) ─────────────────────────
   The studio saves edits to localStorage; they take precedence
   over the defaults above — in this browser only. Publishing a
   change for everyone still means updating this file (paste the
   studio's exported JSON into Claude Code) and redeploying. */
export const OVERRIDE_KEY = 'tibo:content-overrides'

const stored = (() => {
  try {
    return JSON.parse(window.localStorage.getItem(OVERRIDE_KEY) || 'null')
  } catch {
    return null
  }
})()

export const contentDefaults = {
  now: nowDefault,
  track: trackDefault,
  builder: builderDefault,
  toolkit: toolkitDefault,
  education: educationDefault,
  headed: headedDefault,
  contact: contactDefault,
}

export const now = stored?.now ?? nowDefault
export const track = stored?.track ?? trackDefault
export const builder = stored?.builder ?? builderDefault
export const toolkit = stored?.toolkit ?? toolkitDefault
export const education = stored?.education ?? educationDefault
export const headed = stored?.headed ?? headedDefault
export const contact = stored?.contact ?? contactDefault
