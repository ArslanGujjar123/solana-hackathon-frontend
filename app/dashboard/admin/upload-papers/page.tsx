import {
  Activity,
  FileText,
  History,
  TrendingUp,
  UploadCloud,
} from "lucide-react"

const recentUploads = [
  {
    id: "math",
    name: "Math_Annual_G9_2023.pdf",
    time: "2 mins ago",
    board: "FBISE",
    status: "Completed",
    statusTone: "text-emerald-600",
    statusDot: "bg-emerald-500",
  },
  {
    id: "physics",
    name: "Physics_Mock_G10.pdf",
    time: "45 mins ago",
    board: "BISE Lahore",
    status: "Completed",
    statusTone: "text-emerald-600",
    statusDot: "bg-emerald-500",
  },
  {
    id: "chem",
    name: "Chem_Supp_G12_Final.pdf",
    time: "1 hour ago",
    board: "FBISE",
    status: "Processing",
    statusTone: "text-amber-600",
    statusDot: "bg-amber-500",
  },
  {
    id: "bio",
    name: "Bio_Model_2024.pdf",
    time: "3 hours ago",
    board: "BISE Karachi",
    status: "Completed",
    statusTone: "text-emerald-600",
    statusDot: "bg-emerald-500",
  },
]

export default function AdminUploadPapersPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
        <section className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Upload New Paper
            </h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Fill in the metadata and upload the educational paper PDF.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
                <FileText className="size-5 text-primary" />
                Paper Metadata
              </h2>
            </div>
            <form className="space-y-8 p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Class / Grade
                  </label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option>Select Grade</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                    <option>Grade 11 (First Year)</option>
                    <option>Grade 12 (Second Year)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Subject
                  </label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option>Select Subject</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Biology</option>
                    <option>Computer Science</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Board
                  </label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option>Select Board</option>
                    <option>FBISE (Federal Board)</option>
                    <option>BISE Lahore</option>
                    <option>BISE Karachi</option>
                    <option>Cambridge O-Level</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Paper Type
                  </label>
                  <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option>Select Type</option>
                    <option>Annual Examination</option>
                    <option>Supplementary Examination</option>
                    <option>Mock Paper</option>
                    <option>Model Paper</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">
                  Upload PDF File
                </label>
                <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center transition-all hover:border-primary/50 hover:bg-primary/5">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-card text-primary shadow-sm transition-transform group-hover:scale-110">
                    <UploadCloud className="size-8" />
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    Drag and drop PDF here
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    or click to browse from your computer
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-6 py-2.5 text-sm font-bold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                    <UploadCloud className="size-4" />
                    Browse Files
                  </span>
                  <p className="mt-4 text-xs italic text-muted-foreground">
                    Supported format: PDF (Max size: 25MB)
                  </p>
                  <input type="file" className="hidden" accept="application/pdf" />
                </label>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  type="submit"
                  className="flex min-w-[240px] items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  <UploadCloud className="size-5" />
                  Upload Paper
                </button>
              </div>
            </form>
          </div>
        </section>

        <aside className="w-full space-y-6 lg:w-80">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 text-base font-bold text-foreground">
              <History className="size-5 text-primary" />
              Recent Uploads
            </h3>
            <div className="space-y-5">
              {recentUploads.map((upload) => (
                <div key={upload.id} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {upload.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {upload.time} • {upload.board}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={`size-2 rounded-full ${upload.statusDot}`}
                      />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${upload.statusTone}`}
                      >
                        {upload.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 w-full rounded-lg py-2 text-xs font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary/5">
              View All Activity
            </button>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/30">
            <Activity className="absolute -bottom-4 -right-4 size-20 text-white/10 transition-transform group-hover:scale-110" />
            <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/80">
              Total Monthly Uploads
            </p>
            <h4 className="mt-2 text-3xl font-black">1,284</h4>
            <div className="mt-4 flex items-center gap-1 text-emerald-300">
              <TrendingUp className="size-4" />
              <span className="text-xs font-bold">+12% from last month</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
