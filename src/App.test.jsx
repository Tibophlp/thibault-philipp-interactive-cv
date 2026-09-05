import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('a visitor can reach every page', () => {
  test('the home page introduces Thibault', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { name: /thibault philipp/i, level: 1 }))
      .toBeInTheDocument()
  })

  test.each([
    ['/experience', /outcomes, not job descriptions/i],
    ['/projects', /a bd who actually ships/i],
    ['/skills', /what i bring to the table/i],
  ])('%s renders its own heading', async (path, heading) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { name: heading, level: 1 })).toBeInTheDocument()
  })

  test('the contact page lists a reachable email', async () => {
    renderAt('/contact')
    const mailto = await screen.findAllByRole('link', { name: /thibault\.philipp@edhec\.com/i })
    expect(mailto[0]).toHaveAttribute('href', 'mailto:thibault.philipp@edhec.com')
  })

  test('an unknown route still offers a way home', async () => {
    renderAt('/no-such-page')
    expect(await screen.findByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/')
  })
})

describe('every listed experience is shown in full', () => {
  test('each role renders its company and every bullet', async () => {
    const { track } = await import('./content')
    renderAt('/experience')
    for (const role of track) {
      expect(await screen.findByRole('heading', { name: role.company })).toBeInTheDocument()
      for (const point of role.points) {
        expect(screen.getByText(point)).toBeInTheDocument()
      }
    }
  })
})
