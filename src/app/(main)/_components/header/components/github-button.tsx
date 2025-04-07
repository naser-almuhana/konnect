import Link from "next/link"

import { GITHUB_REPO_URL } from "@/constants"

import { GithubSvg } from "@/components/shared/github-svg"
import { Button } from "@/components/ui/button"

export function GithubButton() {
  return (
    <Link href={GITHUB_REPO_URL} target="_blank">
      <Button variant="ghost" size="icon" className="rounded-full">
        <GithubSvg />
        <span className="sr-only">Github link</span>
      </Button>
    </Link>
  )
}
