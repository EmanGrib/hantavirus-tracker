# HANTAVIRUS TRACKER — Launch Handoff
## For Cowork / Claude Code Agent

> **Document purpose:** This is a complete, self-contained launch handoff. An AI agent reading only this file has everything needed to make the Hantavirus Tracker site live, connect Google AdSense, and activate the Buy Me a Coffee donation buttons. Execute every step in order. Do not skip steps. Verify each phase before moving to the next.

---

## CONTEXT

The project is a fully built Vite + React single-page application located at:
```
C:\Users\Eman\Hanta Virus Tracker\Hanta-Virus Tracker\
```

It already compiles and builds successfully (`npm run build` produces a `dist/` folder). The codebase includes:
- `src/App.jsx` — full monolithic React app with D3 globe, Recharts charts, AdSlot placeholders, and DonateButton components
- `index.html` — HTML shell with a commented-out AdSense script tag
- `public/ads.txt` — AdSense ads.txt placeholder
- `package.json` — Vite + React + D3 + Recharts

**Current placeholders that need replacing:**
| Placeholder | File | Replace with |
|---|---|---|
| `ca-pub-XXXXXXXXXXXXXXXX` | `index.html`, `public/ads.txt`, `src/App.jsx` | Real AdSense publisher ID |
| `YOUR_USERNAME` | `src/App.jsx` (3 instances), `index.html` (BMC widget) | Real Buy Me a Coffee username |
| `data-ad-slot="XXXX"` | `src/App.jsx` (4 instances) | Real AdSense ad unit slot IDs |

---

## PHASE 1 — PUSH TO GITHUB

### What to do

1. Ask the user for their **GitHub username**. If they don't have a GitHub account, direct them to **github.com** to create one (free).

2. Ask the user to create a new **public** repository on GitHub named `hantavirus-tracker`.

3. Once the repo exists, run the following in the project folder:

```powershell
cd "C:\Users\Eman\Hanta Virus Tracker\Hanta-Virus Tracker"
git init
git add .
git commit -m "Initial commit — Hantavirus Tracker v1.0"
git branch -M main
git remote add origin https://github.com/THEIR_GITHUB_USERNAME/hantavirus-tracker.git
git push -u origin main
```

Replace `THEIR_GITHUB_USERNAME` with their actual GitHub username.

4. Verify: open `https://github.com/THEIR_GITHUB_USERNAME/hantavirus-tracker` in a browser and confirm all files are visible.

### Checkpoint
- [ ] Repository exists on GitHub
- [ ] All project files are visible in the repo
- [ ] Latest commit shows on main branch

---

## PHASE 2 — DEPLOY TO CLOUDFLARE PAGES

### Why Cloudflare Pages
Vercel and Netlify have bandwidth limits on free tiers (100GB/month). Cloudflare Pages has **unlimited bandwidth on the free tier** and is built on Cloudflare's global CDN (300+ edge locations). This site may receive millions of visitors during outbreak spikes — Cloudflare Pages is the correct platform.

### What to do

1. Ask the user to go to **pages.cloudflare.com** and create a free Cloudflare account (or log in if they have one).

2. In Cloudflare Pages:
   - Click **"Create a project"**
   - Click **"Connect to Git"**
   - Connect their GitHub account
   - Select the `hantavirus-tracker` repository

3. Set these build settings **exactly**:

| Setting | Value |
|---|---|
| Framework preset | `Vite` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | *(leave blank)* |
| Node.js version | `18` or higher |

4. Click **"Save and Deploy"**. The build will take approximately 2 minutes.

5. Cloudflare will provide a live URL like: `hantavirus-tracker.pages.dev`

6. Visit that URL and verify the site loads, the globe renders, and all sections are visible.

### Checkpoint
- [ ] Site is live at a `.pages.dev` URL
- [ ] Globe loads and rotates
- [ ] Stat cards show correct numbers
- [ ] Strain distribution section is visible
- [ ] Privacy and About buttons open their modals

---

