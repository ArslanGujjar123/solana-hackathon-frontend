const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Request failed");
  }

  return response.json() as Promise<T>;
}

export type StudentDashboardResponse = {
  header: { title: string; subtitle: string };
  stats: Array<{
    id: string;
    label: string;
    value: string;
    trend?: { label: string; tone: "positive" | "neutral" };
    icon: "papers" | "quizzes" | "score";
  }>;
  days: string[];
  charts: Array<{
    id: string;
    title: string;
    subtitle: string;
    trendLabel: string;
    linePath: string;
    areaPath: string;
    gradientId: string;
    tone: "chart-1" | "chart-2";
  }>;
};

export type StudentHistoryResponse = {
  header: { title: string; searchPlaceholder: string };
  table: {
    columns: string[];
    showingLabel: string;
    previousLabel: string;
    nextLabel: string;
  };
  items: Array<{
    id: string;
    type: "paper" | "quiz";
    grade: string;
    subject: string;
    questions: number;
  }>;
};

export type StudentWalletResponse = {
  header: { title: string };
  balance: { label: string; value: string; ctaLabel: string; bannerImageUrl: string };
  stats: Array<{ id: string; label: string; value: string }>;
  purchases: Array<{
    id: string;
    packageName: string;
    amountPkr: string;
    creditsAdded: string;
    date: string;
  }>;
};

export type StudentBuyCreditsResponse = {
  header: { title: string };
  info: { title: string; description: string };
  table: { columns: string[]; actionLabel: string };
  packages: Array<{
    id: string;
    name: string;
    pricePkr: string;
    credits: string;
    expires: string;
  }>;
};

export type StudentNotification = {
  id: string;
  type: "announcement" | "deadline" | "grade" | "message" | "system";
  title: string;
  message: string;
  fullContent?: string;
  timestamp: string;
  isRead: boolean;
  from?: string;
};

export type QuizOption = {
  id: string
  label: string
};
export type QuizQuestion = {
  id: string
  prompt: string
  options: QuizOption[]
};
export type StudentRankPapersResponse = Record<string, unknown>;

type QuizPayloadShape =
  | QuizQuestion[]
  | {
      answer?: string
      questions?: unknown
      quiz?: unknown
      data?: unknown
    }

const parseJsonSafely = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const extractJsonArrayString = (value: string): string | null => {
  const fencedMatch = value.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1];
  }

  const firstBracket = value.indexOf("[");
  const lastBracket = value.lastIndexOf("]");
  if (firstBracket >= 0 && lastBracket > firstBracket) {
    return value.slice(firstBracket, lastBracket + 1);
  }

  return null;
};

const normalizeQuizQuestions = (raw: unknown): QuizQuestion[] => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item, questionIndex) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const row = item as Record<string, unknown>;
      const prompt = String(
        row.prompt ?? row.question ?? row.title ?? row.text ?? ""
      ).trim();

      const rawOptions = Array.isArray(row.options)
        ? row.options
        : Array.isArray(row.choices)
          ? row.choices
          : Array.isArray(row.answers)
            ? row.answers
            : [];

      const options = rawOptions
        .map((option, optionIndex) => {
          if (typeof option === "string") {
            const label = option.trim();
            if (!label) {
              return null;
            }
            return {
              id: `${questionIndex + 1}-${optionIndex + 1}`,
              label,
            };
          }

          if (!option || typeof option !== "object") {
            return null;
          }

          const optionObject = option as Record<string, unknown>;
          const label = String(
            optionObject.label ??
              optionObject.text ??
              optionObject.option ??
              optionObject.value ??
              ""
          ).trim();
          if (!label) {
            return null;
          }
          const optionId = String(
            optionObject.id ??
              optionObject.key ??
              optionObject.value ??
              `${questionIndex + 1}-${optionIndex + 1}`
          );

          return {
            id: optionId,
            label,
          };
        })
        .filter((option): option is QuizOption => Boolean(option));

      if (!prompt || options.length === 0) {
        return null;
      }

      return {
        id: String(row.id ?? row.question_id ?? questionIndex + 1),
        prompt,
        options,
      };
    })
    .filter((question): question is QuizQuestion => Boolean(question));
};

const parseQuizQuestionsFromPayload = (payload: QuizPayloadShape): QuizQuestion[] => {
  if (Array.isArray(payload)) {
    return normalizeQuizQuestions(payload);
  }

  const structured = payload.questions ?? payload.quiz ?? payload.data;
  if (structured) {
    const normalized = normalizeQuizQuestions(structured);
    if (normalized.length > 0) {
      return normalized;
    }
  }

  const rawAnswer = typeof payload.answer === "string" ? payload.answer.trim() : "";
  if (!rawAnswer) {
    return [];
  }

  const directParsed = parseJsonSafely<unknown>(rawAnswer);
  if (directParsed) {
    const normalized = normalizeQuizQuestions(directParsed);
    if (normalized.length > 0) {
      return normalized;
    }
  }

  const extractedJson = extractJsonArrayString(rawAnswer);
  if (!extractedJson) {
    return [];
  }

  const extractedParsed = parseJsonSafely<unknown>(extractedJson);
  return normalizeQuizQuestions(extractedParsed);
};


export const studentApi = {
  getStudentDashboard: () => request<StudentDashboardResponse>("/student/dashboard"),
  getStudentHistory: () => request<StudentHistoryResponse>("/student/history"),
  getStudentWallet: () => request<StudentWalletResponse>("/student/wallet"),
  getStudentBuyCredits: () => request<StudentBuyCreditsResponse>("/student/buy-credits"),
  getStudentNotifications: () => request<{ notifications: StudentNotification[] }>("/student/notifications"),
  markNotificationRead: (id: string) => request<{ message: string }>(`/student/notifications/${id}/read`, { method: "POST" }),
  createStudentQuiz: async (query: string): Promise<QuizQuestion[]> => {
    const response = await request<QuizPayloadShape>("/ai/chat", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    return parseQuizQuestionsFromPayload(response);
  },
 getStudentRankPapers: () => request<StudentRankPapersResponse>("/student/rank-papers"),

};
