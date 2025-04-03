import { redirect } from "next/navigation"

import { validateRequest } from "@/lib/auth"

import { Header } from "./_components/header"
import { MenuBar } from "./_components/menu-bar"

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = await validateRequest()

  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
        <MenuBar className="bg-card sticky top-[5.25rem] hidden h-fit flex-none space-y-2 rounded-2xl px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-80" />
        {children}
      </div>
      <MenuBar className="bg-card sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden" />
    </div>
  )
}
