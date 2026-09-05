import { motion } from 'framer-motion'
import PageShell from '../components/PageShell'
import { builder } from '../content'
import { enter } from '../motion'

export default function Projects() {
  return (
    <PageShell
      eyebrow="02 · Personal Projects"
      title="A BD who actually ships."
      intro="The technical fluency that separates me from every other business developer — not claimed, built. Some are live, some are works in progress."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {builder.map((p, i) => (
          <motion.article
            key={p.id}
            {...enter(0.1 + i * 0.07)}
            className="glass flex flex-col p-7 md:p-8"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-medium text-ghost md:text-xl">{p.name}</h2>
              {p.placeholder && (
                <span className="shrink-0 rounded-full border border-amber/40 px-2.5 py-0.5 label text-amber">
                  In progress
                </span>
              )}
            </div>
            <p className="mt-1 label text-smoke">{p.kind}</p>
            <p className="mt-4 flex-1 text-body-sm leading-relaxed text-mist md:text-base">{p.detail}</p>
            {p.stack.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-ash px-3 py-1 text-micro text-fog"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </PageShell>
  )
}
