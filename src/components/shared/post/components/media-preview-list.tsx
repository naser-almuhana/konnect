import { type Media } from "@prisma/client"

import { cn } from "@/lib/utils"

import { MediaPreviewItem } from "./media-preview-item"

interface MediaPreviewListProps {
  attachments: Media[]
}

export function MediaPreviewList({ attachments }: MediaPreviewListProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((media) => (
        <MediaPreviewItem key={media.id} media={media} />
      ))}
    </div>
  )
}
