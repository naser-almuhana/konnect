import React, { useState } from "react"

import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

import { Input, InputProps } from "@/components/ui/input"

export const PasswordInput = ({ className, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("pe-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        title={showPassword ? "Hide password" : "Show password"}
        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer"
      >
        {showPassword ? (
          <EyeOff className="size-5" />
        ) : (
          <Eye className="size-5" />
        )}
      </button>
    </div>
  )
}
