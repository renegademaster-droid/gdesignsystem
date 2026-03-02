import type { FigmaVariableDefs } from "./figma-tokens"

/** Chakra raw token: { value: string } */
const v = (value: string) => ({ value })

/** px → rem (Chakra käyttää rem). */
function pxToRem(px: number): string {
  return `${px / 16}rem`
}

/** Hae arvo Figmasta; jos numerollinen string, muunna rem. */
function toRemIfNumber(raw: string): string {
  const n = Number(raw)
  if (!Number.isNaN(n) && n >= 0) return pxToRem(n)
  return raw
}

const COLOR_PALETTES = [
  "gray",
  "red",
  "pink",
  "purple",
  "cyan",
  "blue",
  "teal",
  "green",
  "yellow",
  "orange",
  "brand",
] as const

const SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const

/** Figma: Color/Global Tokens/brand – ryhmä, alla 50, 100, … 950 (polku brand/50 tai brand50). */
const BRAND_GLOBAL_PREFIXES = [
  "Color/Global Tokens/brand/",  // brand/50, brand/100, …
  "Color/Global Tokens/brand",   // brand50, brand100, … (yhdellä sanalla)
] as const

/** Raw väripaletit: gray/50 … orange/950; white erikseen. Brand: Color/Global Tokens/brand/50 jne. */
function mapFigmaRawColors(
  defs: FigmaVariableDefs
): Record<string, Record<string, { value: string }> | { value: string }> {
  const colors: Record<string, Record<string, { value: string }> | { value: string }> = {}
  for (const pal of COLOR_PALETTES) {
    const palette: Record<string, { value: string }> = {}
    for (const shade of SHADES) {
      const key = `${pal}/${shade}` as const
      const val = defs[key]
      if (val && /^#[0-9A-Fa-f]+$/.test(val)) palette[shade] = v(val)
    }
    if (Object.keys(palette).length > 0) colors[pal] = palette
  }
  // Figma: Color/Global Tokens/brand → brand/50 tai brand50
  const brandFromGlobal: Record<string, { value: string }> = {}
  for (const shade of SHADES) {
    const val =
      defs[`${BRAND_GLOBAL_PREFIXES[0]}${shade}`] ??  // brand/50
      defs[`${BRAND_GLOBAL_PREFIXES[1]}${shade}`]     // brand50
    if (val && /^#[0-9A-Fa-f]+$/.test(val)) brandFromGlobal[shade] = v(val)
  }
  if (Object.keys(brandFromGlobal).length > 0) colors.brand = brandFromGlobal
  if (defs.white) colors.white = v(defs.white)
  return colors
}

/** Hakee Figman dark-arvon: avain_dark tai polku/dark (esim. bg/default_dark, bg/default/dark). */
function getDarkValue(defs: FigmaVariableDefs, lightKey: string): string | undefined {
  const withSuffix = `${lightKey}_dark` as keyof FigmaVariableDefs
  const withPath = `${lightKey}/dark` as keyof FigmaVariableDefs
  const val = defs[withSuffix] ?? defs[withPath]
  if (val && (val.startsWith("#") || val === "white" || val === "black")) return val
  return undefined
}

/** Semanttiset värit: bg/*, text/*, border/*, gray/fg, blue/solid jne. Lukee Figman dark-tokenit (_dark-suffiksillä tai /dark-polulla). */
function mapFigmaSemanticColors(
  defs: FigmaVariableDefs
): Record<string, Record<string, { value: { _light: string; _dark?: string } }>> {
  const semantic: Record<string, Record<string, { value: { _light: string; _dark?: string } }>> = {}

  const setLightDark = (
    out: Record<string, { value: { _light: string; _dark?: string } }>,
    lightKey: string,
    val: string,
    chakraKey: string
  ) => {
    const darkVal = getDarkValue(defs, lightKey)
    out[chakraKey] = { value: darkVal ? { _light: val, _dark: darkVal } : { _light: val } }
  }

  const bgKeys = ["default", "subtle", "muted", "emphasized", "inverted", "panel", "error", "warning", "success", "info"] as const
  const bg: Record<string, { value: { _light: string; _dark?: string } }> = {}
  for (const k of bgKeys) {
    const lightKey = `bg/${k}`
    const val = defs[lightKey as keyof FigmaVariableDefs]
    if (val && val.startsWith("#")) setLightDark(bg, lightKey, val, k === "default" ? "DEFAULT" : k)
  }
  if (Object.keys(bg).length > 0) semantic.bg = bg

  const fgKeys = ["fg", "fg_muted", "fg_subtle", "fg_inverted", "fg_error", "fg_warning", "fg_success", "fg_info"] as const
  const fg: Record<string, { value: { _light: string; _dark?: string } }> = {}
  for (const k of fgKeys) {
    const lightKey = `text/${k}`
    const val = defs[lightKey as keyof FigmaVariableDefs]
    if (val && val.startsWith("#")) setLightDark(fg, lightKey, val, k === "fg" ? "DEFAULT" : k.replace("fg_", ""))
  }
  if (Object.keys(fg).length > 0) semantic.fg = fg

  const borderKeys = ["default", "subtle", "muted", "emphasized", "inverted", "error", "warning", "success", "info"] as const
  const border: Record<string, { value: { _light: string; _dark?: string } }> = {}
  for (const k of borderKeys) {
    const lightKey = `border/${k}`
    const val = defs[lightKey as keyof FigmaVariableDefs]
    if (val && val.startsWith("#")) setLightDark(border, lightKey, val, k === "default" ? "DEFAULT" : k)
  }
  if (Object.keys(border).length > 0) semantic.border = border

  const paletteSemanticKeys = ["contrast", "fg", "subtle", "muted", "emphasized", "solid", "focusRing", "border"] as const
  for (const pal of COLOR_PALETTES) {
    const rec: Record<string, { value: { _light: string; _dark?: string } }> = {}
    for (const sk of paletteSemanticKeys) {
      const lightKey = `${pal}/${sk}`
      const val = defs[lightKey as keyof FigmaVariableDefs]
      if (val && (val.startsWith("#") || val === "white" || val === "black")) {
        const darkVal = getDarkValue(defs, lightKey)
        rec[sk] = { value: darkVal ? { _light: val, _dark: darkVal } : { _light: val } }
      }
    }
    if (Object.keys(rec).length > 0) semantic[pal] = rec
  }

  return semantic
}

/**
 * Jos Figmassa on brand-raaka paletti (brand/50…950) mutta ei semanttisia (brand/solid jne.),
 * johdetaan semantiikka automaattisesti (sama logiikka kuin blue).
 */
function ensureBrandSemantic(
  rawColors: ReturnType<typeof mapFigmaRawColors>,
  semantic: ReturnType<typeof mapFigmaSemanticColors>
): void {
  const hasBrandRaw = rawColors.brand && typeof rawColors.brand === "object" && "600" in rawColors.brand
  const hasBrandSemantic = semantic.brand && Object.keys(semantic.brand).length > 0
  if (!hasBrandRaw || hasBrandSemantic) return

  semantic.brand = {
    contrast: { value: { _light: "white", _dark: "white" } },
    fg: { value: { _light: "{colors.brand.700}", _dark: "{colors.brand.300}" } },
    subtle: { value: { _light: "{colors.brand.100}", _dark: "{colors.brand.900}" } },
    muted: { value: { _light: "{colors.brand.200}", _dark: "{colors.brand.800}" } },
    emphasized: { value: { _light: "{colors.brand.300}", _dark: "{colors.brand.700}" } },
    solid: { value: { _light: "{colors.brand.600}", _dark: "{colors.brand.600}" } },
    focusRing: { value: { _light: "{colors.brand.500}", _dark: "{colors.brand.500}" } },
    border: { value: { _light: "{colors.brand.500}", _dark: "{colors.brand.400}" } },
  }
}

type SemanticColors = ReturnType<typeof mapFigmaSemanticColors>
type RawColors = ReturnType<typeof mapFigmaRawColors>

/**
 * Täydentää bg, fg, border -semantiikan _dark-arvot gray-/status-paletilla kun Figma ei tarjoa dark-arvovia.
 * Jos Figmasta tulee myöhemmin dark-tokenit (esim. bg/default_dark, text/fg_dark), mapFigmaSemanticColors
 * voi lukea ne ja tämä jää fallbackiksi vain puuttuville _dark-arvoille.
 */
function ensureDarkSemantic(semantic: SemanticColors, rawColors: RawColors): void {
  const gray = rawColors.gray as Record<string, { value: string }> | undefined
  if (!gray || typeof gray !== "object") return

  const ref = (palette: string, shade: string) => `{colors.${palette}.${shade}}`

  if (semantic.bg) {
    const darkBg: Record<string, string> = {
      DEFAULT: ref("gray", "950"),
      subtle: ref("gray", "900"),
      muted: ref("gray", "800"),
      emphasized: ref("gray", "700"),
      inverted: ref("gray", "50"),
      panel: ref("gray", "900"),
      error: ref("red", "950"),
      warning: ref("orange", "950"),
      success: ref("green", "950"),
      info: ref("blue", "950"),
    }
    for (const [k, v] of Object.entries(semantic.bg)) {
      const key = k === "DEFAULT" ? "DEFAULT" : k
      if (v.value && !("_dark" in v.value) && darkBg[key])
        (v.value as { _light: string; _dark?: string })._dark = darkBg[key]
    }
  }

  if (semantic.fg) {
    const darkFg: Record<string, string> = {
      DEFAULT: ref("gray", "50"),
      muted: ref("gray", "400"),
      subtle: ref("gray", "500"),
      inverted: ref("gray", "950"),
      error: ref("red", "400"),
      warning: ref("orange", "400"),
      success: ref("green", "400"),
      info: ref("blue", "400"),
    }
    for (const [k, v] of Object.entries(semantic.fg)) {
      if (v.value && !("_dark" in v.value) && darkFg[k])
        (v.value as { _light: string; _dark?: string })._dark = darkFg[k]
    }
  }

  if (semantic.border) {
    const darkBorder: Record<string, string> = {
      DEFAULT: ref("gray", "700"),
      subtle: ref("gray", "800"),
      muted: ref("gray", "700"),
      emphasized: ref("gray", "600"),
      inverted: ref("gray", "400"),
      error: ref("red", "500"),
      warning: ref("orange", "500"),
      success: ref("green", "500"),
      info: ref("blue", "500"),
    }
    for (const [k, v] of Object.entries(semantic.border)) {
      const key = k === "DEFAULT" ? "DEFAULT" : k
      if (v.value && !("_dark" in v.value) && darkBorder[key])
        (v.value as { _light: string; _dark?: string })._dark = darkBorder[key]
    }
  }
}

/** Täydentää palettien (gray, red, blue, …) semantiikan _dark-arvot saman paletin tummilla shadeilla. */
function ensurePaletteDarkSemantic(semantic: SemanticColors, rawColors: RawColors): void {
  const darkShades: Record<string, string> = {
    contrast: "contrast", // pysyy (white/black)
    fg: "300",
    subtle: "800",
    muted: "700",
    emphasized: "600",
    solid: "500",
    focusRing: "500",
    border: "600",
  }
  for (const pal of COLOR_PALETTES) {
    const palSem = semantic[pal]
    const palRaw = rawColors[pal]
    if (!palSem || !palRaw || typeof palRaw !== "object") continue
    for (const [sk, entry] of Object.entries(palSem)) {
      if (!entry.value || "_dark" in entry.value) continue
      const shade = darkShades[sk]
      if (shade === "contrast") (entry.value as { _dark?: string })._dark = pal === "yellow" ? "black" : "white"
      else if (shade && (palRaw as Record<string, { value: string }>)[shade])
        (entry.value as { _dark?: string })._dark = `{colors.${pal}.${shade}}`
    }
  }
}

/** Spacing: Size/1 … Size/24 → spacing.1 … spacing.24 (rem) */
function mapFigmaSpacing(defs: FigmaVariableDefs): Record<string, { value: string }> {
  const spacing: Record<string, { value: string }> = {}
  const sizeKeys = ["0_5", "1", "1_5", "2", "2_5", "3", "3_5", "4", "4_5", "5", "6", "7", "8", "9", "10", "11", "12", "14", "16", "20", "24"]
  for (const k of sizeKeys) {
    const val = defs[`Size/${k}` as keyof FigmaVariableDefs]
    if (val != null) spacing[k.replace("_", ".")] = v(toRemIfNumber(val))
  }
  return spacing
}

/** fontSizes: xs … 7xl, arvot px → rem */
function mapFigmaFontSizes(defs: FigmaVariableDefs): Record<string, { value: string }> {
  const keys = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"]
  const out: Record<string, { value: string }> = {}
  for (const k of keys) {
    const val = defs[`fontSizes/${k}` as keyof FigmaVariableDefs]
    if (val != null) out[k] = v(toRemIfNumber(val))
  }
  return out
}

/** lineHeights: xs … 7xl, px → rem (Chakra textStyles käyttää rem) */
function mapFigmaLineHeights(defs: FigmaVariableDefs): Record<string, { value: string }> {
  const keys = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"]
  const out: Record<string, { value: string }> = {}
  for (const k of keys) {
    const val = defs[`lineHeights/${k}` as keyof FigmaVariableDefs]
    if (val != null) out[k] = v(toRemIfNumber(val))
  }
  return out
}

/** letterSpacings (em) */
function mapFigmaLetterSpacings(defs: FigmaVariableDefs): Record<string, { value: string }> {
  const out: Record<string, { value: string }> = {}
  const tighter = defs["letterSpacings/tighter"]
  const tight = defs["letterSpacings/tight"]
  if (tighter != null) out.tighter = v(tighter)
  if (tight != null) out.tight = v(tight)
  return out
}

/** fontWeights */
function mapFigmaFontWeights(defs: FigmaVariableDefs): Record<string, { value: string }> {
  const out: Record<string, { value: string }> = {}
  const normal = defs["fontWeights/normal"]
  const medium = defs["fontWeights/medium"]
  if (normal != null) out.normal = v(normal)
  if (medium != null) out.medium = v(medium)
  return out
}

/** fonts: body = Inter (+ fallback Chakra-tyyliin) */
function mapFigmaFonts(defs: FigmaVariableDefs): Record<string, { value: string }> {
  const fallback = `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`
  const body = defs["fonts/body"]
  const out: Record<string, { value: string }> = {}
  if (body != null) out.body = v(`${body}, ${fallback}`)
  out.heading = out.body ?? v(`Inter, ${fallback}`)
  return out
}

/** radii: Radii/sm … Radii/full (rem) */
function mapFigmaRadii(defs: FigmaVariableDefs): Record<string, { value: string }> {
  const keys = ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "full"]
  const out: Record<string, { value: string }> = {}
  for (const k of keys) {
    const val = defs[`Radii/${k}` as keyof FigmaVariableDefs]
    if (val != null) out[k] = v(toRemIfNumber(val))
  }
  return out
}

/** Yhdistetty Chakra-teeman tokens-osio Figma-defseistä (vain kategoriat joita käytämme). */
export function mapFigmaToChakraTokens(defs: FigmaVariableDefs) {
  const rawColors = mapFigmaRawColors(defs)
  const semanticColors = mapFigmaSemanticColors(defs)
  ensureBrandSemantic(rawColors, semanticColors)
  ensureDarkSemantic(semanticColors, rawColors)
  ensurePaletteDarkSemantic(semanticColors, rawColors)
  return {
    colors: rawColors,
    semanticColors,
    spacing: mapFigmaSpacing(defs),
    fontSizes: mapFigmaFontSizes(defs),
    lineHeights: mapFigmaLineHeights(defs),
    letterSpacings: mapFigmaLetterSpacings(defs),
    fontWeights: mapFigmaFontWeights(defs),
    fonts: mapFigmaFonts(defs),
    radii: mapFigmaRadii(defs),
  }
}
