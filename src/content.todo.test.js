import { describe, test, expect } from 'vitest'
import { builder, contact } from './content'

/* ── Content to-do list ──────────────────────────────────────
   These are NOT part of `npm test`. They are a running list of
   claims the site makes that the content does not yet back up.
   Run `npm run test:todo` to see what is still outstanding.
   Each failure is a piece of copy only Thibault can write. */

describe('projects page backs up its headline', () => {
  /* The page is titled "A BD who actually ships." A visitor reading that
     should be able to reach, or at least see the makeup of, each thing
     listed. Evidence = a link out, or a named stack. */
  test.each(builder.map((p) => [p.name, p]))(
    '%s shows evidence it was built',
    (_name, project) => {
      const hasLink = typeof project.href === 'string' && project.href.length > 0
      const hasStack = Array.isArray(project.stack) && project.stack.length > 0
      expect(hasLink || hasStack).toBe(true)
    },
  )
})

describe('github profile is worth linking', () => {
  test('every project claiming a repo names it', () => {
    const github = contact.links.find((l) => l.id === 'github')
    expect(github).toBeDefined()
    /* Projects.jsx tells recruiters these were built. If GitHub is linked
       from that argument, the shipped ones should point at real repos. */
    const shipped = builder.filter((p) => !p.placeholder)
    for (const project of shipped) {
      expect(project.href, `${project.name} has no link`).toBeTruthy()
    }
  })
})
