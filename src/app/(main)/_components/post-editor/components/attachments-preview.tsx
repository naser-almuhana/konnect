import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import { type Attachment } from "@/hooks/use-media-upload"

import { SingleAttachmentPreview } from "./single-attachment-preview"

interface AttachmentsPreviewProps {
  attachments: Attachment[]
  removeAttachment: (fileName: string) => void
}

export function AttachmentsPreview({
  attachments,
  removeAttachment,
}: AttachmentsPreviewProps) {
  const columnsCountBreakPoints: { [key: number]: number } | undefined =
    attachments.length > 1 ? { 350: 1, 500: 2 } : { 350: 1 }

  return (
    <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
      <Masonry>
        {attachments.map((attachment) => (
          <SingleAttachmentPreview
            key={attachment.file.name}
            attachment={attachment}
            onRemoveClick={() => removeAttachment(attachment.file.name)}
          />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  )
}
