# miscreants

Mobile-first web app: Vite + React + TypeScript, Motion for animation, Tailwind v4 + Preline for UI.

```sh
npm install
npm run dev      # also served on your LAN IP, so you can open it on a phone on the same Wi-Fi
npm run build
npm run preview
```

- Animations: [`motion/react`](https://motion.dev)
- Preline (full bundle, all plugins): call `usePreline()` in components that render Preline markup.
- iOS/Android shell defaults (safe areas, `dvh`, overscroll, tap highlight) are in `src/index.css`; use the `safe-area` utility on full-screen containers.

## Deploy

Pushes to `main` build and deploy to GitHub Pages via `.github/workflows/deploy.yml` (repo Settings → Pages → Source: GitHub Actions). Live at https://alexelash.github.io/miscreants/. The Vite `base` is `/miscreants/`; if you add a router, use hash routing since Pages has no SPA fallback.
