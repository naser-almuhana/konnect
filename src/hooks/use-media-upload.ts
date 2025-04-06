"use client"

import { useState } from "react"

import { toast } from "sonner"

import { useUploadThing } from "@/lib/uploadthing"
import { slugify } from "@/lib/utils"

export interface Attachment {
  file: File
  mediaId?: string
  isUploading: boolean
}

export function useMediaUpload() {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploadProgress, setUploadProgress] = useState<number>()

  const { startUpload, isUploading } = useUploadThing("attachment", {
    onBeforeUploadBegin(files) {
      // Before upload begins, rename the files for consistency and uniqueness
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop() ?? "dat" // fallback extension
        const baseName = file.name.replace(/\.[^/.]+$/, "") // remove extension
        const safeName = slugify(baseName) // make name URL-safe
        const newFileName = `attachment-${safeName}-${crypto.randomUUID()}.${extension}`

        return new File([file], newFileName, { type: file.type })
      })

      // Mark each file as uploading and add to attachments state
      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ])

      return renamedFiles
    },
    // Track upload progress (percentage)
    onUploadProgress: setUploadProgress,
    // When upload completes successfully
    onClientUploadComplete: (res) => {
      if (!res?.length) return

      // Match uploaded files and update attachments with their mediaId
      setAttachments((prev) =>
        prev.map((attachment) => {
          const found = res.find((r) => r.name === attachment.file.name)

          if (found) {
            return {
              ...attachment,
              mediaId: found.serverData.mediaId ?? undefined,
              isUploading: false,
            }
          }

          return attachment
        }),
      )
    },
    // Handle errors during upload
    onUploadError(error) {
      console.error("Upload failed:", error)

      // Remove any attachments still marked as uploading
      setAttachments((prev) => prev.filter((a) => !a.isUploading))
      setUploadProgress(undefined)

      toast.error(error.message)
    },
  })

  // Initiates upload after validating file count and current upload state
  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.error("Please wait for the current upload to finish.")
      return
    }

    if (attachments.length + files.length > 5) {
      toast.error("You can only upload up to 5 attachments per post.")
      return
    }

    startUpload(files)
  }

  // Removes a specific file from attachments by name
  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName))
  }

  // Clears all attachments and resets progress
  function reset() {
    setAttachments([])
    setUploadProgress(undefined)
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  }
}
