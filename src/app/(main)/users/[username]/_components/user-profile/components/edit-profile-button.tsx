"use client"

import { useState } from "react"

import { UserData } from "@/types/db.types"

import { Button } from "@/components/ui/button"

import { EditProfileDialog } from "./edit-profile-dialog"

interface EditProfileButtonProps {
  user: UserData
}

export function EditProfileButton({ user }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  )
}
