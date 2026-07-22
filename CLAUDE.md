# Asme Hero Landing — project context

Single-page hero section: full-screen looping background video, liquid-glass UI,
dark cinematic look.

## Stack
Vite + React 18 + TypeScript + Tailwind CSS 3 + lucide-react. Default Tailwind
config, no other UI libraries. The whole page lives in `src/App.tsx`.

## Commands
- `npm run dev` — dev server (http://localhost:5173)
- `npm run build` — `tsc --noEmit` typecheck then `vite build`
- `npm run preview` — preview the production build

## Layout notes
- Background video is `public/asme-hero.mp4`, served locally (no external CDN).
  `src/App.tsx` sets `VIDEO_URL = '/asme-hero.mp4'`.
- Video is `object-cover` and shifted down with `translate-y-[17%]` (top cropped).
- Loop fade is JS-driven via `requestAnimationFrame` (no CSS transitions):
  500ms fade-in on load/restart, 500ms fade-out when 0.55s remain, restart 100ms
  after `ended`. `fadingOutRef` guards against repeated fade-outs; each fade
  cancels the prior animation frame and resumes from the current opacity.
- `.liquid-glass` (in `src/index.css`) is the glass treatment: luminosity blend,
  `backdrop-filter: blur(4px)`, and a gradient border drawn with a mask-composite
  trick on `::before`.
- Heading uses Google Font "Instrument Serif" via `@import` in `src/index.css`,
  applied inline with `fontFamily: "'Instrument Serif', serif"`.

## Conventions
- Keep everything in `src/App.tsx` unless it grows large enough to split.
- Match existing Tailwind utility style; don't introduce a component library.
