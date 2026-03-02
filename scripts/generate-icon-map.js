/**
 * Generoi src/components/icons/icons-map.generated.ts.
 * Lukee src/assets/*.svg, normalisoi (currentColor, 100% koko) ja exporttaa iconMap + iconNames.
 * Aja: npm run generate:icons (tai ennen build:lib).
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
const assetsDir = path.join(root, "src", "assets")
const outPath = path.join(root, "src", "components", "icons", "icons-map.generated.ts")

function normalizeSvg(content) {
  return content
    .replace(/\sstroke="black"/g, ' stroke="currentColor"')
    .replace(/\sfill="black"/g, ' fill="currentColor"')
    .replace(/\s(width|height)="[^"]*"/g, ' $1="100%"')
}

const files = fs.readdirSync(assetsDir).filter((f) => f.endsWith(".svg"))
const iconMap = {}
for (const file of files) {
  const name = file.replace(/\.svg$/, "")
  const content = fs.readFileSync(path.join(assetsDir, file), "utf8")
  iconMap[name] = normalizeSvg(content)
}

const names = Object.keys(iconMap).sort()

function escapeForTemplateLiteral(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${")
}

const entries = names.map(
  (name) => `  "${name}": \`${escapeForTemplateLiteral(iconMap[name])}\``
)
const iconNamesExport = names.map((n) => `  "${n}"`).join(",\n")

const out = `/**
 * Generoitu – älä muokkaa. Päivitä: npm run generate:icons
 */
export const iconMap: Record<string, string> = {\n${entries.join(",\n")},\n}

export const iconNames = [\n${iconNamesExport},\n] as const

export type IconName = (typeof iconNames)[number]
`

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, out, "utf8")
console.log("Wrote", outPath, "(" + names.length + " icons)")