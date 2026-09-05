import { describe, test, expect, vi } from 'vitest'
import { education, track } from './content'

/* The year a role or a school entry ended/ran, pulled from the free-text
   `period` / `meta` strings the site actually displays. */
function yearsIn(text) {
  return (text.match(/\b(19|20)\d{2}\b/g) ?? []).map(Number)
}

describe('education timeline', () => {
  test('secondary education concludes before the first professional role begins', () => {
    const firstWorkYear = Math.min(...track.flatMap((role) => yearsIn(role.period)))

    const secondary = education.filter((e) => e.kind === 'secondary')
    expect(secondary).not.toHaveLength(0)

    for (const entry of secondary) {
      for (const year of yearsIn(entry.meta)) {
        expect(year).toBeLessThan(firstWorkYear)
      }
    }
  })
})

describe('published content is authoritative', () => {
  /* A previous build let a JSON blob in localStorage replace whole content
     sections wholesale. A partial blob (one that omitted `stats`) therefore
     deleted every other field in that section, and the home page threw on
     `home.stats.map` with no error boundary to catch it — a black screen
     that survived reload, in that browser, forever. */
  test('a stale override in browser storage cannot change or break the site', async () => {
    localStorage.setItem(
      'tibo:content-overrides',
      JSON.stringify({ home: { tagline: 'injected' } }),
    )
    vi.resetModules()

    const fresh = await import('./content')

    expect(fresh.home.tagline).not.toBe('injected')
    expect(fresh.home.stats).toBeInstanceOf(Array)
    expect(fresh.home.marquee).toBeInstanceOf(Array)
    expect(fresh.home.about.lead).toEqual(expect.any(String))
  })
})
