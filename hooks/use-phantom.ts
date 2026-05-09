"use client";

/**
 * usePhantom — React hook for Phantom wallet interaction.
 *
 * Key design decisions:
 *
 * 1. We ALWAYS call /api/auth/signup regardless of whether the user is new or
 *    returning. The Rust backend's signup handler is idempotent:
 *      - New wallet  → creates user, grants 20 COIN bonus, returns JWT
 *      - Known wallet → returns existing user JWT (no duplicate bonus)
 *    This means there is no separate "login" vs "signup" distinction on the
 *    frontend — one button, one endpoint, always works.
 *
 * 2. handleAuthentication returns { token, userId } and saves the JWT to
 *    localStorage. The caller (authContext) then fetches /api/auth/me and
 *    sets React state, which triggers a useEffect redirect.
 */

import { useCallback, useEffect, useState } from "react";
import {
  connectPhantom,
  disconnectPhantom,
  getPhantomProvider,
  isPhantomInstalled,
  signMessageWithPhantom,
} from "@/lib/phantom";
import { authApi, saveToken } from "@/lib/api/client";

export type AuthMode = "login" | "signup"; // kept for API compat; both call signup

export interface AuthResult {
  token: string;
  userId: string;
}

export function usePhantom() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Detect Phantom on mount (window only available client-side)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const installed = isPhantomInstalled();
    setIsInstalled(installed);

    if (!installed) return;

    const provider = getPhantomProvider();

    // Restore already-connected state (user previously approved this site)
    if (provider?.isConnected && provider.publicKey) {
      setIsConnected(true);
      setWalletAddress(provider.publicKey.toBase58());
    }

    const handleConnect = () => {
      const p = getPhantomProvider();
      if (p?.publicKey) {
        setWalletAddress(p.publicKey.toBase58());
        setIsConnected(true);
      }
    };

    const handleDisconnect = () => {
      setWalletAddress(null);
      setIsConnected(false);
    };

    const handleAccountChange = (pk: { toBase58(): string } | null) => {
      if (pk) {
        setWalletAddress(pk.toBase58());
        setIsConnected(true);
      } else {
        setWalletAddress(null);
        setIsConnected(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = provider as any;
    p?.on?.("connect", handleConnect);
    p?.on?.("disconnect", handleDisconnect);
    p?.on?.("accountChanged", handleAccountChange);

    return () => {
      p?.off?.("connect", handleConnect);
      p?.off?.("disconnect", handleDisconnect);
      p?.off?.("accountChanged", handleAccountChange);
    };
  }, []);

  // -------------------------------------------------------------------------
  // connect — opens Phantom popup, returns wallet address
  // -------------------------------------------------------------------------
  const connect = useCallback(async (): Promise<string> => {
    setError(null);
    const address = await connectPhantom();
    setWalletAddress(address);
    setIsConnected(true);
    return address;
  }, []);

  // -------------------------------------------------------------------------
  // signMessage — signs UTF-8 string, returns base58 signature
  // -------------------------------------------------------------------------
  const signMessage = useCallback(async (message: string): Promise<string> => {
    setError(null);
    return signMessageWithPhantom(message);
  }, []);

  // -------------------------------------------------------------------------
  // disconnect
  // -------------------------------------------------------------------------
  const disconnect = useCallback(async (): Promise<void> => {
    await disconnectPhantom();
    setWalletAddress(null);
    setIsConnected(false);
  }, []);

  // -------------------------------------------------------------------------
  // handleAuthentication
  //
  // Always calls /api/auth/signup (idempotent):
  //   - First time  → creates user + grants 20 COIN bonus
  //   - Returning   → returns existing JWT, no duplicate bonus
  //
  // Flow:
  //   1. Connect wallet  (Phantom popup #1)
  //   2. Build nonce message
  //   3. Sign message    (Phantom popup #2 — no gas fee)
  //   4. POST /api/auth/signup
  //   5. Save JWT to localStorage
  //   6. Return { token, userId } to caller
  // -------------------------------------------------------------------------
  const handleAuthentication = useCallback(
    async (_mode: AuthMode = "signup"): Promise<AuthResult> => {
      if (!isInstalled) {
        throw new Error(
          "Phantom wallet is not installed. Please install it from https://phantom.app"
        );
      }

      setIsLoading(true);
      setError(null);

      try {
        // Step 1 — Connect wallet
        const address = await connect();

        // Step 2 — Build sign message
        // Format must match Rust backend's verify_wallet_signature exactly.
        const nonce = Date.now().toString();
        const message =
          `Sign this message to authenticate with Universal Learning Platform.\n` +
          `Wallet: ${address}\n` +
          `Nonce: ${nonce}`;

        // Step 3 — Sign (Phantom popup, no gas)
        const signature = await signMessage(message);

        // Step 4 — Always call signup (idempotent on the backend)
        const authResponse = await authApi.signup({
          wallet_address: address,
          signed_message: message,
          signature,
        });

        // Step 5 — Persist JWT
        saveToken(authResponse.token);

        return { token: authResponse.token, userId: authResponse.user_id };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Authentication failed.";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isInstalled, connect, signMessage]
  );

  return {
    isInstalled,
    isConnected,
    walletAddress,
    isLoading,
    error,
    connect,
    signMessage,
    disconnect,
    handleAuthentication,
  };
}
