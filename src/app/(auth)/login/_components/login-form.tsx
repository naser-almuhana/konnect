"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { LoginValues } from "@/types"

import { signIn } from "@/lib/auth-client"
import { loginSchema } from "@/lib/validation"

import { loginDefaultValues } from "@/constants"

import LoadingButton from "@/components/shared/Loading-button"
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

export function LoginForm() {
  const [error, setError] = useState<string>()

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  })

  async function onSubmit(values: LoginValues) {
    setError(undefined)
    startTransition(async () => {
      await signIn.username(
        {
          username: values.username,
          password: values.password,
        },
        {
          onSuccess: () => {
            router.replace("/")
          },
          onError: (ctx) => {
            setError(ctx.error.message)
            toast.success("Failed to create user")
          },
          redirect: "follow",
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
          {isPending ? "Logging in" : "Login"}
        </LoadingButton>
      </form>
    </Form>
  )
}
