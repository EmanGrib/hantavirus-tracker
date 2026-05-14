# Hantavirus Tracker

Real-time global Hantavirus case tracker with interactive 3D globe, epidemiological statistics, and outbreak mapping.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (opens at http://localhost:3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## Project Structure

```
hantavirus-tracker/
├── public/
│   ├── favicon.svg
│   └── ads.txt              ← Update with your AdSense publisher ID
├── src/
│   ├── main.jsx             ← React entry point
│   ├── index.css            ← Global dark theme styles
│   └── App.jsx              ← Full application (Globe, charts, table, ads)
├── index.html               ← HTML shell (AdSense script tag here)
├── vite.config.js
└── package.json
```

## Before Launch — Required Customizations

| Placeholder | File | Replace with |
|---|---|---|
| `ca-pub-XXXXXXXXXXXXXXXX` | `index.html`, `public/ads.txt` | Your Google AdSense publisher ID |
| `YOUR_USERNAME` | `src/App.jsx` → `DonateButton` | Your Buy Me a Coffee username |

## Deployment

### Vercel (recommended)
```bash
npm i -g vercel
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## Tech Stack

- **React 18** + **Vite 5**
- **D3.js 7** — orthographic globe on HTML Canvas
- **Recharts** — time-series and bar charts
- World boundaries via [world-atlas](https://github.com/topojson/world-atlas) CDN

## Roadmap

See the handoff document (`Hantavirus_Tracker_Handoff.md`) for the full Phase 2 & 3 roadmap including live data wiring, TypeScript migration, React Query polling, and PWA support.
