import Link from "next/link"
import { GalleryVerticalEnd } from "lucide-react"
import { SignUpForm } from "@/components/signup-form"

export default function SignUpPage() {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      
      {/* Left: Visual Context */}

       <aside className="relative hidden lg:block" aria-hidden="true">
        <img
          src="/login.png"
          alt="Abstract illustration representing secure access"
          className="absolute inset-0 h-full w-full object-cover
                     dark:brightness-[0.25] dark:grayscale"
        />
      </aside>

    {/* Right: Sign Up Form */}
      <section className="flex flex-col gap-6 p-6 md:p-10">
        {/* Brand */}
        <header className="flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground"
            aria-label="Acme Inc Home"
          >
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span>NextQ</span>
          </Link>
        </header>

        {/* Form */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-3 rounded-xl border bg-background p-6 shadow-sm">
            <SignUpForm />
            <div className="space-y-2">
              <p className="text-center text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
     
    </main>
  )
}
