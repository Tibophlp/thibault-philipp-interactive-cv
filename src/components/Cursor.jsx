import { useEffect, useRef } from 'react'

/* ── Custom cursor ───────────────────────────────────────────
   A small white ball with mix-blend-mode: difference, so it
   optically inverts whatever sits underneath it — text, glass,
   the orb. It trails the pointer with a soft lerp and swells
   over anything interactive. Pointer-only: touch devices never
   see it and keep their native behavior. */

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, .glass-hover'

export default function Cursor() {
  const dotRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = dotRef.current
    if (!dot) return

    // hide the native cursor only once we know the custom one is live
    document.documentElement.classList.add('custom-cursor')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let scale = 1
    let hoverScale = 1
    let pressed = false
    let raf

    const render = () => {
      const k = reduceMotion ? 1 : 0.24
      x += (tx - x) * k
      y += (ty - y) * k
      const target = hoverScale * (pressed ? 0.75 : 1)
      scale += (target - scale) * (reduceMotion ? 1 : 0.18)
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      raf = requestAnimationFrame(render)
    }

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      hoverScale = e.target?.closest?.(INTERACTIVE) ? 2.4 : 1
      dot.style.opacity = '1'
    }
    const onDown = () => {
      pressed = true
    }
    const onUp = () => {
      pressed = false
    }
    const onLeave = () => {
      dot.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('custom-cursor')
    }
  }, [])

  return <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
}
