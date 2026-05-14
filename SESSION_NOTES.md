# Cowork Session Notes — Hantavirus Tracker

## What Was Done

Read the `Hantavirus_Tracker_Handoff.md` file and scaffolded the full Phase 1 project by writing all source files directly to the workspace folder (the bash sandbox was unavailable due to a virtualization issue, so all files were written using file tools instead).

---

## Files Created

| File | Description |
|---|---|
| `package.json` | Project config with react, react-dom, d3, recharts dependencies |
| `vite.config.js` | Vite config — port 3000, React plugin, dist output |
| `index.html` | HTML shell with Google Fonts, AdSense placeholder script tag |
| `public/favicon.svg` | Red "H" favicon |
| `public/ads.txt` | AdSense ads.txt placeholder |
| `src/main.jsx` | React 18 entry point |
| `src/index.css` | Dark theme global styles, custom scrollbar |
| `src/App.jsx` | Full monolithic application (see breakdown below) |
| `README.md` | Setup, deployment, and customization instructions |

---

## What's Inside src/App.jsx

- **55 seed cases** — US Southwest, Argentina, Chile, Brazil, Panama, Finland, Sweden, Germany, Belgium, France, China, South Korea, Russia
- **Globe component** — D3 orthographic projection on HTML Canvas, auto-rotates, drag to spin, heat-map glow blobs, clickable markers color-coded by case type, back-face culling
- **StatCard** — Total cases, deaths + CFR, last 30 days, syndrome count
- **FilterBar** — All / Confirmed / Suspected / Fatal filter pills
- **CaseDetail panel** — Opens on marker/table click, shows strain, syndrome, outcome, age/sex
- **TimeSeriesChart** — Recharts AreaChart, monthly cases + deaths
- **RegionalBarChart** — Recharts horizontal BarChart, cases by country
- **StrainBreakdown** — Card grid per strain with count and percentage
- **CaseTable** — 12 most recent cases, sortable, click to select on globe
- **AdSlot** — 4 placeholder ad slots (leaderboard top, in-content, sidebar, footer leaderboard)
- **DonateButton** — Buy Me a Coffee button in header, CTA section, and footer

---

## To Run the Project

```bash
cd "Hanta-Virus Tracker"
npm install
npm run dev
```

Opens at `http://localhost:3000`.

---

## Before Going Live

| Placeholder | Location | Action |
|---|---|---|
| `ca-pub-XXXXXXXXXXXXXXXX` | `index.html`, `public/ads.txt` | Replace with your AdSense publisher ID |
| `YOUR_USERNAME` | `src/App.jsx` → DonateButton | Replace with your Buy Me a Coffee username |
| AdSense script tag | `index.html` | Uncomment once publisher ID is set |

---

## Next Steps (Phase 2)

Use the Claude Code prompt below to continue in the terminal:

```
I have a Hantavirus Tracker web app scaffolded in this folder. It's a Vite + React single-page app with:

- src/App.jsx — full monolithic component with a D3 orthographic globe, Recharts charts, stat cards, case table, AdSense ad slots, and a Buy Me a Coffee donate button
- src/main.jsx — React entry point
- src/index.css — dark theme global styles
- index.html — HTML shell
- public/favicon.svg and public/ads.txt
- package.json with dependencies: react, react-dom, d3, recharts

The app uses 55 hardcoded seed cases of Hantavirus spanning the US, South America, Europe, China, South Korea, and Russia.

Your first job is to run the project:
1. Run: npm install
2. Run: npm run dev
3. Verify it compiles and opens in the browser

Then proceed with Phase 2 from the handoff spec:
1. Extract App.jsx into separate component files per this structure: Globe.jsx, StatCard.jsx, CaseDetail.jsx, AdSlot.jsx, DonateButton.jsx, TimeSeriesChart.jsx, RegionalBarChart.jsx, StrainBreakdown.jsx, CaseTable.jsx, FilterBar.jsx, Header.jsx, Footer.jsx — all in src/components/
2. Move the CASES seed data to src/data/cases.js
3. Convert inline styles to Tailwind CSS classes (install tailwindcss + @tailwindcss/vite)
4. Add URL query param sync so the active filter persists in the URL
5. Add React Query for data polling (install @tanstack/react-query, staleTime 5 min)

After each step verify the build still compiles before moving on.
```

---

## Installing Claude Code (to continue in terminal)

```powershell
# Windows PowerShell
irm https://claude.ai/install.ps1 | iex

# Then authenticate
claude auth login

# Navigate to project and start
cd "C:\Users\Eman\Documents\Claude\Projects\Hanta-Virus Tracker"
claude
```
