import { lazy, Suspense } from 'react'

/* Lazy boundary for the heavy WebGL orb (~237KB gzipped of three.js).
   Deferred to first render, so a device without WebGL — which renders
   StaticOrb instead — never pays for the download. */
const Orb = lazy(() => import('./Orb'))

function detectWebGL() {
  if (typeof window === 'undefined') return false
  try {
    const c = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

const WEBGL_OK = detectWebGL()

/* A recognizable orb rendered in pure CSS: gradient sphere + two white eyes.
   No animation — it's a graceful stand-in, not a replica. */
export function StaticOrb({ mini = false }) {
  const size = mini ? '86%' : '40vmin'
  const eyeW = mini ? 4 : 16
  const eyeH = mini ? 9 : 34
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size,
          height: size,
          background:
            'radial-gradient(38% 34% at 38% 28%, #d6c6ff 0%, #9a8ad6 38%, #b06a86 72%, #4f3f6e 100%)',
          boxShadow: '0 0 90px 8px rgba(108,104,240,0.22)',
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center"
          style={{ gap: mini ? 5 : 22 }}
        >
          <span
            className="block rounded-full bg-white"
            style={{ width: eyeW, height: eyeH }}
          />
          <span
            className="block rounded-full bg-white"
            style={{ width: eyeW, height: eyeH }}
          />
        </div>
      </div>
    </div>
  )
}

export default function OrbMount({ mini = false }) {
  if (!WEBGL_OK) return <StaticOrb mini={mini} />
  return (
    <Suspense fallback={<StaticOrb mini={mini} />}>
      <Orb mini={mini} />
    </Suspense>
  )
}
