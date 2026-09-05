# thibault-philipp-interactive-cv

Personal portfolio site — a single-page React app deployed on Vercel.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Test suite — must be green before deploying |
| `npm run test:todo` | Content gaps still to be written (expected to fail) |
| `npm run lint` | oxlint |

`npm test` and `npm run build` are separate gates. The test transform is more
permissive than the production bundler, so a green suite does not guarantee a
successful build — run both.

## Editing content

All site copy lives in **`src/content.js`**. It is the only file to touch for
text changes; the pages read from it and nothing else writes to it.

`npm run test:todo` lists the claims the site currently makes that the content
doesn't yet back up — mostly project write-ups that need real links and stacks.

## Layout

```
src/
  content.js       all site copy — edit here
  motion.js        shared easing + entrance gestures
  index.css        design tokens (@theme) and the .label utility
  components/      Orb (WebGL), PageShell, Cursor, ErrorBoundary
  pages/           one file per route
```

## Notes

- The orb is a WebGL shader (three.js via @react-three/fiber). It is ~237KB
  gzipped and loads only on devices that can render it; everything else gets
  the CSS `StaticOrb` fallback.
- Motion respects `prefers-reduced-motion` throughout.
