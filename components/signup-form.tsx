"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet, CheckCircle2, AlertCircle, Loader2, Coins } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";

export function SignUpForm({ className }: { className?: string }) {
  const router = useRouter();
  const {
    user,
    isAuthenticating,
    authError,
    walletAddress,
    isPhantomInstalled,
    connectAndLogin,
  } = useAuth();

  // Already authenticated → redirect immediately
  useEffect(() => {
    if (user) {
      router.replace("/dashboard/student");
    }
  }, [user, router]);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Header */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Connect your Phantom wallet to get started
        </p>
      </div>

      {/* 20 COIN bonus callout */}
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
        <Coins className="size-5 shrink-0 text-primary" />
        <div className="text-sm">
          <p className="font-semibold text-foreground">20 COIN free on sign-up</p>
          <p className="text-xs text-muted-foreground">
            Automatically credited to your wallet — no purchase needed.
          </p>
        </div>
      </div>

      {/* Phantom not installed */}
      {!isPhantomInstalled && (
        <div className="flex items-start gap-2 rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            Phantom is not installed.{" "}
            <a
              href="https://phantom.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2"
            >
              Install it here
            </a>{" "}
            then refresh.
          </span>
        </div>
      )}

      {/* Wallet connected indicator */}
      {walletAddress && (
        <div className="flex items-center gap-2 rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-300">
          <CheckCircle2 className="size-4 shrink-0" />
          <span className="truncate font-mono text-xs">{walletAddress}</span>
        </div>
      )}

      {/* Error */}
      {authError && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* Connect button */}
      <Button
        type="button"
        className="w-full gap-2"
        disabled={isAuthenticating || !isPhantomInstalled}
        onClick={connectAndLogin}
      >
        {isAuthenticating ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Wallet className="size-4" />
        )}
        {isAuthenticating
          ? "Waiting for Phantom…"
          : walletAddress
          ? "Sign Up with Connected Wallet"
          : "Connect Wallet & Sign Up"}
      </Button>

      {/* Steps */}
      <div className="rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="mb-2 font-semibold text-foreground">How it works</p>
        <ol className="list-decimal space-y-1 pl-4">
          <li>Click the button — Phantom opens.</li>
          <li>Approve the connection (one click).</li>
          <li>Sign the authentication message — no gas fee.</li>
          <li>Account created + 20 COIN credited instantly.</li>
        </ol>
      </div>
    </div>
  );
}
