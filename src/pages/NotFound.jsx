import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import OrbMount from '../components/OrbMount'

const ease = [0.19, 1, 0.22, 1]

/* Friendly dead-end: the orb keeps you company, one obvious way home. */
export default function NotFound() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className="relative flex h-dvh w-full flex-col items-center justify-center bg-void px-6 text-center text-ghost outline-none"
    >
      <div className="pointer-events-none absolute inset-0">
        <OrbMount />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="relative z-10 mt-[52vh]"
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-fog">404 — lost in the void</p>
        <h1 className="mt-3 text-2xl font-medium tracking-tight text-ghost md:text-3xl">
          This page doesn&rsquo;t exist.
        </h1>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full border border-ash px-5 py-2 text-sm text-mist transition-colors hover:border-fog hover:text-ghost"
        >
          ← Back to home
        </Link>
      </motion.div>
    </main>
  )
}
