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
export type AdminDashboardResponse = {
  header: { title: string; subtitle: string };
  kpiCards: Array<{ id: string; title: string; value: string; trend: string; icon: string; tone: string; bg: string }>;
  growth: { summary: string; days: string[] };
  activityItems: Array<{ id: string; title: string; description: string; time: string; icon: string; tone: string }>;
  quickActions: Array<{ id: string; label: string; icon: string }>;
};

export type AdminUsersResponse = {
  users: Array<{
    id: number;
    displayId: string;
    name: string;
    email: string;
    role: string;
    status: string;
    blocked: boolean;
    joinDate: string;
    initials: string;
  }>;
};

export type AdminReportsResponse = {
  reports: Array<{
    id: string;
    name: string;
    subject: string;
    snippet: string;
    time: string;
    unread: boolean;
  }>;
};

export type AdminPapersResponse = {
  histogram: Array<{ year: number; count: number }>;
  recentPapers: Array<{ id: string; name: string; year: string; subject: string; grade: string }>;
  total: number;
};

export type AdminUploadDataResponse = {
  recentUploads: Array<{ id: string; name: string; time: string; board: string; status: string }>;
  stats: { totalMonthlyUploads: number; delta: string };
  metadata: {
    grades: string[];
    subjects: string[];
    boards: string[];
    paperTypes: string[];
  };
};

export const adminApi = {
    getAdminDashboard: () => request<AdminDashboardResponse>("/admin/dashboard"),
  getAdminUsers: (search?: string) =>
    request<AdminUsersResponse>(`/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  setAdminUserStatus: (id: number, disabled: boolean) =>
    request<{ message: string }>(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ disabled }),
    }),
  deleteAdminUser: (id: number) => request<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" }),
  getAdminReports: () => request<AdminReportsResponse>("/admin/reports"),
  getAdminPapers: () => request<AdminPapersResponse>("/admin/papers"),
  getAdminUploadData: () => request<AdminUploadDataResponse>("/admin/upload-papers"),
  uploadPaper: (payload: {
    grade: string;
    subject: string;
    board: string;
    paper_type: string;
    title: string;
    year: number;
  }) =>
    request<{ message: string }>("/admin/upload-papers", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};