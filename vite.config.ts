import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://alexelash.github.io/miscreants/ on GitHub Pages
  base: '/miscreants/',
  plugins: [react(), tailwindcss()],
  // Expose the dev server on the LAN so phones on the same Wi-Fi can load it
  server: { host: true },
  preview: { host: true },
  // Full Preline bundle is intentional; bundle size isn't a priority yet
  build: { chunkSizeWarningLimit: 1000 },
})
