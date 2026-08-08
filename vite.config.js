import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // three.js ships as its own on-demand chunk (the orb); this is expected.
    chunkSizeWarningLimit: 1100,
  },
})
