import { UserIcon } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  src: string | undefined
}

export function UserAvatar({ src }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={src} alt={src} />
      <AvatarFallback>
        <UserIcon size={16} />
      </AvatarFallback>
    </Avatar>
  )
}
