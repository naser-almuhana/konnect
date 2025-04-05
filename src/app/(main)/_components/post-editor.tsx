"use client"

import "@/assets/styles/editor.css"
import Placeholder from "@tiptap/extension-placeholder"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { useCreatePostMutation } from "@/hooks/use-create-post.mutation"

import { LoadingButton } from "@/components/shared/Loading-button"
import { UserAvatar } from "@/components/shared/user-avatar"

export function PostEditor() {
  const { data } = useSession()
  const mutation = useCreatePostMutation()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: "Write something..." }),
    ],
  })

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || ""

  async function onSubmit() {
    mutation.mutate(
      { content: input },
      {
        onSuccess: () => {
          editor?.commands.clearContent()
        },
      },
    )
  }

  return (
    <div className="bg-card flex flex-col gap-5 rounded-2xl p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar src={data?.user.image} />
        <EditorContent
          editor={editor}
          className={cn(
            "bg-muted max-h-[20rem] w-full overflow-y-auto rounded-2xl px-5 py-3",
          )}
        />
      </div>
      <div className="flex items-center justify-end gap-3">
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          //   disabled={!input.trim() || isUploading}
          disabled={!input.trim()}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  )
}
