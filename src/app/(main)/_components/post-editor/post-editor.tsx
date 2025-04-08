"use client"

import { ClipboardEvent } from "react"

import "@/assets/styles/editor.css"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useDropzone } from "@uploadthing/react"
import { Loader2Icon } from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { useCreatePostMutation } from "@/hooks/use-create-post.mutation"
import { useMediaUpload } from "@/hooks/use-media-upload"

import { LoadingButton } from "@/components/shared/Loading-button"
import { UserAvatar } from "@/components/shared/user-avatar"

import { AddAttachmentsButton } from "./components/add-attachments-button"
import { AttachmentsPreview } from "./components/attachments-preview"

export function PostEditor() {
  const { data } = useSession()
  const mutation = useCreatePostMutation()

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClick, ...rootProps } = getRootProps()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bold: {},
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Write something or drop media or paste url...",
      }),
    ],
  })

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || ""

  async function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent()
          resetMediaUploads()
        },
      },
    )
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[]

    if (files.length === 0) return

    startUpload(files)
  }

  return (
    <div className="bg-card flex flex-col gap-5 rounded-2xl p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar src={data?.user.image} />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              "bg-muted max-h-80 min-h-20 w-full overflow-y-auto rounded-2xl px-5 py-3",
              isDragActive && "outline-dashed",
            )}
            onPaste={onPaste}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentsPreview
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2Icon className="text-primary size-5 animate-spin" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  )
}
