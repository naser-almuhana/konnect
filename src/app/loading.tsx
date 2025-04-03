import { Loader2 } from "lucide-react"

export default function RootLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin" size={40} />
    </div>
  )
}
