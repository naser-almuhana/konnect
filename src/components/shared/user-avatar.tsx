import { UserIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarProps {
  src: string | undefined
  size?: number
}

export function UserAvatar({ src, size = 16, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage src={src} alt={src} />
      <AvatarFallback>
        <UserIcon size={size} />
      </AvatarFallback>
    </Avatar>
  )
}
