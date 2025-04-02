import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import signupImage from "@/assets/sign-up-image.jpg"

import { SignupForm } from "./_components/sign-up-form"

export const metadata: Metadata = {
  title: "Sign Up",
}

export default function SignupPage() {
  return (
    <>
      <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold">Sign up to konnect</h1>
          <p className="text-muted-foreground">
            A place where even <span className="italic">you</span> can find a
            friend.
          </p>
        </div>
        <div className="space-y-5">
          <SignupForm />
          <Link href="/login" className="block text-center hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
      <Image
        src={signupImage}
        alt=""
        className="hidden w-1/2 object-cover md:block"
      />
    </>
  )
}