## PHASE 3 — CUSTOM DOMAIN (Strongly Recommended)

### Why this matters
AdSense **requires** a real domain for approval. Posts on Reddit and social media with a `.pages.dev` URL look unprofessional. A real domain costs $10–15/year and is required before the next phase.

### What to do

1. Ask the user if they already own a domain. If yes, skip to step 3.

2. If not, direct them to **Cloudflare Registrar** (cloudflare.com/products/registrar) — this is the cheapest option as Cloudflare sells domains at wholesale cost with no markup.

   Suggested domain names to check (in order of preference):
   - `hantavirustracker.com`
   - `hantatrack.com`
   - `hantavirusmap.com`
   - `hantavirus-tracker.com`
   - `hantavirustracker.net`

   Purchase whichever is available and fits the budget (~$10–12/year for `.com`).

3. In Cloudflare Pages → their project → **Settings** → **Custom Domains**:
   - Click **"Set up a custom domain"**
   - Enter their domain (e.g. `hantavirustracker.com`)
   - If domain was purchased through Cloudflare Registrar, DNS will auto-configure
   - If domain is from another registrar, follow Cloudflare's instructions to point nameservers

4. SSL (HTTPS / padlock) is **automatic and free** — no action needed.

5. Wait up to 10 minutes for DNS to propagate, then visit `https://theirdomain.com` and verify it loads.

6. Update `index.html` — replace the placeholder in the meta description if needed:
```html
<meta name="description" content="Real-time global Hantavirus case tracker with interactive 3D globe, epidemiological statistics, and outbreak mapping." />
```

### Checkpoint
- [ ] Site is live at `https://theirdomain.com`
- [ ] HTTPS padlock is visible
- [ ] All pages and features work on the custom domain

---

## PHASE 4 — BUY ME A COFFEE

This is the fastest step. Complete this **before** AdSense because it requires no approval process and the donation buttons are already built into the site.

### What to do

#### Step 1 — Create the BMC account
1. Ask the user to go to **buymeacoffee.com** and click **"Start my page"**
2. Sign up with Google or email
3. Choose a username — this becomes their page URL: `buymeacoffee.com/USERNAME`
   - Suggested: `hantavirustracker` or their own name
4. Fill in the creator page:
   - **Name:** Hantavirus Tracker
   - **Bio:** "I build and maintain free public health tools. This site tracks global Hantavirus cases in real time — completely free, no login required. Your support keeps me awake to keep it updated."
   - **Profile photo:** upload any relevant image (can use the H favicon from `public/favicon.svg`)
5. Set coffee price to **$5** (default — leave it)
6. Note their username — you'll need it for the code changes below

#### Step 2 — Update src/App.jsx (3 instances)

Find and replace all three occurrences of `YOUR_USERNAME` in the `DonateButton` component href. There are 3 `DonateButton` instances in the JSX (header, CTA section, footer). Find this pattern:

```jsx
href="https://buymeacoffee.com/YOUR_USERNAME"
```

Replace `YOUR_USERNAME` with their actual BMC username in all 3 places.

#### Step 3 — Add the floating BMC widget to index.html

Add the following script tag to `index.html` just before the closing `</body>` tag:

```html
<script data-name="BMC-Widget" data-cfasync="false"
  src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
  data-id="THEIR_BMC_USERNAME"
  data-description="One coffee keeps me awake to keep this tracker updated"
  data-message="This site is 100% free. If it&#39;s useful to you, a coffee keeps me going ☕"
  data-color="#FF813F"
  data-position="Right"
  data-x_margin="18"
  data-y_margin="18">
</script>
```

Replace `THEIR_BMC_USERNAME` with their actual BMC username.

#### Step 4 — Rebuild and redeploy

```powershell
cd "C:\Users\Eman\Hanta Virus Tracker\Hanta-Virus Tracker"
npm run build
git add .
git commit -m "Add Buy Me a Coffee integration"
git push
```

Cloudflare Pages will auto-detect the push and redeploy automatically (takes ~2 minutes).

