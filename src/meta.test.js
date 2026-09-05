import { describe, test, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/* Seam: the document head as a social crawler receives it. */
let head

beforeAll(() => {
  const html = readFileSync(resolve(import.meta.dirname, '../index.html'), 'utf8')
  head = new DOMParser().parseFromString(html, 'text/html')
})

const content = (selector) => head.querySelector(selector)?.getAttribute('content')

describe('link previews', () => {
  /* The Open Graph spec requires og:image to be an absolute URL — crawlers
     do not resolve it against the page. A root-relative path silently
     yields a preview card with no image on LinkedIn and Facebook, which is
     exactly where this site gets shared. */
  test.each([
    ['og:image', 'meta[property="og:image"]'],
    ['twitter:image', 'meta[name="twitter:image"]'],
  ])('%s is an absolute URL', (_label, selector) => {
    expect(content(selector)).toMatch(/^https:\/\//)
  })

  test('the page declares its canonical address', () => {
    expect(content('meta[property="og:url"]')).toMatch(/^https:\/\//)
    expect(head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toMatch(/^https:\/\//)
  })
})
