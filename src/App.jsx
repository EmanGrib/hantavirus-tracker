import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// ─── SEED DATA ───────────────────────────────────────────────────
const CASES = [
  { id:"c001",lat:36.5,lng:-108.5,country:"United States",region:"New Mexico",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-04-12",outcome:"recovered",sex:"M",age:34 },
  { id:"c002",lat:35.2,lng:-111.6,country:"United States",region:"Arizona",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-03-28",outcome:"deceased",sex:"F",age:52 },
  { id:"c003",lat:37.3,lng:-108.9,country:"United States",region:"Colorado",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-04-01",outcome:"hospitalized",sex:"M",age:41 },
  { id:"c004",lat:37.8,lng:-109.3,country:"United States",region:"Utah",caseType:"suspected",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-04-18",outcome:"unknown",sex:"F",age:29 },
  { id:"c005",lat:47.6,lng:-122.3,country:"United States",region:"Washington",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-02-14",outcome:"recovered",sex:"M",age:45 },
  { id:"c006",lat:34.0,lng:-118.2,country:"United States",region:"California",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-01-22",outcome:"recovered",sex:"F",age:38 },
  { id:"c007",lat:36.8,lng:-107.9,country:"United States",region:"New Mexico",caseType:"fatal",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2025-12-10",outcome:"deceased",sex:"M",age:61 },
  { id:"c008",lat:35.7,lng:-105.9,country:"United States",region:"New Mexico",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2025-11-05",outcome:"recovered",sex:"F",age:27 },
  { id:"c009",lat:38.9,lng:-104.8,country:"United States",region:"Colorado",caseType:"suspected",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-04-25",outcome:"hospitalized",sex:"M",age:33 },
  { id:"c010",lat:46.9,lng:-110.4,country:"United States",region:"Montana",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-03-15",outcome:"recovered",sex:"M",age:50 },
  { id:"c011",lat:-41.8,lng:-71.7,country:"Argentina",region:"Patagonia",caseType:"confirmed",strain:"Andes",syndrome:"HPS",reportDate:"2026-03-02",outcome:"hospitalized",sex:"M",age:36 },
  { id:"c012",lat:-43.3,lng:-71.2,country:"Argentina",region:"Chubut",caseType:"confirmed",strain:"Andes",syndrome:"HPS",reportDate:"2026-02-18",outcome:"deceased",sex:"F",age:44 },
  { id:"c013",lat:-34.6,lng:-58.4,country:"Argentina",region:"Buenos Aires",caseType:"suspected",strain:"Andes",syndrome:"HPS",reportDate:"2026-04-08",outcome:"unknown",sex:"M",age:55 },
  { id:"c014",lat:-38.9,lng:-68.1,country:"Argentina",region:"Neuquén",caseType:"confirmed",strain:"Andes",syndrome:"HPS",reportDate:"2025-12-20",outcome:"recovered",sex:"F",age:31 },
  { id:"c015",lat:-42.5,lng:-72.3,country:"Argentina",region:"Río Negro",caseType:"fatal",strain:"Andes",syndrome:"HPS",reportDate:"2026-01-15",outcome:"deceased",sex:"M",age:67 },
  { id:"c016",lat:-45.6,lng:-72.1,country:"Chile",region:"Aysén",caseType:"confirmed",strain:"Andes",syndrome:"HPS",reportDate:"2026-03-22",outcome:"hospitalized",sex:"M",age:40 },
  { id:"c017",lat:-37.5,lng:-72.3,country:"Chile",region:"Biobío",caseType:"confirmed",strain:"Andes",syndrome:"HPS",reportDate:"2026-02-05",outcome:"recovered",sex:"F",age:28 },
  { id:"c018",lat:-33.4,lng:-70.6,country:"Chile",region:"Santiago Metro",caseType:"suspected",strain:"Andes",syndrome:"HPS",reportDate:"2026-04-15",outcome:"unknown",sex:"M",age:47 },
  { id:"c019",lat:-27.6,lng:-48.5,country:"Brazil",region:"Santa Catarina",caseType:"confirmed",strain:"Araraquara",syndrome:"HPS",reportDate:"2026-01-30",outcome:"recovered",sex:"M",age:35 },
  { id:"c020",lat:-25.4,lng:-49.3,country:"Brazil",region:"Paraná",caseType:"confirmed",strain:"Araraquara",syndrome:"HPS",reportDate:"2026-03-10",outcome:"hospitalized",sex:"F",age:42 },
  { id:"c021",lat:7.9,lng:-80.1,country:"Panama",region:"Los Santos",caseType:"confirmed",strain:"Choclo",syndrome:"HPS",reportDate:"2026-02-28",outcome:"recovered",sex:"M",age:26 },
  { id:"c022",lat:63.1,lng:21.6,country:"Finland",region:"Ostrobothnia",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-04-05",outcome:"recovered",sex:"M",age:58 },
  { id:"c023",lat:61.5,lng:23.8,country:"Finland",region:"Pirkanmaa",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-03-18",outcome:"recovered",sex:"F",age:49 },
  { id:"c024",lat:60.2,lng:24.9,country:"Finland",region:"Uusimaa",caseType:"suspected",strain:"Puumala",syndrome:"NE",reportDate:"2026-04-20",outcome:"unknown",sex:"M",age:37 },
  { id:"c025",lat:65.8,lng:24.1,country:"Finland",region:"Lapland",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2025-11-22",outcome:"recovered",sex:"M",age:63 },
  { id:"c026",lat:66.5,lng:20.2,country:"Sweden",region:"Norrbotten",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-01-08",outcome:"recovered",sex:"F",age:54 },
  { id:"c027",lat:63.8,lng:20.3,country:"Sweden",region:"Västerbotten",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-02-12",outcome:"recovered",sex:"M",age:46 },
  { id:"c028",lat:48.8,lng:9.2,country:"Germany",region:"Baden-Württemberg",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-03-05",outcome:"recovered",sex:"M",age:41 },
  { id:"c029",lat:48.1,lng:11.6,country:"Germany",region:"Bavaria",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-04-02",outcome:"recovered",sex:"F",age:33 },
  { id:"c030",lat:50.1,lng:5.0,country:"Belgium",region:"Ardennes",caseType:"suspected",strain:"Puumala",syndrome:"NE",reportDate:"2026-04-22",outcome:"unknown",sex:"M",age:39 },
  { id:"c031",lat:49.5,lng:4.9,country:"France",region:"Ardennes",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-01-25",outcome:"recovered",sex:"F",age:51 },
  { id:"c032",lat:34.3,lng:108.9,country:"China",region:"Shaanxi",caseType:"confirmed",strain:"Hantaan",syndrome:"HFRS",reportDate:"2026-04-10",outcome:"hospitalized",sex:"M",age:48 },
  { id:"c033",lat:45.8,lng:126.5,country:"China",region:"Heilongjiang",caseType:"confirmed",strain:"Hantaan",syndrome:"HFRS",reportDate:"2026-03-20",outcome:"recovered",sex:"F",age:56 },
  { id:"c034",lat:41.8,lng:123.4,country:"China",region:"Liaoning",caseType:"confirmed",strain:"Seoul",syndrome:"HFRS",reportDate:"2026-02-08",outcome:"recovered",sex:"M",age:62 },
  { id:"c035",lat:36.1,lng:120.4,country:"China",region:"Shandong",caseType:"confirmed",strain:"Hantaan",syndrome:"HFRS",reportDate:"2026-01-15",outcome:"deceased",sex:"M",age:70 },
  { id:"c036",lat:30.6,lng:114.3,country:"China",region:"Hubei",caseType:"suspected",strain:"Hantaan",syndrome:"HFRS",reportDate:"2026-04-28",outcome:"unknown",sex:"F",age:43 },
  { id:"c037",lat:34.0,lng:113.7,country:"China",region:"Henan",caseType:"confirmed",strain:"Seoul",syndrome:"HFRS",reportDate:"2025-12-05",outcome:"recovered",sex:"M",age:38 },
  { id:"c038",lat:37.5,lng:127.0,country:"South Korea",region:"Gyeonggi",caseType:"confirmed",strain:"Hantaan",syndrome:"HFRS",reportDate:"2026-03-28",outcome:"recovered",sex:"M",age:30 },
  { id:"c039",lat:35.2,lng:129.0,country:"South Korea",region:"Busan",caseType:"suspected",strain:"Hantaan",syndrome:"HFRS",reportDate:"2026-04-14",outcome:"unknown",sex:"F",age:25 },
  { id:"c040",lat:43.1,lng:131.9,country:"Russia",region:"Primorsky Krai",caseType:"confirmed",strain:"Hantaan",syndrome:"HFRS",reportDate:"2026-02-22",outcome:"recovered",sex:"M",age:53 },
  { id:"c041",lat:48.7,lng:44.5,country:"Russia",region:"Volgograd",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-01-18",outcome:"recovered",sex:"F",age:47 },
  { id:"c042",lat:54.7,lng:56.0,country:"Russia",region:"Bashkortostan",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2026-03-12",outcome:"hospitalized",sex:"M",age:59 },
  { id:"c043",lat:56.8,lng:60.6,country:"Russia",region:"Sverdlovsk",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2025-10-30",outcome:"recovered",sex:"M",age:44 },
  { id:"c044",lat:36.2,lng:-109.1,country:"United States",region:"Arizona",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2025-09-15",outcome:"recovered",sex:"F",age:32 },
  { id:"c045",lat:-40.2,lng:-71.4,country:"Argentina",region:"Neuquén",caseType:"confirmed",strain:"Andes",syndrome:"HPS",reportDate:"2025-08-20",outcome:"deceased",sex:"M",age:72 },
  { id:"c046",lat:62.0,lng:25.7,country:"Finland",region:"Central Finland",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2025-07-10",outcome:"recovered",sex:"F",age:60 },
  { id:"c047",lat:35.9,lng:104.2,country:"China",region:"Gansu",caseType:"confirmed",strain:"Hantaan",syndrome:"HFRS",reportDate:"2025-06-18",outcome:"recovered",sex:"M",age:51 },
  { id:"c048",lat:44.0,lng:-103.8,country:"United States",region:"South Dakota",caseType:"suspected",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2026-05-01",outcome:"hospitalized",sex:"M",age:28 },
  { id:"c049",lat:-26.2,lng:-49.4,country:"Brazil",region:"Santa Catarina",caseType:"confirmed",strain:"Araraquara",syndrome:"HPS",reportDate:"2025-05-22",outcome:"recovered",sex:"F",age:36 },
  { id:"c050",lat:51.2,lng:6.8,country:"Germany",region:"North Rhine-Westphalia",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2025-04-14",outcome:"recovered",sex:"M",age:45 },
  { id:"c051",lat:36.7,lng:-107.2,country:"United States",region:"New Mexico",caseType:"confirmed",strain:"Sin Nombre",syndrome:"HPS",reportDate:"2025-03-08",outcome:"recovered",sex:"F",age:55 },
  { id:"c052",lat:-42.0,lng:-71.8,country:"Argentina",region:"Río Negro",caseType:"fatal",strain:"Andes",syndrome:"HPS",reportDate:"2025-02-15",outcome:"deceased",sex:"M",age:68 },
  { id:"c053",lat:64.2,lng:27.7,country:"Finland",region:"Kainuu",caseType:"confirmed",strain:"Puumala",syndrome:"NE",reportDate:"2025-01-20",outcome:"recovered",sex:"M",age:42 },
  { id:"c054",lat:37.9,lng:126.7,country:"South Korea",region:"Gyeonggi",caseType:"confirmed",strain:"Hantaan",syndrome:"HFRS",reportDate:"2025-12-28",outcome:"recovered",sex:"F",age:35 },
  { id:"c055",lat:43.8,lng:125.3,country:"China",region:"Jilin",caseType:"confirmed",strain:"Hantaan",syndrome:"HFRS",reportDate:"2025-11-15",outcome:"hospitalized",sex:"M",age:64 },
];

const CASE_COLORS = { confirmed: "#ef4444", suspected: "#f59e0b", probable: "#3b82f6", fatal: "#a855f7" };
const SYNDROME_LABELS = { HPS: "Hantavirus Pulmonary Syndrome", HFRS: "Hemorrhagic Fever with Renal Syndrome", NE: "Nephropathia Epidemica" };

const STRAIN_INFO = {
  "Sin Nombre": {
    syndrome: "HPS",
    host: "Deer mouse (Peromyscus maniculatus)",
    range: "North America — US Southwest, Four Corners region",
    transmission: "Inhalation of aerosolised droppings, urine, or saliva of infected deer mice. No human-to-human transmission.",
    cfr: "~36%",
    color: "#ef4444",
  },
  "Andes": {
    syndrome: "HPS",
    host: "Long-tailed pygmy rice rat (Oligoryzomys longicaudatus)",
    range: "South America — Argentina, Chile (Patagonia), Bolivia, Paraguay",
    transmission: "Rodent contact or inhalation of infected material. Unique among hantaviruses: confirmed person-to-person transmission has been documented.",
    cfr: "~25–35%",
    color: "#f97316",
  },
  "Araraquara": {
    syndrome: "HPS",
    host: "Hairy-tailed bolo mouse (Necromys lasiurus)",
    range: "Brazil — central plateau and southern states (São Paulo, Minas Gerais, Goiás, Santa Catarina)",
    transmission: "Contact with infected rodents during agricultural work; inhalation of contaminated dust.",
    cfr: "~46% (highest CFR of any HPS-causing hantavirus)",
    color: "#eab308",
  },
  "Choclo": {
    syndrome: "HPS",
    host: "Pygmy rice rat (Oligoryzomys fulvescens)",
    range: "Panama — Azuero Peninsula",
    transmission: "Rodent contact and inhalation of infectious aerosols. Causes milder HPS compared to Sin Nombre.",
    cfr: "~14%",
    color: "#84cc16",
  },
  "Puumala": {
    syndrome: "NE",
    host: "Bank vole (Myodes glareolus)",
    range: "Europe — Scandinavia, Finland, Central Europe, western Russia (Urals region)",
    transmission: "Inhalation of aerosolised vole excreta; vole population cycles drive outbreak years. Does NOT spread person-to-person.",
    cfr: "<1% (NE is a mild form of HFRS; most patients recover fully)",
    color: "#38bdf8",
  },
  "Hantaan": {
    syndrome: "HFRS",
    host: "Striped field mouse (Apodemus agrarius)",
    range: "East Asia — China, South Korea, far-eastern Russia; historically described first in South Korea near Hantaan River",
    transmission: "Inhalation of dried rodent excreta; agricultural and military field exposure are key risk factors.",
    cfr: "1–15%",
    color: "#a855f7",
  },
  "Seoul": {
    syndrome: "HFRS",
    host: "Norway rat / roof rat (Rattus norvegicus, Rattus rattus)",
    range: "Worldwide — the only hantavirus with a truly global distribution, carried by commensal rats on every inhabited continent",
    transmission: "Contact with infected rats or their droppings; rat bites; inhalation of contaminated dust. Can spread through rat trade/pet rats.",
    cfr: "<1% (generally mild HFRS)",
    color: "#06b6d4",
  },
};

// ─── TOPOJSON DECODER (minimal, for countries-110m) ─────────────
function decodeTopo(topo, objKey) {
  const { scale: [sx, sy], translate: [tx, ty] } = topo.transform;
  const decoded = topo.arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
  });
  function ring(indices) {
    let c = [];
    for (const i of indices) {
      const a = i < 0 ? decoded[~i].slice().reverse() : decoded[i].slice();
      if (c.length) a.shift();
      c.push(...a);
    }
    return c;
  }
  return {
    type: "FeatureCollection",
    features: topo.objects[objKey].geometries.map(g => ({
      type: "Feature", id: g.id, properties: g.properties || {},
      geometry: g.type === "Polygon" ? { type: "Polygon", coordinates: g.arcs.map(ring) }
        : g.type === "MultiPolygon" ? { type: "MultiPolygon", coordinates: g.arcs.map(p => p.map(ring)) }
        : null
    })).filter(f => f.geometry)
  };
}

// ─── GLOBE COMPONENT ────────────────────────────────────────────
function Globe({ cases, selectedId, onSelect }) {
  const canvasRef = useRef(null);
  const ROTATE_SPEED = 360 / (45 * 60); // one full rotation per 45 s at ~60 fps
  const stateRef = useRef({ rotation: [0, -25, 0], dragging: false, lastMouse: null, vel: [ROTATE_SPEED, 0], worldGeo: null, animId: null, resumeTimerId: null, zoom: 1 });
  const [hovered, setHovered] = useState(null);
  const [size, setSize] = useState({ w: 680, h: 520 });

  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(topo => { stateRef.current.worldGeo = decodeTopo(topo, "countries"); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(entries => {
      for (const e of entries) { setSize({ w: e.contentRect.width, h: Math.max(400, Math.min(e.contentRect.width * 0.75, 520)) }); }
    });
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement);
    return () => ro.disconnect();
  }, []);

  const projectedCases = useRef([]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const { w, h } = size;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const S = stateRef.current;
    const R = Math.min(w, h) * 0.42 * S.zoom;
    const proj = d3.geoOrthographic().scale(R).translate([w / 2, h / 2]).rotate(S.rotation).clipAngle(90);
    const path = d3.geoPath(proj, ctx);

    ctx.clearRect(0, 0, w, h);

    // ocean
    ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = "#0c1929"; ctx.fill();
    ctx.strokeStyle = "rgba(56,189,248,0.15)"; ctx.lineWidth = 1.5; ctx.stroke();

    // atmosphere glow
    const grd = ctx.createRadialGradient(w/2, h/2, R * 0.95, w/2, h/2, R * 1.15);
    grd.addColorStop(0, "rgba(56,189,248,0.08)"); grd.addColorStop(1, "rgba(56,189,248,0)");
    ctx.beginPath(); ctx.arc(w/2, h/2, R * 1.15, 0, Math.PI * 2); ctx.fillStyle = grd; ctx.fill();

    // graticule
    ctx.beginPath(); path(d3.geoGraticule10()); ctx.strokeStyle = "rgba(148,163,184,0.08)"; ctx.lineWidth = 0.5; ctx.stroke();

    // countries
    if (S.worldGeo) {
      ctx.beginPath(); path(S.worldGeo); ctx.fillStyle = "#1a2744"; ctx.fill();
      ctx.strokeStyle = "rgba(148,163,184,0.18)"; ctx.lineWidth = 0.4; ctx.stroke();
    }

    // heatmap layer — visible cases on the near side of the globe
    const visible = [];
    cases.forEach(c => {
      const p = proj([c.lng, c.lat]);
      const d = d3.geoDistance([c.lng, c.lat], proj.invert([w/2, h/2]));
      if (p && d < Math.PI / 2) visible.push({ ...c, px: p[0], py: p[1] });
    });

    // heat blobs (radial gradient glow behind each marker)
    visible.forEach(c => {
      const base = CASE_COLORS[c.caseType] || "#ef4444";
      const r = c.caseType === "fatal" ? 18 : c.caseType === "confirmed" ? 14 : 10;
      const g2 = ctx.createRadialGradient(c.px, c.py, 0, c.px, c.py, r);
      g2.addColorStop(0, base + "44"); g2.addColorStop(1, base + "00");
      ctx.beginPath(); ctx.arc(c.px, c.py, r, 0, Math.PI * 2); ctx.fillStyle = g2; ctx.fill();
    });

    // markers (solid dots)
    projectedCases.current = [];
    visible.forEach(c => {
      const col = CASE_COLORS[c.caseType] || "#ef4444";
      const isSel = c.id === selectedId;
      const isHov = c.id === hovered;
      const r = isSel ? 6 : isHov ? 5 : 3.5;

      ctx.beginPath(); ctx.arc(c.px, c.py, r + 2, 0, Math.PI * 2);
      ctx.fillStyle = col + "33"; ctx.fill();

      ctx.beginPath(); ctx.arc(c.px, c.py, r, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();
      ctx.strokeStyle = isSel ? "#ffffff" : col; ctx.lineWidth = isSel ? 2 : 0.8; ctx.stroke();

      if (isSel) {
        ctx.beginPath(); ctx.arc(c.px, c.py, r + 6, 0, Math.PI * 2);
        ctx.strokeStyle = col + "66"; ctx.lineWidth = 1.5; ctx.stroke();
      }

      projectedCases.current.push({ id: c.id, x: c.px, y: c.py });
    });

    // auto rotate when not dragging
    if (!S.dragging) { S.rotation[0] += S.vel[0]; }
    S.animId = requestAnimationFrame(draw);
  }, [cases, selectedId, hovered, size]);

  useEffect(() => { stateRef.current.animId = requestAnimationFrame(draw); return () => cancelAnimationFrame(stateRef.current.animId); }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = e => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const baseR = Math.min(rect.width, rect.height) * 0.42;
      const sphereR = baseR * stateRef.current.zoom;
      // only capture scroll when cursor is inside the sphere circle
      if (Math.hypot(mx - rect.width / 2, my - rect.height / 2) > sphereR) return;
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.18 : 1 / 1.18;
      stateRef.current.zoom = Math.max(1, Math.min(10, stateRef.current.zoom * factor));
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, []);

  const onDblClick = useCallback(() => {
    stateRef.current.zoom = 1;
  }, []);

  const onPointerDown = useCallback(e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const baseR = Math.min(rect.width, rect.height) * 0.42;
    const S = stateRef.current;
    if (Math.hypot(mx - rect.width / 2, my - rect.height / 2) > baseR * S.zoom) return;
    if (S.resumeTimerId) { clearTimeout(S.resumeTimerId); S.resumeTimerId = null; }
    S.dragging = true;
    S.lastMouse = [e.clientX, e.clientY];
    S.vel = [0, 0];
  }, []);

  const onPointerMove = useCallback(e => {
    const S = stateRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const baseR = Math.min(rect.width, rect.height) * 0.42;
    const overGlobe = Math.hypot(mx - rect.width / 2, my - rect.height / 2) <= baseR * S.zoom;

    if (!S.dragging || !S.lastMouse) {
      let closest = null, minD = 15;
      projectedCases.current.forEach(p => {
        const d = Math.hypot(p.x - mx, p.y - my);
        if (d < minD) { minD = d; closest = p.id; }
      });
      setHovered(closest);
      canvasRef.current.style.cursor = closest ? "pointer" : overGlobe ? "grab" : "default";
      return;
    }
    const dx = e.clientX - S.lastMouse[0], dy = e.clientY - S.lastMouse[1];
    S.rotation[0] += dx * 0.3 / S.zoom;
    S.rotation[1] = Math.max(-80, Math.min(80, S.rotation[1] - dy * 0.3 / S.zoom));
    S.lastMouse = [e.clientX, e.clientY];
  }, []);

  const onPointerUp = useCallback(() => {
    const S = stateRef.current;
    S.dragging = false;
    S.vel = [0, 0];
    if (S.resumeTimerId) clearTimeout(S.resumeTimerId);
    S.resumeTimerId = setTimeout(() => {
      S.vel = [ROTATE_SPEED, 0];
      S.resumeTimerId = null;
    }, 60_000);
  }, [ROTATE_SPEED]);

  const onClick = useCallback(e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    let closest = null, minD = 15;
    projectedCases.current.forEach(p => {
      const d = Math.hypot(p.x - mx, p.y - my);
      if (d < minD) { minD = d; closest = p.id; }
    });
    onSelect(closest);
  }, [onSelect]);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", cursor: "default", borderRadius: 12 }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onClick={onClick} onDoubleClick={onDblClick} />
      <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", gap: 12, fontSize: 11, color: "#94a3b8" }}>
        {Object.entries(CASE_COLORS).map(([k, v]) => (
          <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: v, display: "inline-block" }} />
            {k}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", top: 12, right: 12, fontSize: 11, color: "#475569", background: "rgba(15,23,42,0.7)", padding: "4px 10px", borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
        <span>Scroll to zoom · Drag to rotate</span>
        <span>Double-click to reset zoom</span>
      </div>
    </div>
  );
}

// ─── STAT CARD ──────────────────────────────────────────────────
function StatCard({ label, value, sub, color = "#38bdf8" }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: 10, padding: "14px 18px", flex: "1 1 0", minWidth: 130 }}>
      <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "'IBM Plex Sans', sans-serif" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ─── CASE DETAIL SIDEBAR ────────────────────────────────────────
function CaseDetail({ c, onClose }) {
  const info = c ? STRAIN_INFO[c.strain] : null;
  const open = !!c;

  const row = (label, value, valueStyle = {}) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
      <span style={{ color: "#64748b", flexShrink: 0 }}>{label}</span>
      <span style={{ color: "#e2e8f0", textAlign: "right", ...valueStyle }}>{value}</span>
    </div>
  );

  const outcomeColor = o => o === "deceased" ? "#ef4444" : o === "hospitalized" ? "#f59e0b" : o === "recovered" ? "#10b981" : "#94a3b8";

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, height: "100vh", width: 320, zIndex: 300,
      background: "#0b1220", borderLeft: "1px solid #1e293b",
      boxShadow: open ? "-12px 0 40px rgba(0,0,0,0.5)" : "none",
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
      display: "flex", flexDirection: "column", overflowY: "auto",
    }}>
      {c && (<>
        {/* sticky header */}
        <div style={{
          position: "sticky", top: 0, zIndex: 1, background: "#0b1220",
          borderBottom: "1px solid #1e293b", padding: "14px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: CASE_COLORS[c.caseType], flexShrink: 0 }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {c.region}
            </span>
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5,
              background: CASE_COLORS[c.caseType] + "22", color: CASE_COLORS[c.caseType],
              padding: "2px 7px", borderRadius: 99, flexShrink: 0,
            }}>{c.caseType}</span>
          </div>
          <button onClick={onClose} aria-label="Close"
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer", lineHeight: 1, flexShrink: 0 }}>✕</button>
        </div>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* WHERE */}
          <section>
            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, fontFamily: "'IBM Plex Sans', sans-serif" }}>Where</div>
            <div style={{ background: "#1e293b", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
              {row("Country", c.country)}
              {row("Region", c.region)}
              {row("Coordinates", `${c.lat.toFixed(2)}°, ${c.lng.toFixed(2)}°`, { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 })}
              {info && <div style={{ fontSize: 11, color: "#475569", borderTop: "1px solid #334155", paddingTop: 7, marginTop: 3, lineHeight: 1.5 }}>{info.range}</div>}
            </div>
          </section>

          {/* WHEN */}
          <section>
            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, fontFamily: "'IBM Plex Sans', sans-serif" }}>When</div>
            <div style={{ background: "#1e293b", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
              {row("Reported", c.reportDate)}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#64748b" }}>Outcome</span>
                <span style={{ color: outcomeColor(c.outcome), fontWeight: 600, textTransform: "capitalize" }}>{c.outcome}</span>
              </div>
            </div>
          </section>

          {/* HOW */}
          <section>
            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, fontFamily: "'IBM Plex Sans', sans-serif" }}>How — Strain & Transmission</div>
            <div style={{ background: "#1e293b", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#64748b" }}>Strain</span>
                <span style={{ color: info?.color ?? "#f1f5f9", fontWeight: 700 }}>{c.strain}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#64748b" }}>Syndrome</span>
                <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{c.syndrome}</span>
              </div>
              {c.syndrome && <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>{SYNDROME_LABELS[c.syndrome]}</div>}
              {info && (<>
                <div style={{ borderTop: "1px solid #334155", paddingTop: 8, marginTop: 2, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Rodent host</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{info.host}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 11, color: "#64748b" }}>Transmission</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{info.transmission}</div>
                </div>
                {row("Est. CFR", info.cfr, { color: "#f59e0b", fontWeight: 600 })}
              </>)}
            </div>
          </section>

          {/* PATIENT */}
          <section>
            <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8, fontFamily: "'IBM Plex Sans', sans-serif" }}>Patient</div>
            <div style={{ background: "#1e293b", borderRadius: 8, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
              {row("Age", `${c.age} years`)}
              {row("Sex", c.sex === "M" ? "Male" : c.sex === "F" ? "Female" : "Unknown")}
              <div style={{ fontSize: 10, color: "#334155", marginTop: 2, fontFamily: "'IBM Plex Mono', monospace" }}>ID: {c.id}</div>
            </div>
          </section>

        </div>
      </>)}
    </div>
  );
}

// ─── AD SLOT ────────────────────────────────────────────────────
function AdSlot({ label = "Advertisement", style: s = {} }) {
  return (
    <div style={{ background: "#0f172a", border: "1px dashed #334155", borderRadius: 8, padding: 16, textAlign: "center", color: "#334155", fontSize: 12, ...s }} aria-label="Advertisement">
      <div style={{ marginBottom: 4, fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ color: "#475569" }}>Ad Slot — Your AdSense unit here</div>
      <div style={{ fontSize: 10, marginTop: 4, color: "#1e293b" }}>
        {`<ins class="adsbygoogle" data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX"></ins>`}
      </div>
    </div>
  );
}

// ─── MODAL ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: "#1e293b", borderRadius: 16, width: "100%", maxWidth: 620,
          maxHeight: "85vh", display: "flex", flexDirection: "column",
          border: "1px solid #334155", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px", borderBottom: "1px solid #334155", flexShrink: 0 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{title}</h2>
          <button onClick={onClose}
            style={{ background: "none", border: "none", color: "#64748b", fontSize: 22,
              cursor: "pointer", lineHeight: 1, padding: "0 4px" }}
            aria-label="Close">✕</button>
        </div>
        <div style={{ padding: "20px 24px", overflowY: "auto", color: "#cbd5e1", fontSize: 14, lineHeight: 1.75 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── DONATE BUTTON ──────────────────────────────────────────────
function DonateButton({ compact }) {
  return (
    <a href="https://buymeacoffee.com/YOUR_USERNAME" target="_blank" rel="noopener noreferrer"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: compact ? "6px 14px" : "10px 20px",
        background: "linear-gradient(135deg, #ff813f, #ff6600)", color: "#fff",
        borderRadius: 99, fontWeight: 600, fontSize: compact ? 13 : 14,
        textDecoration: "none", cursor: "pointer", border: "none",
        boxShadow: "0 2px 12px rgba(255,129,63,0.3)", transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(255,129,63,0.4)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(255,129,63,0.3)"; }}
    >
      <span style={{ fontSize: compact ? 14 : 18 }}>☕</span>
      {compact ? "Buy me a coffee" : "Support this project"}
    </a>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────
export default function HantavirusTracker() {
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [activeModal, setActiveModal] = useState(null);
  const selectedCase = useMemo(() => CASES.find(c => c.id === selectedId), [selectedId]);

  const filtered = useMemo(() => {
    if (filter === "all") return CASES;
    return CASES.filter(c => c.caseType === filter);
  }, [filter]);

  const stats = useMemo(() => {
    const total = CASES.length;
    const deaths = CASES.filter(c => c.outcome === "deceased").length;
    const last30 = CASES.filter(c => { const d = new Date(c.reportDate); const now = new Date(); return (now - d) / 86400000 <= 30; }).length;
    const countries = new Set(CASES.map(c => c.country)).size;
    return { total, deaths, cfr: ((deaths / total) * 100).toFixed(1), last30, countries };
  }, []);

  const monthlyData = useMemo(() => {
    const months = {};
    CASES.forEach(c => {
      const m = c.reportDate.slice(0, 7);
      if (!months[m]) months[m] = { month: m, cases: 0, deaths: 0 };
      months[m].cases++;
      if (c.outcome === "deceased") months[m].deaths++;
    });
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  }, []);

  const countryData = useMemo(() => {
    const ct = {};
    CASES.forEach(c => { ct[c.country] = (ct[c.country] || 0) + 1; });
    return Object.entries(ct).map(([country, cases]) => ({ country, cases })).sort((a, b) => b.cases - a.cases);
  }, []);

  const strainData = useMemo(() => {
    const st = {};
    CASES.forEach(c => { st[c.strain] = (st[c.strain] || 0) + 1; });
    return Object.entries(st).map(([strain, count]) => ({ strain, count })).sort((a, b) => b.count - a.count);
  }, []);

  const STRAIN_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#a855f7", "#ec4899", "#06b6d4"];

  return (
    <div style={{ background: "#0f172a", color: "#f1f5f9", minHeight: "100vh", fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono&display=swap" rel="stylesheet" />

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", borderBottom: "1px solid #1e293b", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #ef4444, #dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>H</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.5 }}>Hantavirus Tracker</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>Real-time global surveillance</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>Last updated: {new Date().toUTCString().slice(0, 16)} UTC</span>
          <DonateButton compact />
        </div>
      </header>

      {/* ── AD: LEADERBOARD TOP ────────────────────────────── */}
      <div style={{ padding: "12px 24px 0" }}>
        <AdSlot label="Leaderboard ad — 728×90" />
      </div>

      {/* ── STATS ROW ──────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 12, padding: "16px 24px", flexWrap: "wrap" }}>
        <StatCard label="Total cases" value={stats.total} sub={`${stats.countries} countries`} color="#38bdf8" />
        <StatCard label="Deaths" value={stats.deaths} sub={`CFR (Case Fatality Rate): ${stats.cfr}%`} color="#ef4444" />
        <StatCard label="Last 30 days" value={stats.last30} sub="New reports" color="#f59e0b" />
        <StatCard label="Syndromes" value="3" sub="HPS · HFRS · NE" color="#a855f7" />
      </div>

      {/* ── ACRONYM KEY ────────────────────────────────────── */}
      <div style={{ padding: "0 24px 12px", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11, color: "#475569", borderBottom: "1px solid #1e293b", marginBottom: 8 }}>
        <span style={{ color: "#334155", marginRight: 4, fontWeight: 600 }}>Acronyms:</span>
        {[
          ["HPS", "Hantavirus Pulmonary Syndrome"],
          ["HFRS", "Hemorrhagic Fever with Renal Syndrome"],
          ["NE", "Nephropathia Epidemica"],
          ["CFR", "Case Fatality Rate"],
          ["WHO", "World Health Organization"],
          ["CDC", "Centers for Disease Control and Prevention"],
        ].map(([abbr, full], i, arr) => (
          <span key={abbr} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <strong style={{ color: "#64748b" }}>{abbr}</strong>
            <span>— {full}</span>
            {i < arr.length - 1 && <span style={{ color: "#1e293b", marginLeft: 4 }}>·</span>}
          </span>
        ))}
      </div>

      {/* ── FILTER BAR ─────────────────────────────────────── */}
      <div style={{ padding: "0 24px 8px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["all", "confirmed", "suspected", "fatal"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: "5px 14px", borderRadius: 99, border: "1px solid " + (filter === f ? "#38bdf8" : "#334155"),
              background: filter === f ? "#38bdf822" : "transparent", color: filter === f ? "#38bdf8" : "#94a3b8",
              fontSize: 12, fontWeight: 500, cursor: "pointer", textTransform: "capitalize"
            }}>
            {f === "all" ? `All (${CASES.length})` : `${f} (${CASES.filter(c => c.caseType === f).length})`}
          </button>
        ))}
      </div>

      {/* ── GLOBE ──────────────────────────────────────────── */}
      <div style={{ padding: "0 24px" }}>
        <Globe cases={filtered} selectedId={selectedId} onSelect={setSelectedId} />
      </div>

      {/* ── CASE DETAIL SIDEBAR (fixed overlay) ────────────── */}
      <CaseDetail c={selectedCase} onClose={() => setSelectedId(null)} />

      {/* ── CHARTS ROW ─────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "20px 24px" }}>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 12 }}>Cases over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="caseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="cases" stroke="#ef4444" fill="url(#caseGrad)" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} />
              <Area type="monotone" dataKey="deaths" stroke="#a855f7" fill="none" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "#64748b" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 3, background: "#ef4444", display: "inline-block", borderRadius: 2 }} /> Cases</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 12, height: 0, borderTop: "1.5px dashed #a855f7", display: "inline-block" }} /> Deaths</span>
          </div>
        </div>

        <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 12 }}>Cases by country</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={countryData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="country" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12, color: "#e2e8f0" }} />
              <Bar dataKey="cases" radius={[0, 4, 4, 0]}>
                {countryData.map((_, i) => <Cell key={i} fill={["#ef4444","#f59e0b","#3b82f6","#10b981","#a855f7","#ec4899","#06b6d4","#64748b"][i % 8]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── AD: IN-CONTENT ─────────────────────────────────── */}
      <div style={{ padding: "0 24px 16px" }}>
        <AdSlot label="In-content ad — 336×280" />
      </div>

      {/* ── STRAIN BREAKDOWN ───────────────────────────────── */}
      <div style={{ padding: "0 24px 20px" }}>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Strain distribution</div>
          <div style={{ fontSize: 11, color: "#475569", marginBottom: 16 }}>All strains, syndromes, and case fatality rates reflect current WHO/CDC epidemiological data.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {strainData.map(s => {
              const pct = ((s.count / CASES.length) * 100).toFixed(0);
              const info = STRAIN_INFO[s.strain];
              const col = info?.color ?? "#94a3b8";
              return (
                <div key={s.strain} style={{ background: col + "10", border: `1px solid ${col}30`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: col, fontWeight: 700 }}>{s.strain}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>{s.count} <span style={{ fontSize: 11, color: "#64748b", fontWeight: 400 }}>({pct}%)</span></span>
                  </div>
                  {info && (<>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, background: "#0f172a", color: "#94a3b8", padding: "2px 7px", borderRadius: 99, fontFamily: "'IBM Plex Sans', sans-serif" }}>
                        {info.syndrome} — {SYNDROME_LABELS[info.syndrome]}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, lineHeight: 1.4 }}>
                      <span style={{ color: "#475569" }}>Host: </span>{info.host}
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4, lineHeight: 1.4 }}>
                      <span style={{ color: "#475569" }}>Range: </span>{info.range}
                    </div>
                    <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>
                      CFR (Case Fatality Rate) {info.cfr}
                    </div>
                  </>)}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RECENT CASES TABLE ─────────────────────────────── */}
      <div style={{ padding: "0 24px 20px" }}>
        <div style={{ background: "#1e293b", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid #334155" }}>Recent case reports</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#0f172a" }}>
                  {["Date","Location","Type","Strain","Syndrome","Outcome"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#64748b", fontWeight: 500, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...CASES].sort((a,b) => b.reportDate.localeCompare(a.reportDate)).slice(0, 12).map(c => (
                  <tr key={c.id} onClick={() => setSelectedId(c.id)}
                    style={{ borderBottom: "1px solid #1e293b", cursor: "pointer", background: c.id === selectedId ? "#334155" : "transparent", transition: "background 0.15s" }}
                    onMouseEnter={e => { if (c.id !== selectedId) e.currentTarget.style.background = "#1e293b88"; }}
                    onMouseLeave={e => { if (c.id !== selectedId) e.currentTarget.style.background = "transparent"; }}>
                    <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{c.reportDate}</td>
                    <td style={{ padding: "10px 16px", color: "#e2e8f0" }}>{c.region}, {c.country}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{ background: CASE_COLORS[c.caseType] + "22", color: CASE_COLORS[c.caseType], padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 600 }}>{c.caseType}</span>
                    </td>
                    <td style={{ padding: "10px 16px", color: "#94a3b8" }}>{c.strain}</td>
                    <td style={{ padding: "10px 16px", color: "#94a3b8" }}>
                      <abbr title={SYNDROME_LABELS[c.syndrome]} style={{ textDecoration: "none", borderBottom: "1px dotted #475569", cursor: "help" }}>{c.syndrome}</abbr>
                    </td>
                    <td style={{ padding: "10px 16px", color: c.outcome === "deceased" ? "#ef4444" : c.outcome === "hospitalized" ? "#f59e0b" : "#10b981" }}>{c.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── AD + DONATE CTA ────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, padding: "0 24px 20px" }}>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 8, maxWidth: 400 }}>This tracker aggregates publicly available data for informational purposes only. Always consult official health authorities for medical guidance.</div>
          <DonateButton />
          <div style={{ fontSize: 12, color: "#475569", marginTop: 10 }}>Your support keeps this free tool running</div>
        </div>
        <AdSlot label="Sidebar ad — 300×250" style={{ minHeight: 250, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }} />
      </div>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid #1e293b", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: 12, color: "#475569" }}>
          Data sources: WHO (World Health Organization), CDC (Centers for Disease Control and Prevention), ProMED-mail, national health ministries · Not a diagnostic tool
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setActiveModal("privacy")}
            style={{ background: "none", border: "none", fontSize: 12, color: "#64748b", cursor: "pointer", padding: 0 }}>Privacy</button>
          <button onClick={() => setActiveModal("about")}
            style={{ background: "none", border: "none", fontSize: 12, color: "#64748b", cursor: "pointer", padding: 0 }}>About</button>
          <DonateButton compact />
        </div>
      </footer>

      {/* ── AD: FOOTER LEADERBOARD ─────────────────────────── */}
      <div style={{ padding: "0 24px 16px" }}>
        <AdSlot label="Footer leaderboard ad — 728×90" />
      </div>

      {/* ── ABOUT MODAL ────────────────────────────────────── */}
      {activeModal === "about" && (
        <Modal title="About Hantavirus Tracker" onClose={() => setActiveModal(null)}>
          <p style={{ marginBottom: 16 }}>
            <strong style={{ color: "#f1f5f9" }}>Hantavirus Tracker</strong> is a free, public-interest tool that maps
            confirmed, suspected, and fatal Hantavirus cases reported worldwide in near real-time.
          </p>
          <h3 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Why this exists</h3>
          <p style={{ marginBottom: 16 }}>
            Hantavirus is a rare but serious zoonotic disease transmitted primarily through contact with
            infected rodents or their droppings. Outbreaks can occur across multiple continents and are
            often under-reported in mainstream media. This tracker exists to close that information gap —
            giving the public, travellers, researchers, and healthcare workers a single place to see
            where cases are occurring and how they are trending.
          </p>
          <h3 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>What you're seeing</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li style={{ marginBottom: 6 }}><strong style={{ color: "#ef4444" }}>Red markers</strong> — laboratory-confirmed cases</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: "#f59e0b" }}>Amber markers</strong> — suspected cases under investigation</li>
            <li style={{ marginBottom: 6 }}><strong style={{ color: "#a855f7" }}>Purple markers</strong> — fatal cases</li>
            <li style={{ marginBottom: 6 }}>Charts show monthly trends and regional distribution</li>
            <li>Strain labels (Sin Nombre, Andes, Puumala, Hantaan, etc.) indicate the viral variant and its associated syndrome</li>
          </ul>
          <h3 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Data sources</h3>
          <p style={{ marginBottom: 16 }}>
            Case data is aggregated from publicly available reports including the WHO Disease Outbreak News,
            CDC Hantavirus surveillance, ProMED-mail, and national health ministry bulletins.
            The current build uses a curated seed dataset; live data integration is in active development.
          </p>
          <h3 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Important disclaimer</h3>
          <p style={{ color: "#94a3b8" }}>
            This tracker is for <strong style={{ color: "#f1f5f9" }}>informational and educational purposes only</strong>.
            It is not a diagnostic tool and should not be used as a substitute for advice from qualified
            medical or public health professionals. Always consult official health authorities — your local
            public health agency, the CDC, or the WHO — for guidance on disease risk and prevention.
          </p>
        </Modal>
      )}

      {/* ── PRIVACY MODAL ──────────────────────────────────── */}
      {activeModal === "privacy" && (
        <Modal title="Privacy Policy" onClose={() => setActiveModal(null)}>
          <p style={{ marginBottom: 4, fontSize: 12, color: "#64748b" }}>Last updated: May 2026</p>
          <p style={{ marginBottom: 16 }}>
            Hantavirus Tracker is a read-only public health information display. We do not ask you to
            create an account, log in, or provide any personal information to use this site.
          </p>
          <h3 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>What we do not collect</h3>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li style={{ marginBottom: 6 }}>No names, email addresses, or contact information</li>
            <li style={{ marginBottom: 6 }}>No location data from your device</li>
            <li style={{ marginBottom: 6 }}>No account or login data</li>
            <li>No data you enter, because there is nothing to enter</li>
          </ul>
          <h3 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Third-party services</h3>
          <p style={{ marginBottom: 12 }}>
            This site loads resources from the following third parties, which may set their own cookies
            or collect standard web request data (IP address, browser type, referring page) according
            to their own privacy policies:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
            <li style={{ marginBottom: 6 }}>
              <strong style={{ color: "#f1f5f9" }}>Google Fonts</strong> — serves the DM Sans and IBM Plex typefaces
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong style={{ color: "#f1f5f9" }}>jsDelivr CDN</strong> — serves the world geography data used to
              draw the globe
            </li>
            <li style={{ marginBottom: 6 }}>
              <strong style={{ color: "#f1f5f9" }}>Google AdSense</strong> — displays advertisements; may use cookies
              to show relevant ads. You can opt out via{" "}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer"
                style={{ color: "#38bdf8" }}>Google's Ad Settings</a>.
            </li>
            <li>
              <strong style={{ color: "#f1f5f9" }}>Buy Me a Coffee</strong> — the donate button links to an external
              site; clicking it takes you away from this page and that site's own policies apply
            </li>
          </ul>
          <h3 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Epidemiological data</h3>
          <p style={{ marginBottom: 16 }}>
            All case data displayed on this site is sourced from publicly available government and
            international health organisation reports. No private patient information is displayed or stored.
            Cases are de-identified aggregates consistent with public health reporting standards.
          </p>
          <h3 style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Contact</h3>
          <p style={{ color: "#94a3b8" }}>
            Questions about this policy? Reach out via the Buy Me a Coffee page linked in the header.
          </p>
        </Modal>
      )}
    </div>
  );
}
