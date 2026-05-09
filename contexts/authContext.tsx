"use client";

/**
 * AuthContext — single source of truth for auth state.
 *
 * Root cause of redirect bug (fixed here):
 *   - Forms were calling usePhantom() independently, creating a second hook
 *     instance with its own isLoading/error state disconnected from the auth flow.
 *   - pendingRedirect + useEffect pattern had a race: the cookie written by
 *     saveToken() wasn't committed before router.push() fired, causing the
 *     middleware to redirect back to /login.
 *
 * Fix:
 *   1. All loading/error state lives here — forms only call useAuth().
 *   2. After saveToken() we use router.replace() (not push) to avoid loops.
 *   3. We wait for the cookie to be committed with a microtask flush before
 *      navigating (requestAnimationFrame ensures the browser has processed
 *      the cookie write).
 *   4. No pendingRedirect ref needed — we navigate directly after setUser().
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  clearToken,
  loadToken,
  saveToken,
  type MeResponse,
} from "@/lib/api/client";
import {
  connectPhantom,
  disconnectPhantom,
  getPhantomProvider,
  isPhantomInstalled,
  signMessageWithPhantom,
} from "@/lib/phantom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuthUser = MeResponse["user"] & { balance: number };
export type AuthMode = "login" | "signup";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;       // true while restoring session on mount
  isAuthenticating: boolean; // true while Phantom popups are open
  authError: string | null;  // error from the last connectAndLogin attempt
  walletAddress: string | null;
  isPhantomInstalled: boolean;
  connectAndLogin: () => Promise<void>;
  logout: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  /** Instantly update the balance in context without a network call. */
  setBalance: (newBalance: number) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  const router = useRouter();

  // -------------------------------------------------------------------------
  // Detect Phantom on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    setPhantomInstalled(isPhantomInstalled());

    // Restore already-connected wallet address from Phantom
    const provider = getPhantomProvider();
    if (provider?.isConnected && provider.publicKey) {
      setWalletAddress(provider.publicKey.toBase58());
    }
  }, []);

  // -------------------------------------------------------------------------
  // Restore session from stored JWT on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    const restore = async () => {
      const token = loadToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { user: u, balance } = await authApi.me();
        setUser({ ...u, balance });
        setWalletAddress(u.wallet_address);
      } catch {
        clearToken();
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  // -------------------------------------------------------------------------
  // connectAndLogin — the ONLY place Phantom interaction happens
  //
  // Flow:
  //   1. Connect wallet  → Phantom popup #1
  //   2. Build nonce message
  //   3. Sign message    → Phantom popup #2 (no gas)
  //   4. POST /api/auth/signup (idempotent — new users get 20 COIN)
  //   5. saveToken() writes JWT to localStorage + cookie
  //   6. GET /api/auth/me → set user state
  //   7. router.replace("/dashboard/student")
  // -------------------------------------------------------------------------
  const connectAndLogin = useCallback(async () => {
    if (!isPhantomInstalled()) {
      setAuthError(
        "Phantom wallet is not installed. Please install it from https://phantom.app"
      );
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      // Step 1 — Connect wallet
      const address = await connectPhantom();
      setWalletAddress(address);

      // Step 2 — Build sign message
      const nonce = Date.now().toString();
      const message =
        `Sign this message to authenticate with Universal Learning Platform.\n` +
        `Wallet: ${address}\n` +
        `Nonce: ${nonce}`;

      // Step 3 — Sign (Phantom popup, no gas fee)
      const signature = await signMessageWithPhantom(message);

      // Step 4 — POST to backend (idempotent signup)
      const authResponse = await authApi.signup({
        wallet_address: address,
        signed_message: message,
        signature,
      });

      // Step 5 — Persist JWT (localStorage + cookie for middleware)
      saveToken(authResponse.token);

      // Step 6 — Fetch full profile
      const { user: u, balance } = await authApi.me();
      setUser({ ...u, balance });

      // Step 7 — Navigate after a rAF to ensure the cookie is committed
      // before the middleware reads it on the next request.
      requestAnimationFrame(() => {
        router.replace("/dashboard/student");
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Authentication failed.";
      setAuthError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  }, [router]);

  // -------------------------------------------------------------------------
  // refreshBalance
  // -------------------------------------------------------------------------
  const refreshBalance = useCallback(async () => {
    try {
      const { user: u, balance } = await authApi.me();
      setUser({ ...u, balance });
    } catch {
      // stale balance is acceptable
    }
  }, []);

  // -------------------------------------------------------------------------
  // setBalance — instant update without network call
  // Used after client-side signed transactions to update UI immediately
  // -------------------------------------------------------------------------
  const setBalance = useCallback((newBalance: number) => {
    setUser((prev) => prev ? { ...prev, balance: newBalance } : prev);
  }, []);

  // -------------------------------------------------------------------------
  // logout
  // -------------------------------------------------------------------------
  const logout = useCallback(async () => {
    clearToken();
    setUser(null);
    setWalletAddress(null);
    setAuthError(null);
    try {
      await disconnectPhantom();
    } catch {
      // ignore
    }
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticating,
        authError,
        walletAddress,
        isPhantomInstalled: phantomInstalled,
        connectAndLogin,
        logout,
        refreshBalance,
        setBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
