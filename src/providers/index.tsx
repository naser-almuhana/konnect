import { Toaster } from "@/components/ui/sonner"

import { ReactQueryProvider } from "./react-query-provider"
import { ThemeProvider } from "./theme-provider"

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
