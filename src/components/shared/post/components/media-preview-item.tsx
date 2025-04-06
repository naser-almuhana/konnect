import Image from "next/image"

import { type Media } from "@prisma/client"

interface MediaPreviewItemProps {
  media: Media
}

export function MediaPreviewItem({ media }: MediaPreviewItemProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    )
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    )
  }

  return <p className="text-destructive">Unsupported media type</p>
}
