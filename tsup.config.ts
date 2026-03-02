import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@chakra-ui/react",
    "@emotion/react",
    "next-themes",
    "react-icons",
    "react-icons/lu",
  ],
  esbuildOptions(options) {
    options.conditions = options.conditions || []
  },
  tsconfig: "tsconfig.lib.json",
})
