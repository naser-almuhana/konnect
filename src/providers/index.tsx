import { Toaster } from "@/components/ui/sonner"

import { ReactQueryProvider } from "./react-query-provider"
import { ThemeProvider } from "./theme-provider"
import { UploadthingPlugin } from "./uploadthing-plugin"

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ReactQueryProvider>
      <ThemeProvider>
        <UploadthingPlugin />
        {children}
        <Toaster />
      </ThemeProvider>
    </ReactQueryProvider>
  )
}
