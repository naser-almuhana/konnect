import Link from "next/link"

import { GithubButton } from "./components/github-button"
import { SearchField } from "./components/search-field"
import { UserButton } from "./components/user-button"

export function Header() {
  return (
    <header className="bg-card sticky top-0 z-10 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-primary text-2xl font-bold">
          konnect
        </Link>
        <SearchField />

        <div className="flex items-center justify-center gap-2 sm:ms-auto">
          <GithubButton />
          <UserButton />
        </div>
      </div>
    </header>
  )
}
