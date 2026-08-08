import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'
import { track, now, education } from '../content'

const ease = [0.19, 1, 0.22, 1]

export default function Experience() {
  return (
    <PageShell
      eyebrow="01 · Professional Experience"
      title="Outcomes, not job descriptions."
      intro="Three internships across fintech business development, management consulting, and procurement — each framed by what actually changed."
    >
      {/* current role, front and centre */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.05 }}
        className="glass relative mb-10 overflow-hidden p-7 md:p-9"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(108,104,240,0.18) 0%, transparent 70%)',
          }}
        />
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-violet">{now.eyebrow}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-smoke">
            {now.company} · {now.location}
          </p>
        </div>
        <p className="mt-4 text-lg leading-relaxed text-ghost md:text-xl">{now.lead}</p>
        <p className="mt-3 text-sm leading-relaxed text-mist md:text-base">{now.body}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {now.markets.map((m) => (
            <span
              key={m}
              className="rounded-full border border-ash px-3 py-1 text-xs text-fog"
            >
              {m}
            </span>
          ))}
        </div>
      </motion.section>

      <div className="space-y-4">
        {track.map((role, i) => (
          <motion.article
            key={role.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 + i * 0.08 }}
            className="glass p-7 md:p-9"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-medium text-ghost md:text-2xl">{role.company}</h2>
              <span className="text-[10px] uppercase tracking-[0.2em] text-violet">{role.tag}</span>
            </div>
            <p className="mt-1 text-fog">{role.role}</p>
            <p className="text-sm text-smoke">
              {role.period} · {role.location}
            </p>
            <ul className="mt-5 space-y-3">
              {role.points.map((p, j) => (
                <li key={j} className="flex gap-3 text-mist">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  <span className="leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>

      {/* education & campus involvement */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.45 }}
        className="mt-14"
      >
        <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-fog">
          Education &amp; Campus
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {education.map((e) => (
            <article key={e.id} className="glass flex flex-col p-6 md:p-7">
              <h3 className="text-base font-medium text-ghost md:text-lg">{e.title}</h3>
              <p className="mt-0.5 text-sm text-fog">{e.detail}</p>
              <p className="text-xs text-smoke">{e.meta}</p>
              <p className="mt-3 text-sm leading-relaxed text-mist">{e.note}</p>
            </article>
          ))}
        </div>
      </motion.section>
    </PageShell>
  )
}
