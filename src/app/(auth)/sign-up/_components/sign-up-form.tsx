"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { SignUpValues } from "@/types"

import { signUp } from "@/lib/auth-client"
import { signUpSchema } from "@/lib/validation"

import { signupDefaultValues } from "@/constants"

import { LoadingButton } from "@/components/shared/Loading-button"
import { PasswordInput } from "@/components/shared/Password-input"
import { CustomAlert } from "@/components/shared/custom-alert"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function SignupForm() {
  const [error, setError] = useState<string>()

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: signupDefaultValues,
  })

  async function onSubmit(values: SignUpValues) {
    setError(undefined)
    startTransition(async () => {
      await signUp.email(
        {
          name: values.username,
          username: values.username,
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: () => {
            toast.success("User has been created")
            router.replace("/")
          },
          onError: (ctx) => {
            setError(ctx.error.message)
            toast.success("Failed to create user")
          },
        },
      )
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && <CustomAlert description={error} />}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={isPending} type="submit" className="w-full">
          {isPending ? "Creating" : "Create account"}
        </LoadingButton>
      </form>
    </Form>
  )
}