### Checkpoint
- [ ] buymeacoffee.com/THEIR_USERNAME page is live
- [ ] All 3 donate buttons on the site link to their BMC page
- [ ] Floating BMC widget appears in bottom-right corner of the site
- [ ] Clicking any donate button opens the correct BMC page in a new tab

---

## PHASE 5 — GOOGLE ADSENSE

### Important: Approval takes time
AdSense approval takes **1–14 days**, sometimes up to 3 weeks. Apply immediately after the site is live on a custom domain. The site cannot serve real ads until approved — the placeholder ad slots will remain visible in the interim (they just show a dashed border, not real ads).

### Requirements AdSense checks for
- Site is live on a real domain with HTTPS ✅ (done in Phase 3)
- Site has original content ✅ (strain breakdowns, case data, about/privacy pages)
- Site has a Privacy Policy ✅ (built-in, accessible from footer)
- Site does not violate AdSense content policies ✅ (public health information is compliant)
- Site owner is 18+ and has a Google account

### Step 1 — Apply

1. Ask the user to go to **google.com/adsense** and sign in with their Google account
2. Click **"Get started"**
3. Enter their website URL (the custom domain from Phase 3)
4. Enter payment details (bank account or check — required to receive payment)
5. Submit — Google will review and email approval (usually within 1–14 days)

### Step 2 — After approval: collect your IDs

Upon approval the user will receive:
- **Publisher ID** — format: `ca-pub-1234567890123456`

They also need to create **4 ad units** inside AdSense:
1. Go to AdSense → **Ads** → **By ad unit** → **Create new ad unit**
2. Create 4 units:
   | Unit name | Type | Size |
   |---|---|---|
   | Leaderboard Top | Display | 728×90 (or Responsive) |
   | In-content | Display | 336×280 (or Responsive) |
   | Sidebar | Display | 300×250 (or Responsive) |
   | Footer Leaderboard | Display | 728×90 (or Responsive) |
3. Each unit will be assigned a **Slot ID** — format: `1234567890`
4. Note all 4 slot IDs

### Step 3 — Update index.html

Find the commented-out AdSense script tag and replace it with the active version:

**Remove:**
```html
<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script> -->
```

