import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import OrbMount from '../components/OrbMount'
import { home, contact } from '../content'

const ease = [0.19, 1, 0.22, 1]

const explore = [
  { index: '01', title: 'Experience', sub: 'Marble · Deloitte · IBG', to: '/experience' },
  { index: '02', title: 'Projects', sub: 'Automation · ReferMe · Chrome ext', to: '/projects' },
  { index: '03', title: 'Skills & Languages', sub: 'Finance · GTM tools · 4 languages', to: '/skills' },
  { index: '04', title: 'Contact', sub: 'Email · LinkedIn · 15 minutes', to: '/contact' },
]

const linkedin = contact.links.find((l) => l.id === 'linkedin')

/* Fade-up used by every below-the-fold section. */
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, ease },
}

/* ── Hero name with the blob-reveal effect ───────────────────
   Two stacked copies of the name: the base in solid white, an
   overlay filled with an animated iridescent gradient that only
   shows through an organic mask chasing the cursor (see
   .hero-name-shimmer in index.css). When the pointer goes idle —
   or on touch devices, where it never moves — the blob drifts on
   its own so the name always has life in it. */
function HeroName({ reduceMotion }) {
  const ref = useRef(null)

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return
    let raf
    let lastMove = 0
    const target = { x: null, y: null }
    const pos = { x: null, y: null }

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      target.x = e.clientX - r.left
      target.y = e.clientY - r.top
      lastMove = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const loop = (now) => {
      const t = now / 1000
      // autonomous drift when idle (>3s) or before the first pointer event
      if (target.x === null || now - lastMove > 3000) {
        const r = el.getBoundingClientRect()
        target.x = r.width / 2 + Math.cos(t * 0.55) * r.width * 0.32
        target.y = r.height / 2 + Math.sin(t * 0.85) * r.height * 0.35
      }
      if (pos.x === null) {
        pos.x = target.x
        pos.y = target.y
      }
      pos.x += (target.x - pos.x) * 0.1
      pos.y += (target.y - pos.y) * 0.1
      el.style.setProperty('--mx', `${pos.x}px`)
      el.style.setProperty('--my', `${pos.y}px`)
      // wobbling lobe offsets keep the mask edge organic, not circular
      el.style.setProperty('--w1x', `${Math.cos(t * 1.1) * 34}px`)
      el.style.setProperty('--w1y', `${Math.sin(t * 0.8) * 26}px`)
      el.style.setProperty('--w2x', `${Math.cos(t * 0.7 + 2) * 42}px`)
      el.style.setProperty('--w2y', `${Math.sin(t * 1.3 + 1) * 30}px`)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduceMotion])

  return (
    <motion.h1
      ref={ref}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease, delay: 0.2 }}
      className="relative z-10 font-display text-[clamp(2.5rem,8.5vw,7rem)] uppercase leading-[0.95]"
    >
      <span className="block" style={{ textShadow: '0 2px 48px rgba(108,104,240,0.3)' }}>
        Thibault Philipp
      </span>
      {!reduceMotion && (
        <span aria-hidden="true" className="hero-name-shimmer">
          Thibault Philipp
        </span>
      )}
    </motion.h1>
  )
}

/* ── Hero side artifacts ─────────────────────────────────────
   Fills the space either side of the orb without cluttering it:
   a dashed orbit ring with a small amber satellite, mono HUD
   readouts (Paris coordinates + live clock, open-to-work status),
   and three glass shards that drift with cursor parallax.
   Desktop only — mobile has no side space to fill. */
const shards = [
  { style: { left: '9%', top: '24%' }, size: 72, depth: 26, rotate: -14, delay: 1.1, bob: 7 },
  { style: { right: '11%', top: '18%' }, size: 46, depth: 16, rotate: 18, delay: 1.3, bob: 9 },
  { style: { right: '8%', bottom: '27%' }, size: 90, depth: 34, rotate: -24, delay: 1.5, bob: 8 },
]

