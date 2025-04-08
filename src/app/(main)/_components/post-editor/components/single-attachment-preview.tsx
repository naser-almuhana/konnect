"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import { type Attachment } from "@/hooks/use-media-upload"

import { Button } from "@/components/ui/button"

interface SingleAttachmentPreviewProps {
  attachment: Attachment
  onRemoveClick: () => void
}

export function SingleAttachmentPreview({
  attachment: { file, isUploading },
  onRemoveClick,
}: SingleAttachmentPreviewProps) {
  const [src, setSrc] = useState<string>("")

  useEffect(() => {
    let objectUrl = ""
    const timer = setTimeout(() => {
      objectUrl = URL.createObjectURL(file)
      setSrc(objectUrl)
    }, 100) // Small delay to avoid UI jank

    return () => {
      clearTimeout(timer)
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [file])

  if (!src) return null // Or a loading state

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={0} // Let the image determine width
          height={0} // Let the image determine height
          sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizing
          className="h-auto w-full max-w-full rounded-2xl object-contain"
          style={{
            maxHeight: "30rem",
            aspectRatio: "auto", // Preserve original ratio
          }}
          unoptimized={file.size > 4 * 1024 * 1024} // Only optimize images <4MB
          priority
          onLoad={() => URL.revokeObjectURL(src)}
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] w-auto rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading && (
        <Button
          onClick={onRemoveClick}
          type="button"
          size="icon"
          className="bg-foreground text-background hover:bg-foreground/60 absolute top-3 right-3 rounded-full p-1 transition-colors md:p-1.5"
        >
          <XIcon className="size-4 md:size-5" />
        </Button>
      )}
    </div>
  )
}