**Replace with:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-THEIR_PUBLISHER_ID" crossorigin="anonymous"></script>
```

### Step 4 — Update public/ads.txt

Replace the entire contents of `public/ads.txt` with:
```
google.com, pub-THEIR_PUBLISHER_ID, DIRECT, f08c47fec0942fa0
```

### Step 5 — Replace the AdSlot component in src/App.jsx

Find the current `AdSlot` component (search for `function AdSlot`) and replace the entire component with this production version:

```jsx
function AdSlot({ slotId, format = "auto", style: s = {} }) {
  const ref = useRef(null);
  const pushed = useRef(false);
  useEffect(() => {
    if (!pushed.current && ref.current && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch (e) {
        console.warn("AdSense error:", e);
      }
    }
  }, []);
  return (
    <div aria-label="Advertisement" style={{ textAlign: "center", ...s }}>
      <div style={{ fontSize: 10, color: "#475569", marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>Advertisement</div>
      <ins
        className="adsbygoogle"
        ref={ref}
        style={{ display: "block" }}
        data-ad-client="ca-pub-THEIR_PUBLISHER_ID"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

Replace `THEIR_PUBLISHER_ID` with their actual publisher ID.

### Step 6 — Update the 4 AdSlot usages in the JSX

Find each `<AdSlot ... />` call in the main HantavirusTracker component and update them with real slot IDs. There are 4 instances:

```jsx
{/* Leaderboard top */}
<AdSlot slotId="SLOT_ID_1" />

{/* In-content */}
<AdSlot slotId="SLOT_ID_2" />

{/* Sidebar */}
<AdSlot slotId="SLOT_ID_3" style={{ minHeight: 250, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} />

{/* Footer leaderboard */}
<AdSlot slotId="SLOT_ID_4" />
```

Replace `SLOT_ID_1` through `SLOT_ID_4` with the actual slot IDs from Step 2.

### Step 7 — Rebuild and redeploy

```powershell
cd "C:\Users\Eman\Hanta Virus Tracker\Hanta-Virus Tracker"
npm run build
git add .
git commit -m "Activate Google AdSense — production ad slots"
git push
```

### Step 8 — Verify ads.txt is accessible

Visit `https://theirdomain.com/ads.txt` in a browser. You should see:
```
google.com, pub-THEIR_PUBLISHER_ID, DIRECT, f08c47fec0942fa0
```

If this file is not accessible, AdSense will flag it and ads may not serve. Cloudflare Pages serves files from `public/` at the site root automatically — this should work without any additional configuration.

### Checkpoint
- [ ] AdSense application submitted
- [ ] *(After approval)* Publisher ID added to index.html script tag
- [ ] *(After approval)* ads.txt updated and accessible at domain root
- [ ] *(After approval)* AdSlot component replaced with production version
- [ ] *(After approval)* All 4 slot IDs populated
- [ ] *(After approval)* Site rebuilt and redeployed
- [ ] *(After approval)* Ads are visible on the live site

---

## PHASE 6 — POST-LAUNCH VERIFICATION

Run through this full checklist after all phases are complete:

```
SITE
[ ] Site loads at https://theirdomain.com
[ ] HTTPS padlock is visible
[ ] Globe renders, rotates once every 45 seconds, stops after interaction
[ ] Scroll zoom only activates when cursor is directly on the globe sphere
[ ] Clicking a case marker opens the slide-in sidebar with full detail
[ ] Sidebar shows Where / When / How / Patient sections
[ ] Filter bar (All / Confirmed / Suspected / Fatal) updates the globe
[ ] Charts render (Cases over time, Cases by country)
[ ] Strain distribution section shows all 7 strains with CFR data
[ ] Case table shows 12 most recent cases, clicking a row selects it on globe
[ ] Acronym key bar is visible between stat cards and filter bar
[ ] Privacy modal opens from footer Privacy button
[ ] About modal opens from footer About button
[ ] Double-clicking globe resets zoom to full view

BUY ME A COFFEE
[ ] Header donate button opens buymeacoffee.com/THEIR_USERNAME in new tab
[ ] CTA section donate button works
[ ] Footer donate button works
[ ] Floating BMC widget is visible in bottom-right corner

ADSENSE (after approval only)
[ ] ads.txt accessible at https://theirdomain.com/ads.txt
[ ] Ad units are rendering in all 4 placements
[ ] No console errors related to AdSense
[ ] AdSense dashboard shows impressions within 24 hours of going live
```

---

## EXPECTED REVENUE ESTIMATES

For context on what the user can expect once AdSense is active:

| Monthly traffic | Estimated monthly ad revenue |
|---|---|
| 10,000 visitors | $15–$50 |
| 100,000 visitors | $150–$500 |
| 1,000,000 visitors | $1,500–$5,000+ |
| Viral outbreak week | Can 10× normal rates temporarily |

Health/medical content earns above-average CPM (cost per thousand impressions) because health advertisers pay premium rates. During active outbreak spikes, advertiser demand for health-adjacent placements increases further.

---

## ENVIRONMENT NOTES FOR THE AGENT

- **OS:** Windows 10
- **Shell:** PowerShell (use PowerShell syntax)
- **Project path:** `C:\Users\Eman\Hanta Virus Tracker\Hanta-Virus Tracker\`
- **Node version required:** 18+
- **Build command:** `npm run build`
- **Build output:** `dist/`
- **Deployment platform:** Cloudflare Pages (connected to GitHub — auto-deploys on every `git push`)
- The project already has all dependencies installed (`node_modules/` exists)
- The project already builds successfully — do not modify any React/D3/chart logic unless explicitly instructed

---

*This document covers everything needed to go from local build to a live, monetised, globally distributed website. Complete phases in order. Each phase has a checkpoint — do not proceed to the next phase until all checkboxes are confirmed.*
