"use client"

import { authClient } from "@/lib/auth-client"

import { GithubSvg } from "@/components/shared/github-svg"
import { Button } from "@/components/ui/button"

export function GithubLoginButton() {
  return (
    <Button
      className="w-full"
      onClick={async () => {
        await authClient.signIn.social({
          provider: "github",
          errorCallbackURL: "/error",
        })
      }}
    >
      <GithubSvg className="fill-secondary" />
      Sign in with Github
    </Button>
  )
}
