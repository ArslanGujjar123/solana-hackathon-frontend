import {
  Bell,
  ChevronRight,
  Download,
  Filter,
  Lock,
  LockOpen,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"

const users = [
  {
    id: "#UQ-9021",
    initials: "SM",
    initialsTone: "bg-blue-100 text-blue-600",
    name: "Sarah Miller",
    email: "sarah.m@edu.com",
    role: "Student",
    roleTone: "bg-muted text-muted-foreground",
    status: "Active",
    statusTone: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    joinDate: "Oct 12, 2023",
    blocked: false,
  },
  {
    id: "#UQ-8842",
    initials: "RK",
    initialsTone: "bg-purple-100 text-purple-600",
    name: "Robert K.",
    email: "robert.k@nextq.ai",
    role: "Instructor",
    roleTone: "bg-primary/10 text-primary",
    status: "Active",
    statusTone: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    joinDate: "Sep 28, 2023",
    blocked: false,
  },
  {
    id: "#UQ-7105",
    initials: "JD",
    initialsTone: "bg-muted text-muted-foreground",
    name: "James Dean",
    email: "jdean@gmail.com",
    role: "Student",
    roleTone: "bg-muted text-muted-foreground",
    status: "Blocked",
    statusTone: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    joinDate: "Aug 05, 2023",
    blocked: true,
  },
  {
    id: "#UQ-5561",
    initials: "LW",
    initialsTone: "bg-orange-100 text-orange-600",
    name: "Lucy Wang",
    email: "lucy.wang@outlook.com",
    role: "Student",
    roleTone: "bg-muted text-muted-foreground",
    status: "Active",
    statusTone: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    joinDate: "Jun 14, 2023",
    blocked: false,
  },
]

export default function AdminUsersPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="space-y-6">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight className="size-4 text-muted-foreground/70" />
            <span className="font-medium text-foreground">Users</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted">
              <span className="sr-only">Notifications</span>
              <Bell className="size-4" />
              <div className="absolute right-2 top-2 size-2 rounded-full border-2 border-card bg-red-500" />
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90">
              <Plus className="size-4" />
              Add New User
            </button>
          </div>
        </section>

        <section className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of all active learners and instructors on the NextQ platform.
          </p>
        </section>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-muted/50 p-4">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email or ID..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <Filter className="size-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <Download className="size-4" />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                      {user.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                            user.initialsTone
                          )}
                        >
                          {user.initials}
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "rounded px-2 py-1 text-xs font-semibold",
                          user.roleTone
                        )}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
                          user.statusTone
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            user.blocked ? "bg-red-500" : "bg-green-500"
                          )}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className={cn(
                            "rounded p-1.5 transition-all",
                            user.blocked
                              ? "text-primary hover:bg-primary/10"
                              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          )}
                          title={user.blocked ? "Unblock User" : "Block User"}
                        >
                          {user.blocked ? (
                            <LockOpen className="size-4" />
                          ) : (
                            <Lock className="size-4" />
                          )}
                        </button>
                        <button
                          className="rounded p-1.5 text-muted-foreground transition-all hover:bg-red-50 hover:text-red-500"
                          title="Delete User"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/50 px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">1</span> to{" "}
              <span className="font-bold text-foreground">4</span> of{" "}
              <span className="font-bold text-foreground">1,240</span> users
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button className="cursor-not-allowed rounded border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground">
                Previous
              </button>
              <button className="rounded border border-primary bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                1
              </button>
              <button className="rounded border border-border bg-card px-3 py-1 text-sm font-medium text-foreground hover:bg-muted">
                2
              </button>
              <button className="rounded border border-border bg-card px-3 py-1 text-sm font-medium text-foreground hover:bg-muted">
                3
              </button>
              <span className="px-2 text-muted-foreground">...</span>
              <button className="rounded border border-border bg-card px-3 py-1 text-sm font-medium text-foreground hover:bg-muted">
                124
              </button>
              <button className="rounded border border-border bg-card px-3 py-1 text-sm font-medium text-foreground hover:bg-muted">
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
