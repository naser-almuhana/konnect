"use client"

import { useRouter } from "next/navigation"

import { useQueryClient } from "@tanstack/react-query"
import { LogOutIcon, UserIcon } from "lucide-react"

import { authClient, useSession } from "@/lib/auth-client"

import { UserAvatar } from "@/components/shared/user-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ThemeMenu } from "./theme-menu"

export function UserButton() {
  const router = useRouter()

  const queryClient = useQueryClient()
  const { data } = useSession()

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.clear()
          router.push("/login")
        },
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar src={data?.user.image || ""} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Logged in as @{data?.user.username}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(`/users/${data?.user.username}`)}
          >
            <UserIcon className="size-4" />
            Profile
          </DropdownMenuItem>

          <ThemeMenu />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
