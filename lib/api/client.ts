/**
 * Typed API client for the Rust/Axum backend.
 *
 * All requests attach the JWT stored in localStorage as a Bearer token.
 * The token is written by authContext after a successful login/signup.
 *
 * Backend base URL is read from NEXT_PUBLIC_API_URL (default: http://localhost:3000).
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ---------------------------------------------------------------------------
// Token storage helpers (localStorage — works in browser only)
// ---------------------------------------------------------------------------

const TOKEN_KEY = "nextq_jwt";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
    // Also write a cookie so Next.js middleware can read it for route protection
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }
}

export function loadToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    // Expire the cookie
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = loadToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      // Rust backend returns { "error": "..." }
      message = body.error ?? body.message ?? body.detail ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(response.status, message);
  }

  // 204 No Content — return empty object
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Auth endpoints  (matches backend-rust/src/handlers/auth_handler.rs)
// ---------------------------------------------------------------------------

export interface AuthResponse {
  user_id: string;
  token: string;
  /** Solana transaction signature for the signup bonus mint, if on-chain. */
  solana_tx?: string | null;
}

export interface MeResponse {
  user: {
    id: string;
    wallet_address: string;
    email: string | null;
    signup_bonus_granted: boolean;
    created_at: string;
    updated_at: string;
  };
  balance: number;
}

export const authApi = {
  /**
   * Register a new wallet — mints 20 COIN signup bonus.
   * POST /api/auth/signup
   */
  signup(params: {
    wallet_address: string;
    signed_message: string;
    signature: string;
    email?: string;
  }): Promise<AuthResponse> {
    return apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  /**
   * Login with an existing wallet.
   * POST /api/auth/login
   */
  login(params: {
    wallet_address: string;
    signed_message: string;
    signature: string;
  }): Promise<AuthResponse> {
    return apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  /**
   * Get the current authenticated user + COIN balance.
   * GET /api/auth/me
   */
  me(): Promise<MeResponse> {
    return apiFetch("/api/auth/me");
  },
};

// ---------------------------------------------------------------------------
// Quiz endpoints  (matches /api/quiz/*)
// ---------------------------------------------------------------------------

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  answer?: string;
}

export interface GeneratedQuiz {
  id: string;
  user_id: string;
  subject: string;
  questions: unknown; // raw JSON from backend
  answers: unknown | null;
  score: number | null;
  tokens_spent: number;
  created_at: string;
}

export interface PagedQuizHistory {
  items: GeneratedQuiz[];
  limit: number;
  offset: number;
}

export const quizApi = {
  generate(subject: string): Promise<{ quiz: GeneratedQuiz }> {
    return apiFetch("/api/quiz/generate", {
      method: "POST",
      body: JSON.stringify({ subject }),
    });
  },

  /** Record a quiz row after an on-chain burn — no COIN deduction. */
  record(subject: string, tokensBurned: number): Promise<{ quiz: GeneratedQuiz }> {
    return apiFetch("/api/quiz/record", {
      method: "POST",
      body: JSON.stringify({ subject, tokens_spent: tokensBurned }),
    });
  },

  submit(params: {
    quiz_id: string;
    answers: unknown;
    score: number;
  }): Promise<GeneratedQuiz> {
    return apiFetch("/api/quiz/submit", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  history(limit = 20, offset = 0): Promise<PagedQuizHistory> {
    return apiFetch(`/api/quiz/history?limit=${limit}&offset=${offset}`);
  },
};

// ---------------------------------------------------------------------------
// Paper endpoints  (matches /api/paper/*)
// ---------------------------------------------------------------------------

export interface GeneratedPaper {
  id: string;
  user_id: string;
  subject: string;
  paper_payload: unknown | null;
  download_url: string | null;
  tokens_spent: number;
  created_at: string;
}

export interface PagedPaperHistory {
  items: GeneratedPaper[];
  limit: number;
  offset: number;
}

export const paperApi = {
  generate(subject: string): Promise<GeneratedPaper> {
    return apiFetch("/api/paper/generate", {
      method: "POST",
      body: JSON.stringify({ subject }),
    });
  },

  generateUnverified(subject: string): Promise<GeneratedPaper> {
    return apiFetch("/api/paper/generate-unverified", {
      method: "POST",
      body: JSON.stringify({ subject }),
    });
  },

  /** Record a verified paper row after an on-chain burn — no COIN deduction. */
  record(subject: string, tokensBurned: number): Promise<GeneratedPaper> {
    return apiFetch("/api/paper/record", {
      method: "POST",
      body: JSON.stringify({ subject, tokens_spent: tokensBurned }),
    });
  },

  /** Record an unverified paper row after an on-chain burn — no COIN deduction. */
  recordUnverified(subject: string, tokensBurned: number): Promise<GeneratedPaper> {
    return apiFetch("/api/paper/record-unverified", {
      method: "POST",
      body: JSON.stringify({ subject, tokens_spent: tokensBurned }),
    });
  },

  download(paperId: string): Promise<{
    id: string;
    subject: string;
    download_url: string | null;
    paper_payload: unknown | null;
  }> {
    return apiFetch(`/api/paper/download/${paperId}`);
  },

  history(limit = 20, offset = 0): Promise<PagedPaperHistory> {
    return apiFetch(`/api/paper/history?limit=${limit}&offset=${offset}`);
  },
};

// ---------------------------------------------------------------------------
// Upload endpoints  (matches /api/upload/*)
// ---------------------------------------------------------------------------

export interface Upload {
  id: string;
  user_id: string;
  filename: string;
  storage_path: string;
  status: string;
  ai_score: number | null;
  reward_tokens: number;
  created_at: string;
  updated_at: string;
}

export const uploadApi = {
  /** Upload a file (multipart/form-data). */
  submit(file: File): Promise<Upload> {
    const token = loadToken();
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${API_BASE}/api/upload/submit`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(res.status, body.error ?? `HTTP ${res.status}`);
      }
      return res.json();
    });
  },

  status(uploadId: string): Promise<Upload> {
    return apiFetch(`/api/upload/status/${uploadId}`);
  },

  history(limit = 20, offset = 0): Promise<Upload[]> {
    return apiFetch(`/api/upload/history?limit=${limit}&offset=${offset}`);
  },
};

// ---------------------------------------------------------------------------
// Token endpoints  (matches /api/token/*)
// ---------------------------------------------------------------------------

export interface Transaction {
  id: string;
  from_user_id: string | null;
  to_user_id: string | null;
  amount: number;
  tx_type: string;
  reference_id: string | null;
  note: string | null;
  created_at: string;
}

export interface TokenTransfer {
  id: string;
  sender_user_id: string;
  recipient_user_id: string;
  amount: number;
  transaction_id: string | null;
  created_at: string;
}

export interface TokenHistoryResponse {
  transactions: Transaction[];
  sends_and_receives: TokenTransfer[];
}

export const tokenApi = {
  balance(): Promise<{ balance: number }> {
    return apiFetch("/api/token/balance");
  },

  send(params: {
    recipient_wallet: string;
    amount: number;
  }): Promise<{ transfer: TokenTransfer; fee_charged: number; solana_tx: string | null; on_chain_status: string }> {
    return apiFetch("/api/token/send", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  history(limit = 20, offset = 0): Promise<TokenHistoryResponse> {
    return apiFetch(`/api/token/history?limit=${limit}&offset=${offset}`);
  },

  buy(usd_amount: number): Promise<{
    checkout_url: string;
    credited_tokens: number;
    note: string;
  }> {
    return apiFetch("/api/token/buy", {
      method: "POST",
      body: JSON.stringify({ usd_amount }),
    });
  },
};
