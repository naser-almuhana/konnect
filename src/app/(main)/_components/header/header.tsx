import Link from "next/link"

import { SearchField } from "@/components/shared/search-field"

import { UserButton } from "./components/user-button"

export function Header() {
  return (
    <header className="bg-card sticky top-0 z-10 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-primary text-2xl font-bold">
          konnect
        </Link>
        <SearchField />
        <UserButton />
      </div>
    </header>
  )
}
