import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'

function Boom() {
  throw new Error('kaboom')
}

describe('a page that throws', () => {
  beforeEach(() => vi.spyOn(console, 'error').mockImplementation(() => {}))
  afterEach(() => vi.restoreAllMocks())

  test('shows the visitor a way out instead of a blank screen', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.queryByText(/kaboom/)).not.toBeInTheDocument()
  })

  test('renders its children untouched when nothing throws', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <p>the real page</p>
        </ErrorBoundary>
      </MemoryRouter>,
    )

    expect(screen.getByText('the real page')).toBeInTheDocument()
  })
})
