/**
 * Päivittää src/theme/figma-tokens.ts get_variable_defs -tulosten perusteella.
 *
 * Figma palauttaa samat avaimet (bg/default, text/fg, …) eri arvoin light/dark-moodissa.
 * Light = ensimmäinen lähde, dark = toinen lähde; dark-arvot tallennetaan avaimella *_dark.
 *
 * Käyttö:
 *   Light + dark (kaksi tiedostoa):
 *     node scripts/sync-figma-tokens.js scripts/figma-response.json scripts/figma-response-dark.json
 *   Vain light (yksi lähde):
 *     node scripts/sync-figma-tokens.js
 *     (lukee scripts/figma-response.json)
 *   Tai: anna JSON string komentoriviparametrina (vain light).
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const defaultLightPath = path.join(__dirname, "figma-response.json")
const defaultDarkPath = path.join(__dirname, "figma-response-dark.json")

const readInput = (arg, defaultPath) => {
  if (!arg) return fs.existsSync(defaultPath) ? fs.readFileSync(defaultPath, "utf8") : null
  if (fs.existsSync(arg)) return fs.readFileSync(arg, "utf8")
  return arg
}
const rawLight = readInput(process.argv[2], defaultLightPath)
const rawDark = readInput(process.argv[3], defaultDarkPath)

if (!rawLight) {
  console.error("Käyttö: node scripts/sync-figma-tokens.js [light.json] [dark.json]")
  console.error("  Light: scripts/figma-response.json tai 1. parametri")
  console.error("  Dark:  scripts/figma-response-dark.json tai 2. parametri (semanttiset dark-tokenit)")
  process.exit(1)
}

let dataLight
try {
  dataLight = JSON.parse(rawLight)
} catch (e) {
  console.error("Virhe: light-JSON ei validi.")
  process.exit(1)
}

let dataDark = null
if (rawDark) {
  try {
    dataDark = JSON.parse(rawDark)
  } catch (e) {
    console.error("Virhe: dark-JSON ei validi.")
    process.exit(1)
  }
}

const skip = (v) =>
  typeof v !== "string" ||
  v.includes("Effect(") ||
  v.includes("Font(") ||
  v.startsWith("var(--")

/** Semanttiset värit (bg, text, border, paletti): nämä saavat dark-version avaimella *_dark. */
const isSemanticColorKey = (k) =>
  typeof k === "string" && (
    k.startsWith("bg/") ||
    k.startsWith("text/") ||
    k.startsWith("border/") ||
    /^(gray|red|pink|purple|cyan|blue|teal|green|yellow|orange|brand)\/(contrast|fg|subtle|muted|emphasized|solid|focusRing|border)$/.test(k)
  )

const filtered = {}
for (const [k, v] of Object.entries(dataLight)) {
  if (!skip(v)) filtered[k] = v
}

if (dataDark && typeof dataDark === "object") {
  for (const [k, v] of Object.entries(dataDark)) {
    if (!skip(v) && isSemanticColorKey(k)) filtered[`${k}_dark`] = v
  }
}

// Figmasta ei tule lineHeights/letterSpacings – lisätään oletukset ettei typografia hajoa
const DEFAULTS = {
  "lineHeights/xs": "16",
  "lineHeights/sm": "20",
  "lineHeights/md": "24",
  "lineHeights/lg": "28",
  "lineHeights/xl": "30",
  "lineHeights/2xl": "32",
  "lineHeights/3xl": "38",
  "lineHeights/4xl": "44",
  "lineHeights/5xl": "60",
  "lineHeights/6xl": "72",
  "lineHeights/7xl": "92",
  "letterSpacings/tighter": "-0.025em",
  "letterSpacings/tight": "-0.0125em",
};
for (const [k, v] of Object.entries(DEFAULTS)) {
  if (!(k in filtered)) filtered[k] = v;
}

const keys = Object.keys(filtered).sort((a, b) => {
  const ag = a.startsWith("Color/Global") ? "0" : a.startsWith("Size/") ? "1" : a.startsWith("Radii") ? "2" : a.startsWith("font") ? "3" : a.startsWith("lineHeights") ? "4" : a.startsWith("letterSpacings") ? "5" : "6";
  const bg = b.startsWith("Color/Global") ? "0" : b.startsWith("Size/") ? "1" : b.startsWith("Radii") ? "2" : b.startsWith("font") ? "3" : b.startsWith("lineHeights") ? "4" : b.startsWith("letterSpacings") ? "5" : "6";
  if (ag !== bg) return ag.localeCompare(bg);
  return a.localeCompare(b);
});

const lines = [
  "/**",
  " * Figma Variables – raaka data get_variable_defs -kutsusta.",
  " *",
  " * Päivitetty: scripts/sync-figma-tokens.js (aja kun olet hakenut get_variable_defs).",
  " */",
  "export type FigmaVariableDefs = Record<string, string>",
  "",
  "/** Nykyinen snapshot Figma Variables -datan raakamuodossa. */",
  "export const figmaVariableDefs: FigmaVariableDefs = {",
  ...keys.map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(filtered[k])},`),
  "}",
  "",
];

const outPath = path.join(__dirname, "..", "src", "theme", "figma-tokens.ts")
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("Päivitetty:", outPath, "(" + keys.length, "tokenia)");
