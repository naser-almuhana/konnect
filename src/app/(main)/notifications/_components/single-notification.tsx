import Link from "next/link"
import { JSX } from "react"

import { NotificationType } from "@prisma/client"
import {
  AtSignIcon,
  HeartIcon,
  MessageCircleIcon,
  User2Icon,
} from "lucide-react"

import { NotificationData } from "@/types/db.types"

import { cn } from "@/lib/utils"

import { UserAvatar } from "@/components/shared/user-avatar"
import { Badge } from "@/components/ui/badge"

interface SingleNotificationProps {
  notification: NotificationData
}

export function SingleNotification({ notification }: SingleNotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayUsername} followed you`,
      icon: <User2Icon className="text-primary size-7" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayUsername} commented on your post`,
      icon: <MessageCircleIcon className="fill-primary text-primary size-7" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer.displayUsername} liked your post`,
      icon: <HeartIcon className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.postId}`,
    },
    MENTION: {
      message: `${notification.issuer.displayUsername} mention you in this post`,
      icon: <AtSignIcon className="f size-7 text-green-500" />,
      href: `/posts/${notification.postId}`,
    },
  }

  const { message, icon, href } = notificationTypeMap[notification.type]
  console.log({ notification })
  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "bg-card hover:bg-card/70 flex gap-3 rounded-2xl p-5 shadow-sm transition-colors",
          !notification.read && "bg-primary/10",
        )}
      >
        <div>{icon}</div>
        <div className="space-y-3">
          <UserAvatar src={notification.issuer.image} size={36} />
          <div>
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="text-muted-foreground line-clamp-3 whitespace-pre-line">
              {notification.post.content}
            </div>
          )}
        </div>
        {!notification.read && (
          <Badge className="ml-auto self-start bg-linear-to-bl from-violet-500 to-fuchsia-500 dark:from-violet-200 dark:to-pink-200">
            New
          </Badge>
        )}
      </article>
    </Link>
  )
}
