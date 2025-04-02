import { redirect } from "next/navigation"

import { validateRequest } from "@/lib/auth"

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = await validateRequest()

  if (user) redirect("/")

  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="bg-card flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl shadow-2xl">
        {children}
      </div>
    </main>
  )
}
