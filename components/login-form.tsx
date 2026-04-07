"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/authContext"
import { useRouter, useSearchParams } from "next/navigation"
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false)
  const [sessionExpired, setSessionExpired] = useState(false);
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if session expired message should be shown
    if ( searchParams.get("session") === 'expired') {
      setSessionExpired(true);
    }
    
    // If user is already logged in, redirect to dashboard
    if (user) {
       const roleRoutes: Record<string, string> = {
          student: "/dashboard/student",
          admin: "/dashboard/admin",
        }

        const dashboardRoute = roleRoutes[user.role] || "/dashboard"
        router.push(dashboardRoute)
    }
  }, [user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/auth";

    try {
      await login(email, password);
    } catch (err) {
      setError("Unable to login. Please check your credentials and try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to continue
          </p>
        </div>
        {/* Session Expired Message */}
         {sessionExpired && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Session Expired!</strong>
            <span className="block sm:inline"> Please login again.</span>
          </div>
        )}
        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Email */}
        <Field>
          <FieldLabel htmlFor="email">
            <span className="inline-flex items-center gap-2">
              <MailIcon
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <span>Email address</span>
            </span>
          </FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoFocus
            autoComplete="email"
            required
            aria-invalid={false}
          />
          <FieldDescription>
            We’ll never share your email.
          </FieldDescription>
        </Field>

        {/* Password */}
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">
              <span className="inline-flex items-center gap-2">
                <LockIcon
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>Password</span>
              </span>
            </FieldLabel>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeIcon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </Field>

        {/* Submit */}
        <Field>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
