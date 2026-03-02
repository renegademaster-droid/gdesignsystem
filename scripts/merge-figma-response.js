/**
 * Yhdistää get_variable_defs -tulos (figma-response-new.json) nykyisiin tokeneihin
 * (src/theme/figma-tokens.ts) ja kirjoittaa scripts/figma-response.json.
 * Aja: node scripts/merge-figma-response.js
 */
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const tokenPath = path.join(root, "src", "theme", "figma-tokens.ts")
const newPath = path.join(__dirname, "figma-response-new.json")
const outPath = path.join(__dirname, "figma-response.json")

const content = fs.readFileSync(tokenPath, "utf8")
const existing = {}
const re = /^\s*"([^"]+)":\s*"([^"]*)"\s*,?\s*$/gm
let m
while ((m = re.exec(content)) !== null) {
  existing[m[1]] = m[2]
}
const newData = JSON.parse(fs.readFileSync(newPath, "utf8"))
const merged = { ...existing, ...newData }
fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), "utf8")
console.log(
  "Merged",
  Object.keys(newData).length,
  "from Figma into",
  Object.keys(existing).length,
  "existing ->",
  Object.keys(merged).length,
  "total"
)
