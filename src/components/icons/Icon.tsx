/**
 * GDS Icon – ikonit generoidusta mapista, Figman väritokeneilla.
 * Väri periytyy CSS currentColor:lla; oletusväri currentColor (periytyy kontekstista).
 */
import type { BoxProps } from "@chakra-ui/react"
import { Box } from "@chakra-ui/react"
import { iconMap, type IconName } from "./icons-map.generated"

export type { IconName } from "./icons-map.generated"
export { iconNames } from "./icons-map.generated"

export interface IconProps extends Omit<BoxProps, "color"> {
  /** Ikonin nimi (tiedostonimi ilman .svg), esim. "star", "user" */
  name: IconName
  /** Figma-semanttinen väri (oletus: currentColor). Voi antaa esim. fg.default, brand.solid. */
  color?: BoxProps["color"]
  /** Koko: spacing/fontSize-token tai px/rem (oletus: 1em). */
  size?: BoxProps["width"]
}

export function Icon({
  name,
  color = "currentColor",
  size = "1em",
  ...rest
}: IconProps) {
  const svg = iconMap[name]
  if (!svg) return null

  return (
    <Box
      as="span"
      display="inline-block"
      width={size}
      height={size}
      color={color}
      flexShrink={0}
      lineHeight="1"
      verticalAlign="middle"
      {...rest}
    >
      <Box
        as="span"
        display="block"
        width="100%"
        height="100%"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </Box>
  )
}
