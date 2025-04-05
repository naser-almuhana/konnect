import { LinkIt } from "react-linkify-it"

import { LINKIFY_USERNAME_REGEX } from "@/constants"

import { UserLinkWithTooltip } from "@/components/shared/user-link-with-tooltip"

export function LinkifyUsername({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <LinkIt
      regex={LINKIFY_USERNAME_REGEX}
      component={(match, key) => (
        <UserLinkWithTooltip key={key} username={match.slice(1)}>
          {match}
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  )
}
