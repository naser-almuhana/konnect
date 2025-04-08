"use client"

import { useState } from "react"

import { type Media } from "@prisma/client"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { ImageViewer } from "@/components/shared/image-viewer"

import { MediaPreviewItem } from "./media-preview-item"

interface MediaPreviewListProps {
  attachments: Media[]
}

export function MediaPreviewList({ attachments }: MediaPreviewListProps) {
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageClick = (url: string) => {
    setSelectedImage(url)
    setOpen(true)
  }

  const columnsCountBreakPoints: { [key: number]: number } | undefined =
    attachments.length > 1 ? { 350: 1, 500: 2 } : { 350: 1 }

  return (
    <>
      <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
        <Masonry>
          {attachments.map((media) => (
            <MediaPreviewItem
              key={media.id}
              media={media}
              onClick={
                media.type === "IMAGE"
                  ? () => handleImageClick(media.url)
                  : undefined
              }
            />
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {selectedImage && (
        <ImageViewer open={open} onOpenChange={setOpen} src={selectedImage} />
      )}
    </>
  )
}
