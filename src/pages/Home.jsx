import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import OrbMount from '../components/OrbMount'

const ease = [0.19, 1, 0.22, 1]

const blocks = [
  {
    index: '01',
    title: 'Experience',
    sub: 'Marble · Deloitte · IBG',
    to: '/experience',
    side: 'left',
    top: '40%',
  },
  {
    index: '02',
    title: 'Projects',
    sub: 'Automation · ReferMe · Chrome ext',
    to: '/projects',
    side: 'right',
    top: '52%',
  },
  {
    index: '03',
    title: 'Skills & Languages',
    sub: 'Finance · GTM tools · 4 languages',
    to: '/skills',
    side: 'left',
    top: '58%',
  },
  {
    index: '04',
    title: 'Contact',
    sub: 'Email · LinkedIn · 15 minutes',
    to: '/contact',
    side: 'right',
    top: '48%',
  },
]

const sideClasses = {
  left: 'md:left-[6vw] md:right-[44%]',
  right: 'md:left-[44%] md:right-[6vw]',
}

export default function Home() {
  const reduceMotion = useReducedMotion()
  /* Secret door: five quick taps on the copyright line → /studio. */
  const navigate = useNavigate()
  const taps = useRef({ n: 0, t: 0 })
  const onSecretTap = () => {
    const t = Date.now()
    taps.current = t - taps.current.t < 1200 ? { n: taps.current.n + 1, t } : { n: 1, t }
    if (taps.current.n >= 5) navigate('/studio')
  }
  /* The orb gently recedes as you scroll into the blocks — it stays present
     but hands the stage over to the content. */
  const { scrollY } = useScroll()
  const orbScale = useTransform(scrollY, [0, 900], [1, 0.86], { clamp: true })
  const orbOpacity = useTransform(scrollY, [0, 900], [1, 0.75], { clamp: true })
  return (
    <main id="main" tabIndex={-1} className="relative w-full bg-void text-ghost outline-none">
      {/* fixed, always-centered orb — floats in front of everything */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        style={reduceMotion ? {} : { scale: orbScale, opacity: orbOpacity }}
      >
        <OrbMount />
      </motion.div>

      {/* ── Hero: name up top, one line at the bottom ── */}
      <section className="relative z-10 flex h-dvh flex-col items-center justify-between px-6 pb-12 pt-10 text-center md:pb-16 md:pt-14">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className="font-round text-4xl font-medium tracking-wide text-ghost sm:text-5xl md:text-6xl"
          style={{ textShadow: '0 2px 40px rgba(108,104,240,0.25)' }}
        >
          Thibault <span className="font-semibold tracking-[0.06em]">PHILIPP</span>
        </motion.h1>

        <div className="relative w-full max-w-3xl">
          <div className="pointer-events-none absolute inset-x-0 -top-28 bottom-[-3rem] -z-10 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.5 }}
            className="font-round text-lg font-medium text-mist md:text-2xl"
          >
            A Business Development student inspired by the tech industry.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
            className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.25em] text-fog"
          >
            <span>Fintech BD @ Marble</span>
            <span aria-hidden="true" className="text-smoke">·</span>
            <span>Dublin / London from Jan 2027</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 1 }}
            className="mt-7 flex flex-col items-center gap-1.5"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-smoke">
              Scroll to explore
            </span>
            <motion.span
              aria-hidden="true"
              animate={reduceMotion ? {} : { y: [0, 6, 0] }}
              transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }}
              className="text-fog"
            >
              ↓
            </motion.span>
          </motion.div>
        </div>
      </section>

      {/* ── Four compact glass blocks — offset to the sides, inner edge
          tucked behind the orb, staggered down the scroll. Sections are
          deliberately shorter than a viewport so the blocks arrive at a
          brisk rhythm instead of one lonely card per screen. ── */}
      {blocks.map((b) => (
        <section
          key={b.index}
          className="relative z-10 flex min-h-[72vh] items-center justify-center px-6 md:block md:min-h-[56vh] md:px-0"
        >
          <div
            className={`w-full max-w-md md:absolute md:w-auto md:max-w-none md:-translate-y-1/2 ${sideClasses[b.side]}`}
            style={{ top: b.top }}
          >
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease }}
              whileHover={reduceMotion ? {} : { scale: 1.04 }}
              whileTap={{ scale: 0.99 }}
              style={{ transformOrigin: b.side === 'right' ? 'right center' : 'left center' }}
            >
              <Link
                to={b.to}
                aria-label={`${b.title} — open page`}
                className="glass glass-hover group flex min-h-[48vh] flex-col justify-between gap-8 rounded-[32px] p-8 md:min-h-[220px] md:p-10"
              >
                {/* content anchored to the OUTER edge, away from the orb */}
                <div
                  className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 ${
                    b.side === 'right' ? 'justify-end text-right' : 'justify-start text-left'
                  }`}
                >
                  <span className="text-[11px] uppercase tracking-[0.3em] text-fog">
                    {b.index}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-smoke">
                    {b.sub}
                  </span>
                </div>
                <div
                  className={`flex items-end gap-4 ${
                    b.side === 'right' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <h2 className="text-3xl font-medium leading-[1.05] tracking-tight text-ghost md:text-4xl">
                    {b.title}
                  </h2>
                  <span className="mb-1 inline-flex shrink-0 items-center text-fog transition-all group-hover:translate-x-1 group-hover:text-violet">
                    <span className="text-2xl">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      ))}

      {/* tiny footer so the scroll lands somewhere intentional */}
      <footer className="relative z-10 flex flex-col items-center gap-2 px-6 pb-10 pt-6 text-center text-[10px] uppercase tracking-[0.25em] text-smoke">
        <span onClick={onSecretTap} className="select-none">
          © {new Date().getFullYear()} Thibault Philipp
        </span>
        <span>Paris → Dublin / London</span>
      </footer>
    </main>
  )
}
