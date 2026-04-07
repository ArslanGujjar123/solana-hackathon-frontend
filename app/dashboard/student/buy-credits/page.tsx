import { Button } from "@/components/ui/button"
import {
  BUY_CREDITS_HEADER,
  BUY_CREDITS_INFO,
  BUY_CREDITS_PACKAGES,
  BUY_CREDITS_TABLE,
} from "@/constants/student-buy-credits"

export default function StudentBuyCreditsPage() {
  return (
    <div className="flex flex-col gap-[var(--space-lg)]">
      <header className="flex flex-wrap items-center justify-between gap-[var(--space-sm)]">
        <h1 className="text-3xl font-semibold text-foreground">
          {BUY_CREDITS_HEADER.title}
        </h1>
      </header>

      <section className="rounded-2xl border border-border bg-card p-[var(--space-lg)] shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">
          {BUY_CREDITS_INFO.title}
        </h2>
        <p className="mt-[var(--space-xs)] text-sm text-muted-foreground md:text-base">
          {BUY_CREDITS_INFO.description}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm @container">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-[var(--space-lg)] py-[var(--space-md)]">
                  {BUY_CREDITS_TABLE.columns[0]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)]">
                  {BUY_CREDITS_TABLE.columns[1]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)]">
                  {BUY_CREDITS_TABLE.columns[2]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)]">
                  {BUY_CREDITS_TABLE.columns[3]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)]">
                  {BUY_CREDITS_TABLE.columns[4]}
                </th>
                <th className="px-[var(--space-lg)] py-[var(--space-md)] text-right">
                  {BUY_CREDITS_TABLE.columns[5]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BUY_CREDITS_PACKAGES.map((pkg) => (
                <tr key={pkg.id} className="transition hover:bg-muted/40">
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] font-medium text-foreground">
                    {pkg.id}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] font-medium text-foreground">
                    {pkg.name}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-foreground">
                    {pkg.pricePkr}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-foreground">
                    {pkg.credits}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-muted-foreground">
                    {pkg.expires}
                  </td>
                  <td className="px-[var(--space-lg)] py-[var(--space-md)] text-right">
                    <Button>{BUY_CREDITS_TABLE.actionLabel}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
