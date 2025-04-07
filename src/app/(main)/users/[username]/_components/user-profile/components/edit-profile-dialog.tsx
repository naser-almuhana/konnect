"use client"

import { useState } from "react"

import userImagePlaceholder from "@/assets/user-image-placeholder.png"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { UpdateUserProfileValues, UserData } from "@/types/db.types"

import { updateUserProfileSchema } from "@/lib/validation"

import { useUpdateProfileMutation } from "@/hooks/use-update-profile.mutation"

import { LoadingButton } from "@/components/shared/Loading-button"
import { UserImageInput } from "@/components/shared/user-image-input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface EditProfileDialogProps {
  user: UserData
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditProfileDialog({
  open,
  onOpenChange,
  user,
}: EditProfileDialogProps) {
  const [croppedUserImage, setCroppedUserImage] = useState<Blob | null>(null)

  const form = useForm<UpdateUserProfileValues>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      displayUsername: user.displayUsername,
      bio: user.bio || "",
    },
  })

  const mutation = useUpdateProfileMutation()

  async function onSubmit(values: UpdateUserProfileValues) {
    const newUserImageFile = croppedUserImage
      ? new File([croppedUserImage], `user-${user.username}-image.webp`, {
          type: "image/webp",
        })
      : undefined
    console.log(newUserImageFile)
    mutation.mutate(
      {
        values,
        userImage: newUserImageFile,
      },
      {
        onSuccess: () => {
          setCroppedUserImage(null)
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Avatar</Label>
          <UserImageInput
            src={
              croppedUserImage
                ? URL.createObjectURL(croppedUserImage)
                : user.image || userImagePlaceholder
            }
            onImageCropped={setCroppedUserImage}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="displayUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your display name"
                      disabled={mutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={mutation.isPending}
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <LoadingButton type="submit" loading={mutation.isPending}>
                Save
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