function HeroArtifacts({ reduceMotion }) {
  const wrapRef = useRef(null)
  const [time, setTime] = useState('')

  /* live Paris clock — one tick per second */
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  /* cursor parallax on the shards */
  useEffect(() => {
    if (reduceMotion) return
    const els = wrapRef.current?.querySelectorAll('[data-depth]')
    if (!els?.length) return
    let raf
    const target = { x: 0, y: 0 }
    const pos = { x: 0, y: 0 }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.05
      pos.y += (target.y - pos.y) * 0.05
      els.forEach((el) => {
        const d = Number(el.dataset.depth)
        el.style.transform = `translate3d(${-pos.x * d}px, ${-pos.y * d}px, 0)`
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reduceMotion])

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      {/* dashed orbit ring + satellite */}
      <div className="absolute left-1/2 top-1/2 h-[56vmin] w-[56vmin] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease, delay: 0.9 }}
          className="orbit-ring absolute inset-0 rounded-full border border-dashed border-fog/35"
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/90" />
        </motion.div>
      </div>

      {/* HUD — left: where I am */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease, delay: 1.15 }}
        className="absolute left-7 top-1/2 flex -translate-y-1/2 flex-col gap-2 text-left font-mono text-[12px] uppercase tracking-[0.2em] text-smoke"
      >
        <span>48.8566° N — 2.3522° E</span>
        <span>Paris · {time}</span>
      </motion.div>

      {/* HUD — right: where I'm headed */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease, delay: 1.3 }}
        className="absolute right-7 top-1/2 flex -translate-y-1/2 flex-col items-end gap-2 text-right font-mono text-[12px] uppercase tracking-[0.2em] text-smoke"
      >
        <span className="flex items-center gap-2 text-fog">
          <span className={`h-1.5 w-1.5 rounded-full bg-violet ${reduceMotion ? '' : 'animate-pulse'}`} />
          Open to work — Jan 2027
        </span>
        <span>BD × Builder</span>
      </motion.div>

      {/* floating glass shards with parallax */}
      {shards.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease, delay: s.delay }}
          className="absolute"
          style={s.style}
        >
          <motion.div
            animate={reduceMotion ? {} : { y: [0, -s.bob, 0] }}
            transition={{ duration: 5.5 + i * 1.3, ease: 'easeInOut', repeat: Infinity }}
          >
            <div data-depth={s.depth}>
              <div
                className="glass rounded-2xl"
                style={{ width: s.size, height: s.size, transform: `rotate(${s.rotate}deg)` }}
              />
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
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

  /* The orb belongs to the hero and nowhere else: it sits at the top of
     the page and scrolls away with it, fading out on the way. Only
     opacity is animated — never a transform on the canvas wrapper, which
     is what used to shove the sphere off-centre.

     The fade maps raw scroll pixels straight to opacity: strictly
     decreasing and clamped, so it cannot reverse. (Deriving it from the
     hero's own scroll progress was not monotonic — past ~400px the
     measurement fell back and the orb faded *in* again.) */
  const { scrollY } = useScroll()
  const orbOpacity = useTransform(scrollY, [0, 380], [1, 0])

  return (
    <main id="main" tabIndex={-1} className="relative w-full bg-void text-ghost outline-none">
      {/* ── Hero: big name up top, orb centre stage, one line at the bottom ── */}
      <section className="relative z-10 flex h-dvh flex-col items-center justify-between px-6 pb-10 pt-12 text-center md:pb-14">
        {/* The orb lives here, anchored to the hero — it scrolls out of
            frame with the page and fades as it goes. The wrapper is never
            transformed, only faded. */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-30"
          style={reduceMotion ? undefined : { opacity: orbOpacity }}
        >
          <OrbMount />
        </motion.div>

        <HeroArtifacts reduceMotion={reduceMotion} />
        <HeroName reduceMotion={reduceMotion} />

        <div className="relative w-full max-w-3xl">
          <div className="pointer-events-none absolute inset-x-0 -top-28 bottom-[-3rem] -z-10 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.5 }}
            className="text-lg font-medium text-mist md:text-2xl"
          >
            {home.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
            className="mt-4 font-mono text-[12px] uppercase tracking-[0.2em] text-fog md:text-[12px]"
          >
            {home.availability}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 1 }}
            className="mt-7 flex flex-col items-center gap-1.5"
          >
            <span className="font-mono text-[12px] uppercase tracking-[0.22em] text-smoke">
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

      {/* ── Keyword marquee ── */}
      <div className="relative z-10 overflow-hidden border-y border-hairline py-4" aria-hidden="true">
        <div className="marquee-track flex w-max items-center whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.22em] text-fog">
          {[...home.marquee, ...home.marquee].map((word, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6">{word}</span>
              <span className="text-violet">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── About statement + proof-of-work stats ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-24 md:py-28">
        <motion.p {...reveal} className="font-mono text-[12px] uppercase tracking-[0.22em] text-violet">
          About
        </motion.p>
        <motion.p
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.08 }}
          className="mt-6 max-w-3xl text-2xl leading-snug tracking-tight text-smoke md:text-4xl"
        >
          <span className="font-medium text-ghost">{home.about.lead}</span> {home.about.rest}
        </motion.p>
        <motion.div
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.16 }}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline md:grid-cols-4"
        >
          {home.stats.map((s) => (
            <div key={s.label} className="bg-void p-6 md:p-8">
              <p className="text-3xl font-bold tracking-tight md:text-5xl">{s.value}</p>
              <p className="mt-3 font-mono text-[12px] uppercase leading-relaxed tracking-[0.2em] text-smoke">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Section nav as big typographic rows ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24 md:pb-28">
        <motion.p {...reveal} className="mb-8 font-mono text-[12px] uppercase tracking-[0.22em] text-violet">
          Explore
        </motion.p>
        <nav aria-label="Site sections">
          {explore.map((b, i) => (
            <motion.div key={b.to} {...reveal} transition={{ ...reveal.transition, delay: i * 0.06 }}>
              <Link
                to={b.to}
                className="group flex items-center justify-between gap-6 border-t border-hairline py-7 transition-colors hover:border-ash md:py-9"
              >
                <div className="flex items-baseline gap-5 md:gap-8">
                  <span className="font-mono text-xs text-smoke md:text-sm">{b.index}</span>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-ghost transition-transform duration-500 ease-out group-hover:translate-x-2 md:text-5xl">
                      {b.title}
                    </h2>
                    <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.2em] text-smoke">
                      {b.sub}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-2xl text-fog transition-all duration-500 group-hover:translate-x-2 group-hover:text-violet md:text-3xl">
                  →
                </span>
              </Link>
            </motion.div>
          ))}
          <div className="border-t border-hairline" />
        </nav>
      </section>

      {/* ── Closing CTA ── */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <motion.p {...reveal} className="font-mono text-[12px] uppercase tracking-[0.22em] text-violet">
          Contact
        </motion.p>
        <motion.h2
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.08 }}
          className="mt-6 text-4xl font-bold leading-none tracking-tight md:text-7xl"
        >
          {home.cta.title}
        </motion.h2>
        <motion.p
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.14 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-mist md:text-lg"
        >
          {home.cta.sub}
        </motion.p>
        <motion.div
          {...reveal}
          transition={{ ...reveal.transition, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <a
            href={`mailto:${contact.email}`}
            className="rounded-full bg-ghost px-7 py-3.5 text-sm font-medium text-void transition-opacity hover:opacity-85"
          >
            Email me
          </a>
          {linkedin && (
            <a
              href={linkedin.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ash px-7 py-3.5 text-sm text-mist transition-colors hover:border-fog hover:text-ghost"
            >
              LinkedIn ↗
            </a>
          )}
          <Link
            to="/contact"
            className="rounded-full border border-ash px-7 py-3.5 text-sm text-mist transition-colors hover:border-fog hover:text-ghost"
          >
            All contact options →
          </Link>
        </motion.div>
      </section>

      {/* tiny footer so the scroll lands somewhere intentional */}
      <footer className="relative z-10 flex flex-col items-center gap-2 border-t border-hairline px-6 pb-10 pt-8 text-center font-mono text-[12px] uppercase tracking-[0.2em] text-smoke">
        <span onClick={onSecretTap} className="select-none">
          © {new Date().getFullYear()} Thibault Philipp
        </span>
        <span>Paris → Dublin / London</span>
      </footer>
    </main>
  )
}
