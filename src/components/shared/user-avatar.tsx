import { UserIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarProps {
  src: string | undefined
}

export function UserAvatar({ src, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage src={src} alt={src} />
      <AvatarFallback>
        <UserIcon size={16} />
      </AvatarFallback>
    </Avatar>
  )
}
