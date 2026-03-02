import { ChakraProvider } from "@chakra-ui/react"
import { system } from "@/theme"
import { ColorModeProvider } from "./color-mode"
import { Toaster } from "./toaster"

interface ProviderProps {
  children: React.ReactNode
}

export function Provider(props: ProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider attribute="class" disableTransitionOnChange>
        {props.children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  )
}
