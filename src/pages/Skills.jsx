import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'
import { toolkit } from '../content'

const ease = [0.19, 1, 0.22, 1]

function Card({ label, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay }}
      className="glass p-7 md:p-8"
    >
      <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-fog">{label}</p>
      {children}
    </motion.div>
  )
}

function Tags({ items }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span
          key={t}
          className="rounded-full border border-ash px-3 py-1.5 text-xs text-mist transition-colors hover:border-fog hover:text-ghost"
        >
          {t}
        </span>
      ))}
    </div>
  )
}

export default function Skills() {
  return (
    <PageShell
      eyebrow="03 · Skills & Languages"
      title="What I bring to the table."
      intro="Finance and ESG grounding, the go-to-market tooling I run day to day, the frameworks behind how I sell — and the languages I work in."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Card label="Languages" delay={0.1}>
          <ul className="space-y-3">
            {toolkit.languages.map((l) => (
              <li key={l.name} className="flex items-center justify-between gap-4">
                <span className="text-mist">{l.name}</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-smoke">{l.level}</span>
                  <span className="flex gap-1" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <span
                        key={d}
                        className={`h-1.5 w-1.5 rounded-full ${
                          d <= l.dots ? 'bg-violet' : 'bg-ash'
                        }`}
                      />
                    ))}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card label="Sales frameworks" delay={0.16}>
          <Tags items={toolkit.frameworks} />
        </Card>
        <Card label="Finance & ESG" delay={0.22}>
          <Tags items={toolkit.finance} />
        </Card>
        <Card label="Tools I run" delay={0.28}>
          <Tags items={toolkit.tools} />
        </Card>
      </div>
    </PageShell>
  )
}
