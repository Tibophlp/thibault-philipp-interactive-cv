import { useState } from 'react'
import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'
import { contact, headed } from '../content'

const ease = [0.19, 1, 0.22, 1]

/* Only links with real destinations — placeholders stay in content.js
   until Thibault fills them in, and never reach a recruiter's screen. */
const liveLinks = contact.links.filter((l) => !l.placeholder)

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  }

  return (
    <PageShell
      eyebrow="04 · Contact & Links"
      title={contact.line}
      intro={`${headed.statement} ${headed.sub}`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {liveLinks.map((l, i) => (
          <motion.a
            key={l.id}
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.06 }}
            className="glass glass-hover group flex items-center justify-between p-6 md:p-7"
          >
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog">{l.label}</p>
              <p className="mt-1 truncate text-sm text-ghost md:text-base">{l.handle}</p>
            </div>
            <span className="ml-3 shrink-0 text-fog transition-transform group-hover:translate-x-1">
              ↗
            </span>
          </motion.a>
        ))}

        {/* copy-email card — for recruiters who paste into an ATS or CRM */}
        <motion.button
          type="button"
          onClick={copyEmail}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.1 + liveLinks.length * 0.06 }}
          className="glass glass-hover group flex items-center justify-between p-6 text-left md:p-7"
        >
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-fog">Copy email</p>
            <p className={`mt-1 truncate text-sm md:text-base ${copied ? 'text-violet' : 'text-ghost'}`}>
              {copied ? 'Copied to clipboard ✓' : contact.email}
            </p>
          </div>
          <span className="ml-3 shrink-0 text-fog transition-transform group-hover:scale-110">
            ⧉
          </span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease, delay: 0.5 }}
        className="mt-16 flex flex-col justify-between gap-3 border-t border-hairline pt-8 text-[11px] uppercase tracking-[0.2em] text-smoke sm:flex-row"
      >
        <span>Thibault Philipp — {new Date().getFullYear()}</span>
        <span>{contact.phone}</span>
        <span>Built with React, R3F &amp; a lot of Claude Code</span>
      </motion.div>
    </PageShell>
  )
}
