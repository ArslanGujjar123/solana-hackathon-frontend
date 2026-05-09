"use client";

import { Bell, CreditCard, LogOut, Wallet } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardThemeToggle } from "./theme-toggle";
import { useAuth } from "@/contexts/authContext";

export function AdminTopNav() {
  const { user, walletAddress, logout } = useAuth();

  // Shorten wallet address for display: "AbCd…XyZw"
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 4)}…${walletAddress.slice(-4)}`
    : null;

  // Show COIN balance from context
  const balance = user?.balance ?? 0;

  return (
    <div className="flex flex-1 items-center justify-between gap-4 pr-6">
      {/* Left spacer */}
      <div className="hidden w-full max-w-md md:block" />

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* COIN balance chip */}
        {user && (
          <Link
            href="/dashboard/student/my-wallet"
            className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/10 sm:flex"
          >
            <Wallet className="size-3.5" />
            {balance} COIN
          </Link>
        )}

        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground"
          aria-label="View notifications"
          asChild
        >
          <Link href="/dashboard/student/notifications">
            <Bell className="size-5" />
            <span className="absolute right-2.5 top-2 size-2 rounded-full border-2 border-card bg-red-500" />
          </Link>
        </Button>

        <DashboardThemeToggle />

        <div className="hidden h-8 w-px bg-border sm:block" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium transition hover:bg-muted focus:outline-none"
              aria-label="User menu"
            >
              {/* Wallet avatar — first 2 chars of address */}
              <div className="flex size-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                {walletAddress ? walletAddress.slice(0, 2).toUpperCase() : "?"}
              </div>
              <span className="hidden font-mono text-xs text-muted-foreground sm:block">
                {shortAddress ?? "Not connected"}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52" align="end">
            <DropdownMenuLabel>
              <p className="text-xs font-normal text-muted-foreground">
                Wallet
              </p>
              <p className="truncate font-mono text-xs">
                {walletAddress ?? "—"}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/dashboard/student/my-wallet">
                <Wallet className="mr-2 size-4" />
                My Wallet ({balance} COIN)
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/dashboard/student/buy-credits">
                <CreditCard className="mr-2 size-4" />
                Buy Credits
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-500 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-900/20"
              onClick={() => logout()}
            >
              <LogOut className="mr-2 size-4" />
              Disconnect &amp; Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
