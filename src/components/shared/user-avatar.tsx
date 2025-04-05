import userImagePlaceholder from "@/assets/user-image-placeholder.png"
import { UserIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarProps,
} from "@/components/ui/avatar"

interface UserAvatarProps extends AvatarProps {
  src?: string | null
  size?: number
}

export function UserAvatar({ src, size = 16, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage src={src || userImagePlaceholder.src} alt="user image" />
      <AvatarFallback>
        <UserIcon size={size} />
      </AvatarFallback>
    </Avatar>
  )
}
