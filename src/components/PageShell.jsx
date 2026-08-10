import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import OrbMount from './OrbMount'
import { sections } from '../content'

const ease = [0.19, 1, 0.22, 1]

/* Layout for the detail pages: a small orb parked top-right that
   doubles as a home button, a back link, a centered content column,
   and a prev/next footer so a recruiter can flow through the site
   without ever going back to the hub. Content fades up on mount. */
export default function PageShell({ eyebrow, title, intro, children }) {
  const { pathname } = useLocation()
  const idx = sections.findIndex((s) => s.path === pathname)
  const prev = idx > 0 ? sections[idx - 1] : null
  const next = idx >= 0 && idx < sections.length - 1 ? sections[idx + 1] : null
  const isContact = pathname === '/contact'

  return (
    <main
      id="main"
      tabIndex={-1}
      className="relative min-h-dvh w-full overflow-x-clip bg-void px-6 pb-24 pt-8 text-ghost outline-none md:px-10"
    >
      {/* faint ambient glow so detail pages share the home page's atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh]"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(108,104,240,0.07) 0%, rgba(108,104,240,0.02) 45%, transparent 70%)',
        }}
      />

      {/* mini orb → home (top-right) */}
      <Link
        to="/"
        aria-label="Back to home"
        className="fixed right-5 top-5 z-40 block h-14 w-14 rounded-full transition-transform hover:scale-105 md:h-16 md:w-16"
      >
        <OrbMount mini />
      </Link>

      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="flex items-center justify-between pr-16 md:pr-20"
        >
          <Link
            to="/"
            className="font-mono text-[12px] uppercase tracking-[0.22em] text-fog transition-colors hover:text-ghost"
          >
            ← Back
          </Link>
          <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-smoke">
            Thibault Philipp
          </span>
        </motion.div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.08 }}
          className="mt-16 md:mt-24"
        >
          <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.22em] text-fog">{eyebrow}</p>
          <h1 className="text-4xl font-medium tracking-tight text-ghost md:text-6xl">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed text-mist">{intro}</p>}
        </motion.header>

        <div className="mt-14">{children}</div>

        {/* prev / next section nav */}
        <motion.nav
          aria-label="Section navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
          className="mt-20 flex items-center justify-between gap-4 border-t border-hairline pt-8"
        >
          {prev ? (
            <Link
              to={prev.path}
              className="group flex flex-col gap-1 text-left"
            >
              <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-smoke">Previous</span>
              <span className="text-sm text-fog transition-colors group-hover:text-ghost md:text-base">
                ← {prev.label}
              </span>
            </Link>
          ) : (
            <Link to="/" className="group flex flex-col gap-1 text-left">
              <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-smoke">Back to</span>
              <span className="text-sm text-fog transition-colors group-hover:text-ghost md:text-base">
                ← Home
              </span>
            </Link>
          )}
          {next ? (
            <Link to={next.path} className="group flex flex-col gap-1 text-right">
              <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-smoke">Next</span>
              <span className="text-sm text-fog transition-colors group-hover:text-ghost md:text-base">
                {next.label} →
              </span>
            </Link>
          ) : (
            <Link to="/" className="group flex flex-col gap-1 text-right">
              <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-smoke">Back to</span>
              <span className="text-sm text-fog transition-colors group-hover:text-ghost md:text-base">
                Home →
              </span>
            </Link>
          )}
        </motion.nav>

        {/* standing CTA on every page except contact itself */}
        {!isContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease, delay: 0.5 }}
            className="mt-10"
          >
            <Link
              to="/contact"
              className="glass glass-hover group flex items-center justify-between rounded-3xl p-6 md:p-7"
            >
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-fog">Hiring?</p>
                <p className="mt-1 text-base text-ghost md:text-lg">
                  Grab 15 minutes — Dublin or London, from January 2027.
                </p>
              </div>
              <span className="text-fog transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}
