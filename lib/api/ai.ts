/**
 * AI Backend API client — HuggingFace Space
 * Base: https://ekrash1234-github-deploy-token.hf.space
 *
 * Endpoints:
 *   POST /verified/generate-quiz          → VerifiedQuizResponse
 *   POST /verified/generate-paper/cambridge → VerifiedPaperResponse
 *   POST /verified/generate-paper/boards    → VerifiedPaperResponse
 *   POST /unverified/generate-paper         → UnverifiedPaperResponse
 *   POST /unverified/upload-paper           → UnverifiedUploadResponse
 *   GET  /unverified/classes                → UnverifiedClassesResponse
 */

const AI_BASE = "https://ekrash1234-github-deploy-token.hf.space";

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface MCQOption {
  id: string;
  label: string;
}

export interface MCQItem {
  id: number;
  prompt: string;
  options: MCQOption[];
  answer: string;
}

export interface ShortQuestion {
  id: number;
  question: string;
}

export interface LongQuestion {
  id: number;
  question: string;
}

/** Structured paper response from both verified and unverified endpoints. */
export interface PaperResponse {
  mcqs: MCQItem[];
  short_questions: ShortQuestion[];
  long_questions: LongQuestion[];
}

/** Verified quiz response — MCQs only. */
export interface QuizResponse {
  mcqs: MCQItem[];
}

/** Unverified classes response. */
export interface ClassEntry {
  country: string;
  class_name: string;
  subjects: string[];
}

export interface UnverifiedClassesResponse {
  classes: ClassEntry[];
}

/** Upload response. */
export interface UnverifiedUploadResponse {
  accepted: boolean;
  score: number;
  reason: string;
}

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

export class AiApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "AiApiError";
  }
}

async function aiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${AI_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      // FastAPI validation errors: { detail: [{msg, loc, type}] }
      if (Array.isArray(body?.detail)) {
        msg = body.detail.map((d: { msg: string }) => d.msg).join("; ");
      } else {
        msg = body?.detail ?? body?.message ?? msg;
      }
    } catch {
      // ignore
    }
    throw new AiApiError(res.status, msg);
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Verified endpoints
// ---------------------------------------------------------------------------

export interface VerifiedPaperRequest {
  class: string;
  subject: string;
  mcqs?: number;
  short_questions?: number;
  long_questions?: number;
  query: string;
}

export const verifiedApi = {
  /** POST /verified/generate-quiz — MCQs from curated data */
  generateQuiz(query: string): Promise<QuizResponse> {
    return aiFetch("/verified/generate-quiz", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
  },

  /** POST /verified/generate-paper/cambridge */
  generateCambridge(req: VerifiedPaperRequest): Promise<PaperResponse> {
    return aiFetch("/verified/generate-paper/cambridge", {
      method: "POST",
      body: JSON.stringify(req),
    });
  },

  /** POST /verified/generate-paper/boards */
  generateBoards(req: VerifiedPaperRequest): Promise<PaperResponse> {
    return aiFetch("/verified/generate-paper/boards", {
      method: "POST",
      body: JSON.stringify(req),
    });
  },
};

// ---------------------------------------------------------------------------
// Unverified endpoints
// ---------------------------------------------------------------------------

export interface UnverifiedPaperRequest {
  country: string;
  class: string;
  subject: string;
  mcqs?: number;
  short_questions?: number;
  long_questions?: number;
  query: string;
}

export const unverifiedApi = {
  /** GET /unverified/classes — available countries/classes/subjects */
  getClasses(): Promise<UnverifiedClassesResponse> {
    return aiFetch("/unverified/classes", { method: "GET" });
  },

  /** POST /unverified/generate-paper */
  generatePaper(req: UnverifiedPaperRequest): Promise<PaperResponse> {
    return aiFetch("/unverified/generate-paper", {
      method: "POST",
      body: JSON.stringify(req),
    });
  },

  /** POST /unverified/upload-paper — multipart/form-data */
  uploadPaper(
    file: File,
    country: string,
    className: string,
    subject: string
  ): Promise<UnverifiedUploadResponse> {
    const form = new FormData();
    form.append("file", file);
    form.append("country", country);
    form.append("class", className);
    form.append("subject", subject);

    return fetch(`${AI_BASE}/unverified/upload-paper`, {
      method: "POST",
      body: form,
      // Do NOT set Content-Type — browser sets it with boundary for FormData
    }).then(async (res) => {
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const body = await res.json();
          if (Array.isArray(body?.detail)) {
            msg = body.detail.map((d: { msg: string }) => d.msg).join("; ");
          } else {
            msg = body?.detail ?? msg;
          }
        } catch {
          // ignore
        }
        throw new AiApiError(res.status, msg);
      }
      return res.json() as Promise<UnverifiedUploadResponse>;
    });
  },
};
