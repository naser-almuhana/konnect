"use client"

import Image from "next/image"

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
  const src = URL.createObjectURL(file)

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
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
