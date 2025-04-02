import { LoadingButton } from "@/components/shared/Loading-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteDialogProps {
  open: boolean
  onClose: () => void
  onDelete: () => void
  loading: boolean
  title: string
  description: string
}

export function DeleteDialog({
  open,
  onClose,
  onDelete,
  loading,
  title,
  description,
}: DeleteDialogProps) {
  function handleOpenChange(open: boolean) {
    if (!open || !loading) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={onDelete}
            loading={loading}
          >
            Delete
          </LoadingButton>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
