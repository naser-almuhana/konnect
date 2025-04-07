"use client"

import { useState } from "react"

import { MoreHorizontalIcon, Trash2Icon } from "lucide-react"

import { CommentData } from "@/types/db.types"

import { useDeleteCommentMutation } from "@/hooks/use-delete-comment.mutation"

import { DeleteDialog } from "@/components/shared/delete-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface CommentMoreButtonProps {
  comment: CommentData
  triggerClassName?: string
}

export function CommentMoreMenu({
  comment,
  triggerClassName,
}: CommentMoreButtonProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const mutation = useDeleteCommentMutation()
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
          mutation.mutate(comment.id, { onSuccess: handleHideDialog })
        }
        loading={mutation.isPending}
        title="Delete comment?"
        description="Are you sure you want to delete this comment? This action cannot be undone."
      />
    </>
  )
}
