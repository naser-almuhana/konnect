"use client"

import { useState } from "react"

import { MoreHorizontalIcon, Trash2Icon } from "lucide-react"

import { useDeletePostMutation } from "@/components/posts/mutations"
import { DeleteDialog } from "@/components/shared/delete-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PostMoreButtonProps {
  postId: string
  triggerClassName?: string
}

export function PostMoreMenu({
  postId,
  triggerClassName,
}: PostMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const mutation = useDeletePostMutation()
  const handleHideDialog = () => setShowDeleteDialog(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className={triggerClassName}>
            <MoreHorizontalIcon className="text-muted-foreground size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <Trash2Icon className="text-destructive size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteDialog
        open={showDeleteDialog}
        onClose={handleHideDialog}
        onDelete={() =>
          mutation.mutate(postId, { onSuccess: handleHideDialog })
        }
        loading={mutation.isPending}
        title="Delete post?"
        description="Are you sure you want to delete this post? This action cannot be undone."
      />
    </>
  )
}
