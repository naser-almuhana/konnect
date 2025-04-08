import { type Media } from "@prisma/client"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { MediaPreviewItem } from "./media-preview-item"

interface MediaPreviewListProps {
  attachments: Media[]
}

export function MediaPreviewList({ attachments }: MediaPreviewListProps) {
  const columnsCountBreakPoints: { [key: number]: number } | undefined =
    attachments.length > 1 ? { 350: 1, 500: 2 } : { 350: 1 }

  return (
    <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
      <Masonry>
        {attachments.map((media) => (
          <MediaPreviewItem key={media.id} media={media} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
