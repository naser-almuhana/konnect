import { unstable_cache } from "next/cache"
import Link from "next/link"

import { db } from "@/lib/db"
import { formatNumber } from "@/lib/utils"

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await db.$queryRaw<{ hashtag: string; count: bigint }[]>`
        SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
        FROM posts
        GROUP BY (hashtag)
        ORDER BY count DESC, hashtag ASC
        LIMIT 5
          `

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }))
  },
  ["trending_topics"],
  {
    revalidate: false,
    tags: ["trending_topics"],
  },
)

export async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics()

  if (!trendingTopics.length) return null

  return (
    <div className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1]

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 font-semibold break-all hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-muted-foreground text-sm">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
