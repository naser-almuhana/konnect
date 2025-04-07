import type { Metadata } from "next"

import type { SearchParams } from "@/types"

import { TrendsSidebar } from "@/components/shared/trends-sidebar"

import { SearchResults } from "./_components/search-results"

export async function generateMetadata({
  searchParams,
}: SearchParams): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: `Search results for "${q}"`,
  }
}

export default async function SearchPage({ searchParams }: SearchParams) {
  const { q } = await searchParams
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h1 className="line-clamp-2 text-center text-2xl font-bold break-all">
            Search results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSidebar />
    </main>
  )
}
