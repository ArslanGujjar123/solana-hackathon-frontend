# Universal Learning Platform — Next.js Frontend

Next.js 16 frontend for the Universal Learning Platform.  
Students generate AI-powered quizzes and exam papers, upload past papers, and manage a Solana SPL token (COIN) wallet — all authenticated via Phantom wallet.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Environment Variables](#environment-variables)
4. [Local Development Setup](#local-development-setup)
5. [Authentication Flow](#authentication-flow)
6. [Pages & Routes](#pages--routes)
7. [COIN Token Flow](#coin-token-flow)
8. [Key Components & Hooks](#key-components--hooks)
9. [API Clients](#api-clients)
10. [Styling](#styling)

---

## Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| Framework   | Next.js 16 (App Router, Turbopack)              |
| Language    | TypeScript                                      |
| Styling     | Tailwind CSS v4                                 |
| UI          | Radix UI primitives + custom components         |
| Animations  | Motion (Framer Motion v12)                      |
| Wallet      | Phantom browser extension                       |
| Blockchain  | `@solana/web3.js` + `@solana/spl-token`         |
| State       | React Context (AuthContext)                     |
| Toasts      | Sonner                                          |

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx                    # Root layout — AuthProvider, fonts
│   ├── globals.css                   # Tailwind base + CSS custom properties
│   ├── page.tsx                      # Landing page (NextQ)
│   ├── login/page.tsx                # Phantom wallet sign-in
│   ├── signup/page.tsx               # Phantom wallet registration
│   └── dashboard/
│       ├── layout.tsx                # Dashboard shell
│       ├── page.tsx                  # Dashboard redirect
│       ├── student/
│       │   ├── layout.tsx            # Sidebar + top nav layout
│       │   ├── page.tsx              # Student dashboard — stats + quick actions
│       │   ├── quiz/page.tsx         # Verified quiz (5 COIN, Phantom burn)
│       │   ├── rank-papers-verified/ # Cambridge/Boards paper (5 COIN, Phantom burn)
│       │   ├── rank-papers-unverified/ # Community paper (2 COIN, Phantom burn)
│       │   ├── upload-paper-unverified/ # Upload past paper, earn COIN
│       │   ├── my-wallet/            # Balance, send COIN, transaction history
│       │   ├── buy-credits/          # Buy COIN packages
│       │   ├── history/              # Quiz + paper history
│       │   └── notifications/        # Transaction-based notifications
│       └── admin/
│           ├── layout.tsx
│           ├── page.tsx              # Admin dashboard
│           ├── users/                # User management
│           ├── papers/               # Paper management
│           ├── upload-papers/        # Admin paper upload
│           └── reports/              # Reports
├── components/
│   ├── ui/                           # Radix-based primitives (button, input, etc.)
│   ├── dashboard/
│   │   └── admin-top-nav.tsx         # Top navigation with COIN balance chip
│   ├── shared/
│   │   ├── sidebar/student-sidebar.tsx
│   │   └── nav/
│   └── student/
│       ├── quiz-flow.tsx             # Full quiz UI — builder, questions, review
│       ├── paper-result.tsx          # Paper display — MCQs, short/long questions
│       └── rank-paper-flow.tsx       # Legacy paper flow component
├── contexts/
│   └── authContext.tsx               # Single source of truth for auth + balance
├── hooks/
│   ├── use-solana-transaction.ts     # burnCoins + transferCoins via Phantom
│   └── use-mobile.ts                 # Responsive breakpoint hook
├── lib/
│   ├── api/
│   │   ├── client.ts                 # Rust backend API client (typed)
│   │   ├── ai.ts                     # HuggingFace AI backend client (typed)
│   │   └── student.ts                # Student-specific types
│   └── phantom.ts                    # Phantom wallet helpers
├── constants/                        # Static data for UI components
└── public/                           # Static assets
```

---

## Environment Variables

Create `frontend/.env.local`:

```env
# Rust backend (port 3000)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Solana Devnet
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=HHfqXJ9sZNNRJZGonfinA8gNY7vLpJ9tyrFQ4eAiQsgK
NEXT_PUBLIC_COIN_MINT=2YQFHTscEGsNzCbyVDGDdhFDvtNGcaAvBVK97NWDCGBg

# Dev server port (must differ from backend)
PORT=3001
```

---

## Local Development Setup

### Prerequisites

- Node.js 20+
- npm or pnpm
- Phantom wallet browser extension installed
- Rust backend running on port 3000

### Steps

```bash
# 1. Enter the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local if needed

# 4. Start the dev server
npm run dev
```

Visit `http://localhost:3001`.

---

## Authentication Flow

Authentication is non-custodial — the server never holds private keys.

```
1. User clicks "Connect Wallet"
   → Phantom popup #1: approve connection

2. Frontend builds a nonce message:
   "Sign this message to authenticate with Universal Learning Platform.
    Wallet: <address>
    Nonce: <timestamp>"

3. Phantom popup #2: sign message (no gas fee, no transaction)

4. POST /api/auth/signup { wallet_address, signed_message, signature }
   → Backend verifies ed25519 signature (handles Phantom's UTF-8 prefix)
   → New users: mints 20 COIN on-chain, creates DB records
   → Returns JWT

5. JWT stored in localStorage + cookie (for Next.js middleware)

6. Redirect to /dashboard/student
```

All auth state lives in `AuthContext` (`contexts/authContext.tsx`).  
Components call `useAuth()` — never interact with Phantom directly.

---

## Pages & Routes

| Route                                          | Description                                    | Cost     |
|------------------------------------------------|------------------------------------------------|----------|
| `/`                                            | Landing page                                   | —        |
| `/login`                                       | Phantom sign-in                                | —        |
| `/signup`                                      | Phantom registration + 20 COIN bonus           | —        |
| `/dashboard/student`                           | Dashboard — balance, stats, quick actions      | —        |
| `/dashboard/student/quiz`                      | AI quiz — Phantom burns 5 COIN on-chain        | −5 COIN  |
| `/dashboard/student/rank-papers-verified`      | Cambridge/Boards paper — Phantom burns 5 COIN  | −5 COIN  |
| `/dashboard/student/rank-papers-unverified`    | Community paper — Phantom burns 2 COIN         | −2 COIN  |
| `/dashboard/student/upload-paper-unverified`   | Upload past paper, earn COIN                   | +0–2 COIN|
| `/dashboard/student/my-wallet`                 | Balance, send COIN, transaction history        | —        |
| `/dashboard/student/buy-credits`               | Buy COIN packages                              | —        |
| `/dashboard/student/history`                   | Quiz + paper history                           | —        |
| `/dashboard/student/notifications`             | Transaction notifications                      | —        |
| `/dashboard/admin`                             | Admin dashboard                                | —        |

---

## COIN Token Flow

### Spending (Quiz / Paper)

```
1. burnCoins(amount, purpose) in use-solana-transaction.ts
   → GET /api/solana/blockhash  (fresh blockhash)
   → Build SPL burn instruction (user ATA → burn)
   → Phantom signs (popup)
   → POST /api/token/submit-signed-tx { signed_tx, tx_type: "burn", amount, purpose }
   → Backend submits to Solana RPC
   → Backend deducts from DB balance
   → Returns { new_balance }

2. POST /api/quiz/record or /api/paper/record
   → Saves history row to DB (no deduction — already burned)

Fallback (Phantom unavailable):
   → POST /api/quiz/generate or /api/paper/generate
   → Backend deducts from DB only (no on-chain burn)
```

### Sending COIN

```
1. POST /api/solana/prepare-transfer { recipient_wallet }
   → Backend creates recipient ATA if it doesn't exist (platform pays rent)
   → Returns { blockhash, recipient_ata }

2. Build SPL transferChecked instruction (sender ATA → recipient ATA)
   → Phantom signs

3. POST /api/token/submit-signed-tx { signed_tx, tx_type: "transfer", amount, recipient_wallet }
   → Backend submits to Solana RPC
   → Backend updates both DB balances
   → Returns { new_balance }

Fallback: POST /api/token/send (custodial — backend mints to recipient)
```

### Earning COIN

- **Signup bonus**: backend mints 20 COIN on-chain automatically
- **Upload reward**: backend mints floor(ai_score) COIN after AI scoring
- **Buy credits**: backend mints 5×USD COIN (PayPal placeholder)

---

## Key Components & Hooks

### `AuthContext` (`contexts/authContext.tsx`)

Single source of truth for auth state. Provides:

| Export            | Type       | Description                                    |
|-------------------|------------|------------------------------------------------|
| `user`            | `AuthUser` | Wallet address, balance, profile               |
| `isLoading`       | `boolean`  | True while restoring session on mount          |
| `isAuthenticating`| `boolean`  | True while Phantom popups are open             |
| `authError`       | `string`   | Last auth error message                        |
| `walletAddress`   | `string`   | Connected wallet public key                    |
| `connectAndLogin` | `function` | Full Phantom auth flow                         |
| `logout`          | `function` | Clear JWT + disconnect Phantom                 |
| `refreshBalance`  | `function` | Re-fetch balance from backend                  |
| `setBalance`      | `function` | Instant balance update without network call    |

### `useSolanaTransaction` (`hooks/use-solana-transaction.ts`)

Builds, signs, and submits SPL token transactions via Phantom.

| Export          | Description                                                  |
|-----------------|--------------------------------------------------------------|
| `burnCoins`     | Burns COIN from user's ATA — used for quiz/paper spends      |
| `transferCoins` | SPL transfer to recipient — used for peer sends              |
| `isProcessing`  | True while Phantom popup is open or tx is being submitted    |
| `txError`       | Last transaction error message                               |

### `QuizFlow` (`components/student/quiz-flow.tsx`)

Full quiz experience:
- Builder step: topic input, sends to AI
- Loading step: Phantom burn + AI fetch
- Quiz step: MCQ interface with timer and question map
- Review step: score, correct/incorrect breakdown

### `PaperResult` (`components/student/paper-result.tsx`)

Renders AI-generated paper with MCQs, short questions, and long questions.

---

## API Clients

### `lib/api/client.ts` — Rust Backend

```typescript
authApi.signup(params)       // POST /api/auth/signup
authApi.login(params)        // POST /api/auth/login
authApi.me()                 // GET  /api/auth/me

quizApi.generate(subject)    // POST /api/quiz/generate  (DB-only fallback)
quizApi.record(subject, n)   // POST /api/quiz/record    (after on-chain burn)
quizApi.submit(params)       // POST /api/quiz/submit
quizApi.history(limit, offset)

paperApi.generate(subject)           // POST /api/paper/generate
paperApi.generateUnverified(subject) // POST /api/paper/generate-unverified
paperApi.record(subject, n)          // POST /api/paper/record
paperApi.recordUnverified(subject, n)// POST /api/paper/record-unverified
paperApi.history(limit, offset)

tokenApi.balance()
tokenApi.send(params)
tokenApi.history(limit, offset)
tokenApi.buy(usd_amount)

uploadApi.submit(file)
uploadApi.status(id)
uploadApi.history(limit, offset)
```

### `lib/api/ai.ts` — HuggingFace AI Backend

Base URL: `https://ekrash1234-github-deploy-token.hf.space`

```typescript
verifiedApi.generateQuiz(query)          // POST /verified/generate-quiz
verifiedApi.generateCambridge(req)       // POST /verified/generate-paper/cambridge
verifiedApi.generateBoards(req)          // POST /verified/generate-paper/boards

unverifiedApi.getClasses()               // GET  /unverified/classes
unverifiedApi.generatePaper(req)         // POST /unverified/generate-paper
unverifiedApi.uploadPaper(file, ...)     // POST /unverified/upload-paper
```

**Quiz response shape:**
```json
{
  "mcqs": [
    {
      "id": 1,
      "prompt": "Which of the following is a fundamental SI unit?",
      "options": [
        { "id": "A", "label": "Meter" },
        { "id": "B", "label": "Newton" }
      ],
      "answer": "A"
    }
  ]
}
```

**Paper response shape:**
```json
{
  "mcqs": [...],
  "short_questions": [{ "id": 1, "question": "..." }],
  "long_questions":  [{ "id": 1, "question": "..." }]
}
```

---

## Styling

- **Tailwind CSS v4** with custom CSS properties for spacing (`--space-*`) and colors
- **Design tokens** defined in `globals.css` — light and dark mode
- **Color palette**: Navy primary (`#243a6d`), sky blue accent (`#3c9dff`), neutral backgrounds
- **Spacing scale**: `--space-2xs` through `--space-3xl` used via `var()` in className strings
- **Border radius**: `--radius` base with `--radius-2xl`, `--radius-3xl` variants
- **Sidebar**: deep navy (`#243a6d`) with white text, collapses to icon-only mode
