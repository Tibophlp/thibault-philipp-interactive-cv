import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import OrbMount from '../components/OrbMount'
import { fade } from '../motion'

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
        {/* scrim so the message stays legible wherever the orb lands */}
        <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_50%_50%,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.5)_60%,transparent_100%)]" />
      </div>
      <motion.div
        {...fade()}
        className="relative z-10"
      >
        <p className="label text-fog">404 — lost in the void</p>
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
