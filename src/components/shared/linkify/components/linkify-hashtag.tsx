import Link from "next/link"

import { LinkIt } from "react-linkify-it"

import { LINKIFY_HASHTAG_REGEX } from "@/constants"

export function LinkifyHashtag({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LinkIt
      regex={LINKIFY_HASHTAG_REGEX}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  )
}
