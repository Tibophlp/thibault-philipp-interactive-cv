import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
/* Vercel Analytics. Use the `/react` entry, NOT the `/next` one the Vercel
   dashboard suggests — this is a Vite SPA, and `/next` imports
   next/navigation, which doesn't exist here. Cookieless, no consent banner
   needed; it only reports from the deployed site, not localhost. */
import { Analytics } from '@vercel/analytics/react'
import Cursor from './components/Cursor'

/* Route-level code splitting — each page (and three.js via the orb) loads
   on demand rather than in the initial bundle. */
const Home = lazy(() => import('./pages/Home'))
const Experience = lazy(() => import('./pages/Experience'))
const Projects = lazy(() => import('./pages/Projects'))
const Skills = lazy(() => import('./pages/Skills'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
/* Hidden content editor — unlinked, password-gated, never prefetched. */
const Studio = lazy(() => import('./pages/Studio'))

/* On navigation: reset scroll and move focus to the main region so
   keyboard and screen-reader users land in the new page's content. */
function RouteChange() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    const main = document.getElementById('main')
    if (main) main.focus({ preventScroll: true })
  }, [pathname])
  return null
}

/* Once the first page is up and the browser is idle, quietly fetch the other
   route chunks so every navigation after that is instant. */
function PrefetchRoutes() {
  useEffect(() => {
    const prefetch = () => {
      import('./pages/Home')
      import('./pages/Experience')
      import('./pages/Projects')
      import('./pages/Skills')
      import('./pages/Contact')
    }
    const id = 'requestIdleCallback' in window
      ? requestIdleCallback(prefetch, { timeout: 4000 })
      : setTimeout(prefetch, 2500)
    return () =>
      'cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id)
  }, [])
  return null
}

/* Cursor spotlight on glass cards: one delegated listener feeds each card's
   CSS vars; the actual highlight is a pure-CSS ::after in index.css. */
function CardSpotlight() {
  useEffect(() => {
    const onMove = (e) => {
      const card = e.target.closest?.('.glass-hover')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return null
}

function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ghost focus:px-4 focus:py-2 focus:text-sm focus:text-void"
      >
        Skip to content
      </a>
      <RouteChange />
      <PrefetchRoutes />
      <CardSpotlight />
      <Cursor />
      <Analytics />
      <Suspense fallback={<div className="min-h-dvh w-full bg-void" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
