/* Shared motion vocabulary. Every page uses the same easing curve and the
   same two entrance gestures; they live here so a change to the site's
   timing is one edit, not seven. */

export const ease = [0.19, 1, 0.22, 1]

/* Content arriving on mount — detail pages stagger their cards with `delay`. */
export const enter = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
})

/* Content arriving on scroll — used below the fold on the home page. */
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.6, ease, delay },
})

/* A plain crossfade, for elements that shouldn't travel. */
export const fade = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.8, ease, delay },
})
