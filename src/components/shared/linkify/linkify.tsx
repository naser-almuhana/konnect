import { LinkifyHashtag } from "./components/linkify-hashtag"
import { LinkifyUrl } from "./components/linkify-url"
import { LinkifyUsername } from "./components/linkify-username"

export function Linkify({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  )
}
