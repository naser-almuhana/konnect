"use client"

import { useRef } from "react"

import { ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void
  disabled: boolean
}

export function AddAttachmentsButton({
  onFilesSelected,
  disabled,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary hover:text-primary cursor-pointer"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          if (files.length) {
            onFilesSelected(files)
            e.target.value = ""
          }
        }}
      />
    </>
  )
}
