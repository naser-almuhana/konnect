import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import loginImage from "@/assets/login-image.jpg"

import { GithubLoginButton } from "./_components/github-login-button"
import { GoogleLoginButton } from "./_components/google-login-button"
import { LoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <>
      <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
        <h1 className="text-center text-3xl font-bold">Login to konnect</h1>
        <div className="space-y-5">
          <GoogleLoginButton />
          <GithubLoginButton />
          <div className="flex items-center gap-3">
            <div className="bg-muted h-px flex-1" />
            <span>OR</span>
            <div className="bg-muted h-px flex-1" />
          </div>
          <LoginForm />
          <Link href="/sign-up" className="block text-center hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
      <Image
        src={loginImage}
        alt=""
        className="hidden w-1/2 object-cover md:block"
      />
    </>
  )
}
