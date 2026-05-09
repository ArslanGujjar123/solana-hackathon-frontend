"use client";

/**
 * useSolanaTransaction — builds, signs, and submits SPL token transactions
 * entirely from the frontend using Phantom wallet.
 *
 * Flow for a spend (quiz/paper):
 *   1. Frontend fetches a fresh blockhash from the backend
 *   2. Frontend builds a burn instruction (user's ATA → burn)
 *   3. Phantom signs the transaction (user approves in popup)
 *   4. Signed tx is sent to POST /api/token/submit-signed-tx
 *   5. Backend submits to Solana RPC, updates DB, returns new balance
 *
 * Flow for a transfer (send COIN):
 *   1. Frontend fetches blockhash
 *   2. Frontend builds transfer instruction (sender ATA → recipient ATA)
 *   3. Phantom signs
 *   4. Backend submits, updates both DB balances, returns result
 */

import { useCallback, useState } from "react";
import { getPhantomProvider } from "@/lib/phantom";
import { apiFetch } from "@/lib/api/client";

export interface SignedTxResult {
  solana_tx: string;
  new_balance: number;
  note: string;
}

export interface TransferResult extends SignedTxResult {
  fee_charged: number;
}

export function useSolanaTransaction() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Fetch a fresh blockhash from the backend (proxied to Solana RPC)
  // -------------------------------------------------------------------------
  const getBlockhash = useCallback(async (): Promise<string> => {
    const res = await apiFetch<{ blockhash: string }>("/api/solana/blockhash");
    return res.blockhash;
  }, []);

  // -------------------------------------------------------------------------
  // Build + sign + submit a burn transaction (for quiz/paper spends)
  //
  // amount: number of COIN to burn (e.g. 5 for quiz)
  // -------------------------------------------------------------------------
  const burnCoins = useCallback(
    async (amount: number, purpose: string): Promise<SignedTxResult> => {
      const provider = getPhantomProvider();
      if (!provider?.publicKey) {
        throw new Error("Phantom wallet is not connected.");
      }

      setIsProcessing(true);
      setTxError(null);

      try {
        const { PublicKey, Transaction } = await import("@solana/web3.js");
        const splToken = await import("@solana/spl-token");

        const walletPubkey = new PublicKey(provider.publicKey.toBase58());
        const mintPubkey = new PublicKey(
          process.env.NEXT_PUBLIC_COIN_MINT!
        );

        // Get user's ATA
        const userAta = splToken.getAssociatedTokenAddressSync(
          mintPubkey,
          walletPubkey
        );

        // Fetch fresh blockhash
        const blockhash = await getBlockhash();

        // Build burn instruction (amount × 100 raw units, 2 decimals)
        const rawAmount = BigInt(amount) * BigInt(100);
        const burnIx = splToken.createBurnInstruction(
          userAta,
          mintPubkey,
          walletPubkey,
          rawAmount
        );

        const tx = new Transaction();
        tx.recentBlockhash = blockhash;
        tx.feePayer = walletPubkey;
        tx.add(burnIx);

        // Sign with Phantom
        const signedTx = await provider.signTransaction(tx) as typeof tx;
        const signedBytes = signedTx.serialize();
        const signedBase64 = Buffer.from(signedBytes).toString("base64");

        // Submit to backend
        const result = await apiFetch<SignedTxResult>(
          "/api/token/submit-signed-tx",
          {
            method: "POST",
            body: JSON.stringify({
              signed_tx: signedBase64,
              tx_type: "burn",
              amount,
              purpose,
            }),
          }
        );

        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Transaction failed.";
        setTxError(msg);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [getBlockhash]
  );

  // -------------------------------------------------------------------------
  // Build + sign + submit a transfer transaction (send COIN to another user)
  //
  // recipientWallet: base58 public key of recipient
  // amount: number of COIN to transfer
  //
  // Flow:
  //   1. POST /api/solana/prepare-transfer — backend creates recipient ATA if
  //      it doesn't exist (platform pays rent), returns fresh blockhash
  //   2. Build SPL transfer instruction using the confirmed ATA
  //   3. Phantom signs the transaction
  //   4. POST /api/token/submit-signed-tx — backend submits to RPC + updates DB
  // -------------------------------------------------------------------------
  const transferCoins = useCallback(
    async (
      recipientWallet: string,
      amount: number
    ): Promise<TransferResult> => {
      const provider = getPhantomProvider();
      if (!provider?.publicKey) {
        throw new Error("Phantom wallet is not connected.");
      }

      setIsProcessing(true);
      setTxError(null);

      try {
        const { PublicKey, Transaction } = await import("@solana/web3.js");
        const splToken = await import("@solana/spl-token");

        const senderPubkey = new PublicKey(provider.publicKey.toBase58());
        const recipientPubkey = new PublicKey(recipientWallet);
        const mintPubkey = new PublicKey(
          process.env.NEXT_PUBLIC_COIN_MINT!
        );

        // Step 1 — Ask backend to ensure recipient ATA exists (platform pays
        // rent if it needs to be created) and get a fresh blockhash.
        const prepareRes = await apiFetch<{
          blockhash: string;
          recipient_ata: string;
          ata_created: boolean;
        }>("/api/solana/prepare-transfer", {
          method: "POST",
          body: JSON.stringify({ recipient_wallet: recipientWallet }),
        });

        const senderAta = splToken.getAssociatedTokenAddressSync(
          mintPubkey,
          senderPubkey
        );
        // Use the ATA address confirmed by the backend
        const recipientAta = new PublicKey(prepareRes.recipient_ata);

        // Step 2 — Build transfer instruction (amount × 100 raw units, 2 decimals)
        const rawAmount = BigInt(amount) * BigInt(100);
        const transferIx = splToken.createTransferCheckedInstruction(
          senderAta,
          mintPubkey,
          recipientAta,
          senderPubkey,
          rawAmount,
          2 // decimals
        );

        const tx = new Transaction();
        tx.recentBlockhash = prepareRes.blockhash;
        tx.feePayer = senderPubkey;
        tx.add(transferIx);

        // Step 3 — Sign with Phantom
        const signedTx = await provider.signTransaction(tx) as typeof tx;
        const signedBytes = signedTx.serialize();
        const signedBase64 = Buffer.from(signedBytes).toString("base64");

        // Step 4 — Submit to backend
        const result = await apiFetch<TransferResult>(
          "/api/token/submit-signed-tx",
          {
            method: "POST",
            body: JSON.stringify({
              signed_tx: signedBase64,
              tx_type: "transfer",
              amount,
              recipient_wallet: recipientWallet,
            }),
          }
        );

        return result;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Transfer failed.";
        setTxError(msg);
        throw err;
      } finally {
        setIsProcessing(false);
      }
    },
    [] // no external deps — apiFetch and getPhantomProvider are stable module-level refs
  );

  return {
    isProcessing,
    txError,
    burnCoins,
    transferCoins,
  };
}
