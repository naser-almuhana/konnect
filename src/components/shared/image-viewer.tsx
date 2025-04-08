"use client"

import Image from "next/image"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

export function ImageViewer({
  src,
  open,
  onOpenChange,
}: {
  src: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="hidden" />
      <DialogContent className="max-h-[90vh] max-w-[90vw] overflow-hidden p-0">
        {src && (
          <Image
            src={src}
            alt="Preview"
            height={800}
            width={800}
            className="object-cover"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
