import { useState } from "react"

import { Loader2Icon, SendHorizonalIcon } from "lucide-react"

import type { PostData } from "@/types/db.types"

import { useCreateCommentMutation } from "@/hooks/use-create-comment.mutation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CommentInputProps {
  post: PostData
}

export function CommentInput({ post }: CommentInputProps) {
  const [input, setInput] = useState("")

  const mutation = useCreateCommentMutation(post.id)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!input) return

    mutation.mutate(
      {
        post,
        content: input,
      },
      {
        onSuccess: () => setInput(""),
      },
    )
  }
  return (
    <form className="flex w-full items-center gap-2" onSubmit={onSubmit}>
      <Input
        placeholder="Write a comment..."
        value={input}
        disabled={mutation.isPending}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!input.trim() || mutation.isPending}
      >
        {!mutation.isPending ? (
          <SendHorizonalIcon />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </Button>
    </form>
  )
}
