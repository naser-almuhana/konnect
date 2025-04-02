import { validateRequest } from "@/lib/auth"

export default async function HomePage() {
  const session = await validateRequest()

  console.log("session", session)
  return <div>HomePage</div>
}
