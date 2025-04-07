import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const { error } = await searchParams
  const errorMessages: Record<string, string> = {
    unable_to_create_user: "We couldn't create your account. Please try again.",
    default: "An unexpected error occurred during authentication.",
  }

  const message = errorMessages[error] || errorMessages.default

  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <div className="text-5xl">⚠️</div>
      <h1 className="text-destructive mt-4 text-2xl font-semibold">Error</h1>
      <p className="text-muted-foreground mt-2 text-sm sm:text-base">
        {message}
      </p>
      <div className="mt-6">
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-md px-4 py-2 text-sm font-medium shadow transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}
