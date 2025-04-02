import { FC } from "react"

import * as icons from "lucide-react"
import { LucideProps } from "lucide-react"

import { IconType } from "@/types"

export function CustomIcon({ name, props }: IconType) {
  // Dynamically get the icon component
  const IconComponent = icons[name] as FC<LucideProps>

  if (!IconComponent) {
    console.error(`Icon with name ${name} not found!`)
    return null
  }

  return <IconComponent {...props} /> // Render the icon with its props
}
