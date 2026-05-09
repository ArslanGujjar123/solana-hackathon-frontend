/**
 * Phantom wallet browser extension types and helpers.
 *
 * Supports:
 *   - signMessage  — for authentication
 *   - signTransaction — for client-side SPL token burns/transfers
 */

import bs58 from "bs58";

export interface PhantomProvider {
  isPhantom: boolean;
  publicKey: { toBase58(): string } | null;
  isConnected: boolean;
  connect(opts?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: { toBase58(): string } }>;
  disconnect(): Promise<void>;
  signMessage(
    message: Uint8Array,
    encoding: "utf8"
  ): Promise<{ signature: Uint8Array; publicKey: { toBase58(): string } }>;
  /** Sign a transaction without broadcasting it. */
  signTransaction(transaction: unknown): Promise<unknown>;
  /** Sign multiple transactions without broadcasting. */
  signAllTransactions(transactions: unknown[]): Promise<unknown[]>;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

export function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === "undefined") return null;
  const provider = window.solana;
  if (provider?.isPhantom) return provider;
  return null;
}

export function isPhantomInstalled(): boolean {
  return getPhantomProvider() !== null;
}

export async function connectPhantom(): Promise<string> {
  const provider = getPhantomProvider();
  if (!provider) {
    throw new Error(
      "Phantom wallet is not installed. Please install it from https://phantom.app"
    );
  }
  const { publicKey } = await provider.connect();
  return publicKey.toBase58();
}

export async function signMessageWithPhantom(message: string): Promise<string> {
  const provider = getPhantomProvider();
  if (!provider) throw new Error("Phantom wallet is not installed.");
  if (!provider.publicKey) throw new Error("Wallet is not connected.");

  const encoded = new TextEncoder().encode(message);
  const { signature } = await provider.signMessage(encoded, "utf8");
  return bs58.encode(signature);
}

/**
 * Sign a Solana transaction with Phantom (client-side).
 * Returns the signed transaction as a base64 string ready to send to the backend.
 *
 * The transaction must be built with the correct blockhash and fee payer
 * before calling this function.
 */
export async function signTransactionWithPhantom(
  serializedTx: Uint8Array
): Promise<string> {
  const provider = getPhantomProvider();
  if (!provider) throw new Error("Phantom wallet is not installed.");
  if (!provider.publicKey) throw new Error("Wallet is not connected.");

  // Dynamically import @solana/web3.js to avoid SSR issues
  const { Transaction } = await import("@solana/web3.js");

  const tx = Transaction.from(serializedTx);
  const signed = await provider.signTransaction(tx) as typeof tx;

  // Serialize the signed transaction to base64
  const signedBytes = signed.serialize();
  return Buffer.from(signedBytes).toString("base64");
}

export async function disconnectPhantom(): Promise<void> {
  const provider = getPhantomProvider();
  if (provider) await provider.disconnect();
}
