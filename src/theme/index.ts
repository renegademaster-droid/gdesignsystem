import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineTextStyles,
  defineTokens,
} from "@chakra-ui/react"
import { figmaVariableDefs } from "./figma-tokens"
import { mapFigmaToChakraTokens } from "./map-figma-to-chakra"

const figmaMapped = mapFigmaToChakraTokens(figmaVariableDefs)

/** Figman typografian mukaiset textStyles (fontSize + lineHeight + letterSpacing). */
const figmaTextStyles = defineTextStyles({
  xs: { value: { fontSize: "xs", lineHeight: "lineHeights.xs" } },
  sm: { value: { fontSize: "sm", lineHeight: "lineHeights.sm" } },
  md: { value: { fontSize: "md", lineHeight: "lineHeights.md" } },
  lg: { value: { fontSize: "lg", lineHeight: "lineHeights.lg" } },
  xl: { value: { fontSize: "xl", lineHeight: "lineHeights.xl" } },
  "2xl": { value: { fontSize: "2xl", lineHeight: "lineHeights.2xl" } },
  "3xl": { value: { fontSize: "3xl", lineHeight: "lineHeights.3xl" } },
  "4xl": {
    value: {
      fontSize: "4xl",
      lineHeight: "lineHeights.4xl",
      letterSpacing: "tighter",
    },
  },
  "5xl": {
    value: {
      fontSize: "5xl",
      lineHeight: "lineHeights.5xl",
      letterSpacing: "tighter",
    },
  },
  "6xl": {
    value: {
      fontSize: "6xl",
      lineHeight: "lineHeights.6xl",
      letterSpacing: "tighter",
    },
  },
  "7xl": {
    value: {
      fontSize: "7xl",
      lineHeight: "lineHeights.7xl",
      letterSpacing: "tighter",
    },
  },
  label: {
    value: {
      fontSize: "sm",
      lineHeight: "lineHeights.sm",
      fontWeight: "medium",
    },
  },
})

/**
 * Figmasta haetut tokenit (värit, typografia, spacing, radii).
 * Brand tulee Figmasta (brand/50…950); semantiikka johdetaan automaattisesti jos puuttuu.
 * Päivittyy kun figma-tokens.ts synkataan get_variable_defs -tulokseen.
 *
 * globalCss.html.colorPalette = "brand" → kaikki komponentit (Button, Progress, Spinner jne.)
 * käyttävät oletuksena brand-väriä, paitsi jos colorPalette on erikseen asetettu.
 */
const figmaThemeConfig = defineConfig({
  globalCss: {
    html: {
      colorPalette: "brand",
    },
  },
  theme: {
    tokens: {
      colors: figmaMapped.colors as Parameters<typeof defineTokens.colors>[0],
      spacing: figmaMapped.spacing,
      fontSizes: figmaMapped.fontSizes,
      lineHeights: figmaMapped.lineHeights,
      letterSpacings: figmaMapped.letterSpacings,
      fontWeights: figmaMapped.fontWeights,
      fonts: figmaMapped.fonts,
      radii: figmaMapped.radii,
    },
    semanticTokens: {
      colors: figmaMapped.semanticColors,
    },
    textStyles: figmaTextStyles,
  },
})

/**
 * Design system -teema.
 * GDS-teema: defaultConfig + Figma-tokenit (värit, typografia, spacing, radii, brand).
 */
export const system = createSystem(defaultConfig, figmaThemeConfig)
