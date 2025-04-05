"use client"

import Image, { StaticImageData } from "next/image"
import { useRef, useState } from "react"

import { CameraIcon } from "lucide-react"
import Resizer from "react-image-file-resizer"

import { CropImageDialog } from "@/components/shared/crop-image-dialog"

interface UserImageInputProps {
  src: string | StaticImageData
  onImageCropped: (blob: Blob | null) => void
}

export function UserImageInput({ src, onImageCropped }: UserImageInputProps) {
  const [imageToCrop, setImageToCrop] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function onImageSelected(image: File | undefined) {
    if (!image) return

    Resizer.imageFileResizer(
      image, // Is the file of the image which will resized.
      1024, // Is the maxWidth of the resized new image.
      1024, // Is the maxHeight of the resized new image.
      "WEBP", // Is the compressFormat of the resized new image.
      100, // Is the quality of the resized new image.
      0, // Is the degree of clockwise rotation to apply to uploaded image.
      (uri) => setImageToCrop(uri as File), // Is the callBack function of the resized new image URI.
      "file", // Is the output type of the resized new image.
      // minWidth, // Is the minWidth of the resized new image.
      // minHeight // Is the minHeight of the resized new image.
    )
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelected(e.target.files?.[0])}
        ref={fileInputRef}
        className="sr-only hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="group relative block cursor-pointer"
      >
        <Image
          src={src}
          alt="User Image preview"
          width={150}
          height={150}
          className="size-32 flex-none rounded-full object-cover"
        />
        <span className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-full bg-black/50 text-white transition-colors duration-200 group-hover:bg-black/70">
          <CameraIcon size={24} />
        </span>
      </button>

      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={onImageCropped}
          onClose={() => {
            setImageToCrop(undefined)
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }}
        />
      )}
    </>
  )
}
