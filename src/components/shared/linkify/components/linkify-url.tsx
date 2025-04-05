import { LinkItUrl } from "react-linkify-it"

export function LinkifyUrl({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  )
}
