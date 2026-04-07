import { Button } from "@/components/ui/button"
import {
  STUDENT_WALLET_BALANCE,
  STUDENT_WALLET_HEADER,
  STUDENT_WALLET_PURCHASES,
  STUDENT_WALLET_STATS,
} from "@/constants/student-wallet"

export default function StudentWalletPage() {
  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <header className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]">
        <h1 className="text-3xl font-semibold text-foreground">
          {STUDENT_WALLET_HEADER.title}
        </h1>
      </header>

      <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
        <div className="flex flex-col gap-[var(--space-lg)] md:flex-row md:items-stretch">
          <div className="flex flex-1 flex-col justify-center gap-[var(--space-sm)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {STUDENT_WALLET_BALANCE.label}
            </p>
            <p className="text-3xl font-semibold text-foreground md:text-4xl">
              {STUDENT_WALLET_BALANCE.value}
            </p>
            <div className="pt-[var(--space-sm)]">
              <Button className="min-w-[120px]">{STUDENT_WALLET_BALANCE.ctaLabel}</Button>
            </div>
          </div>
          <div
            className="aspect-video w-full flex-1 rounded-xl border border-border bg-cover bg-center"
            style={{ backgroundImage: `url("${STUDENT_WALLET_BALANCE.bannerImageUrl}")` }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-[var(--space-md)]">
        <h2 className="text-xl font-semibold text-foreground">Wallet Statistics</h2>
        <div className="grid gap-[var(--space-md)] md:grid-cols-2">
          {STUDENT_WALLET_STATS.map((stat) => (
            <div
              key={stat.id}
              className="rounded-xl border border-border bg-card p-[var(--space-lg)] shadow-sm"
            >
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-[var(--space-2xs)] text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-[var(--space-md)]">
        <h2 className="text-xl font-semibold text-foreground">Previous Purchases</h2>
        <div className="rounded-2xl border border-border bg-card shadow-sm @container">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-muted/40 text-xs font-semibold text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] @[max-width:120px]:hidden">
                    Purchase ID
                  </th>
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] @[max-width:240px]:hidden">
                    Package Name
                  </th>
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] @[max-width:360px]:hidden">
                    Amount (PKR)
                  </th>
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] @[max-width:480px]:hidden">
                    Credits Added
                  </th>
                  <th className="px-[var(--space-md)] py-[var(--space-sm)] @[max-width:600px]:hidden">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {STUDENT_WALLET_PURCHASES.map((purchase) => (
                  <tr key={purchase.id} className="transition hover:bg-muted/40">
                    <td className="px-[var(--space-md)] py-[var(--space-sm)] font-medium text-foreground @[max-width:120px]:hidden">
                      {purchase.id}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-sm)] text-muted-foreground @[max-width:240px]:hidden">
                      {purchase.packageName}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-sm)] text-muted-foreground @[max-width:360px]:hidden">
                      {purchase.amountPkr}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-sm)] text-muted-foreground @[max-width:480px]:hidden">
                      {purchase.creditsAdded}
                    </td>
                    <td className="px-[var(--space-md)] py-[var(--space-sm)] text-muted-foreground @[max-width:600px]:hidden">
                      {purchase.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
