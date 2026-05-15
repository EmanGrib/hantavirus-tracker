#!/usr/bin/env node
/**
 * fetch-cases.js
 * Fetches hantavirus case reports from ProMED Mail and WHO DON RSS feeds,
 * geocodes new locations via Nominatim, deduplicates, and appends to public/cases.json
 *
 * Run: node scripts/fetch-cases.js
 * Requires Node 18+ (built-in fetch)
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { parseStringPromise } from "xml2js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CASES_PATH = join(__dirname, "../public/cases.json");

// ─── RSS SOURCES ─────────────────────────────────────────────────────────────
const FEEDS = [
  {
    name: "ProMED Mail",
    url: "https://promedmail.org/feed/",
    source: "ProMED",
  },
  {
    name: "WHO Disease Outbreak News",
    url: "https://www.who.int/rss-feeds/news-releases-en.xml",
    source: "WHO",
  },
  {
    name: "CDC Hantavirus",
    url: "https://tools.cdc.gov/api/v2/resources/media/404952.rss",
    source: "CDC",
  },
];

// Keywords that indicate a hantavirus-related report
const HANTA_KEYWORDS = [
  "hantavirus", "hantaviral", "hantaan", "sin nombre", "andes virus",
  "puumala", "seoul virus", "hps", "hantavirus pulmonary syndrome",
  "hemorrhagic fever with renal syndrome", "hfrs", "nephropathia epidemica",
  "araraquara", "choclo virus", "bayou virus", "black creek canal",
];

// ─── STRAIN DETECTION ────────────────────────────────────────────────────────
function detectStrain(text) {
  const t = text.toLowerCase();
  if (t.includes("sin nombre")) return "Sin Nombre";
  if (t.includes("andes")) return "Andes";
  if (t.includes("puumala")) return "Puumala";
  if (t.includes("hantaan")) return "Hantaan";
  if (t.includes("seoul")) return "Seoul";
  if (t.includes("araraquara")) return "Araraquara";
  if (t.includes("choclo")) return "Choclo";
  if (t.includes("bayou")) return "Bayou";
  if (t.includes("black creek")) return "Black Creek Canal";
  // Infer from geography if strain not named
  return null;
}

function detectSyndrome(strain) {
  const hpsStrains = ["Sin Nombre", "Andes", "Choclo", "Bayou", "Black Creek Canal", "Araraquara"];
  const hfrsStrains = ["Hantaan", "Seoul"];
  const neStrains = ["Puumala"];
  if (hpsStrains.includes(strain)) return "HPS";
  if (hfrsStrains.includes(strain)) return "HFRS";
  if (neStrains.includes(strain)) return "NE";
  return "HPS"; // default
}

function detectCaseType(text) {
  const t = text.toLowerCase();
  if (t.includes("fatal") || t.includes("died") || t.includes("death")) return "fatal";
  if (t.includes("confirmed") || t.includes("laboratory-confirmed")) return "confirmed";
  if (t.includes("suspected") || t.includes("probable")) return "suspected";
  return "suspected";
}

function detectOutcome(text) {
  const t = text.toLowerCase();
  if (t.includes("died") || t.includes("fatal") || t.includes("death") || t.includes("deceased")) return "deceased";
  if (t.includes("hospital") || t.includes("admitted") || t.includes("icu")) return "hospitalized";
  if (t.includes("recover") || t.includes("discharg")) return "recovered";
  return "unknown";
}

// ─── LOCATION EXTRACTION ─────────────────────────────────────────────────────
// Extract the most likely location string from title+description
function extractLocation(title, description) {
  const text = title + " " + description;

  // Common country patterns in outbreak reports
  const countryPatterns = [
    "United States", "USA", "Argentina", "Chile", "Brazil", "Panama",
    "Finland", "Sweden", "Germany", "France", "Belgium", "Russia",
    "China", "South Korea", "Kazakhstan", "Bolivia", "Uruguay",
    "Paraguay", "Venezuela", "Ecuador", "Peru", "Colombia",
  ];

  for (const country of countryPatterns) {
    if (text.includes(country)) {
      // Try to extract a more specific region
      const regionMatch = text.match(
        new RegExp(`([A-Z][a-záéíóúüñ\\s]+(?:Province|State|Region|Oblast|Prefecture|Department|County|District)),?\\s*(?:in\\s+)?${country}`, "i")
      );
      if (regionMatch) {
        return { query: `${regionMatch[1]}, ${country}`, country, region: regionMatch[1].trim() };
      }
      return { query: country, country, region: null };
    }
  }

  // Fall back: look for any capitalized location-like phrases
  const fallback = text.match(/\bin ([A-Z][a-z]+(?: [A-Z][a-z]+)*)/);
  if (fallback) return { query: fallback[1], country: fallback[1], region: null };

  return null;
}

// ─── NOMINATIM GEOCODING ─────────────────────────────────────────────────────
const geocodeCache = new Map();

async function geocode(query) {
  if (geocodeCache.has(query)) return geocodeCache.get(query);

  // Nominatim rate limit: 1 req/sec
  await new Promise(r => setTimeout(r, 1100));

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "HantavirusTracker/1.0 (emangrib@gmail.com)" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    geocodeCache.set(query, result);
    return result;
  } catch {
    return null;
  }
}

// ─── RSS FETCH + PARSE ───────────────────────────────────────────────────────
async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: {
        "User-Agent": "HantavirusTracker/1.0 (emangrib@gmail.com)",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.warn(`[${feed.name}] HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const parsed = await parseStringPromise(xml, { explicitArray: false });

    const channel = parsed?.rss?.channel || parsed?.feed;
    if (!channel) return [];

    const items = channel.item || channel.entry || [];
    const itemArray = Array.isArray(items) ? items : [items];

    return itemArray.map(item => ({
      title: item.title?._ || item.title || "",
      description: item.description?._ || item.description || item.summary?._ || item.summary || "",
      link: item.link?.$ ? item.link.$["href"] : (item.link || ""),
      pubDate: item.pubDate || item.updated || item.published || new Date().toISOString(),
      source: feed.source,
    }));
  } catch (err) {
    console.warn(`[${feed.name}] fetch error:`, err.message);
    return [];
  }
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  // Load existing cases
  let existing = [];
  try {
    existing = JSON.parse(readFileSync(CASES_PATH, "utf8"));
  } catch {
    console.log("No existing cases.json found, starting fresh");
  }

  const existingUrls = new Set(existing.map(c => c.sourceUrl).filter(Boolean));
  const existingIds = new Set(existing.map(c => c.id));

  // Generate new sequential ID
  let maxId = existing.reduce((max, c) => {
    const n = parseInt(c.id.replace("c", ""), 10);
    return isNaN(n) ? max : Math.max(max, n);
  }, 0);

  function nextId() {
    maxId++;
    return `c${String(maxId).padStart(3, "0")}`;
  }

  // Fetch all feeds
  console.log("Fetching RSS feeds...");
  const allItems = (await Promise.all(FEEDS.map(fetchFeed))).flat();
  console.log(`Found ${allItems.length} total feed items`);

  // Filter for hantavirus-related items
  const hantaItems = allItems.filter(item => {
    const text = (item.title + " " + item.description).toLowerCase();
    return HANTA_KEYWORDS.some(kw => text.includes(kw));
  });
  console.log(`Found ${hantaItems.length} hantavirus-related items`);

  // Deduplicate by URL
  const newItems = hantaItems.filter(item => item.link && !existingUrls.has(item.link));
  console.log(`${newItems.length} new items after deduplication`);

  if (newItems.length === 0) {
    console.log("No new cases to add.");
    return;
  }

  // Process each new item
  const newCases = [];
  for (const item of newItems) {
    const text = item.title + " " + item.description;

    const strain = detectStrain(text) || "Sin Nombre";
    const syndrome = detectSyndrome(strain);
    const caseType = detectCaseType(text);
    const outcome = detectOutcome(text);

    const locationInfo = extractLocation(item.title, item.description);
    if (!locationInfo) {
      console.log(`  Skipping (no location): ${item.title.slice(0, 60)}`);
      continue;
    }

    const coords = await geocode(locationInfo.query);
    if (!coords) {
      console.log(`  Skipping (no coords for "${locationInfo.query}"): ${item.title.slice(0, 60)}`);
      continue;
    }

    // Parse report date
    let reportDate;
    try {
      reportDate = new Date(item.pubDate).toISOString().slice(0, 10);
    } catch {
      reportDate = new Date().toISOString().slice(0, 10);
    }

    const newCase = {
      id: nextId(),
      lat: parseFloat(coords.lat.toFixed(4)),
      lng: parseFloat(coords.lng.toFixed(4)),
      country: locationInfo.country,
      region: locationInfo.region || locationInfo.country,
      caseType,
      strain,
      syndrome,
      reportDate,
      outcome,
      sex: null,
      age: null,
      sourceUrl: item.link,
      sourceTitle: item.title.slice(0, 120),
      source: item.source,
      fetchedAt: new Date().toISOString(),
    };

    newCases.push(newCase);
    console.log(`  + Added case ${newCase.id}: ${newCase.strain} in ${newCase.region}, ${newCase.country} (${newCase.reportDate})`);
  }

  if (newCases.length === 0) {
    console.log("No geocodeable cases found.");
    return;
  }

  // Append and save
  const updated = [...existing, ...newCases];
  writeFileSync(CASES_PATH, JSON.stringify(updated, null, 2));
  console.log(`\nDone. Added ${newCases.length} new case(s). Total: ${updated.length}`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
