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
        <h1 className="text-3xl font-semibold text-foreground">{BUY_CREDITS_HEADER.title}</h1>
      </header>

      <section className="rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm">
        <h2 className="text-xl font-semibold text-foreground">{BUY_CREDITS_INFO.title}</h2>
        <p className="mt-[var(--space-xs)] text-sm text-muted-foreground md:text-base">
          {BUY_CREDITS_INFO.description}
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-card shadow-sm @container">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/40 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <tr className="border-b border-border">
                {BUY_CREDITS_TABLE.columns.map((column) => (
                  <th
                    key={column}
                    className={
                      column === "Action"
                        ? "px-[var(--space-md)] py-[var(--space-sm)] text-right"
                        : "px-[var(--space-md)] py-[var(--space-sm)]"
                    }
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {BUY_CREDITS_PACKAGES.map((creditPackage) => (
                <tr key={creditPackage.id} className="transition hover:bg-muted/40">
                  <td className="px-[var(--space-md)] py-[var(--space-sm)] font-medium text-foreground">
                    {creditPackage.id}
                  </td>
                  <td className="px-[var(--space-md)] py-[var(--space-sm)] text-foreground">
                    {creditPackage.name}
                  </td>
                  <td className="px-[var(--space-md)] py-[var(--space-sm)] text-muted-foreground">
                    {creditPackage.pricePkr}
                  </td>
                  <td className="px-[var(--space-md)] py-[var(--space-sm)] text-muted-foreground">
                    {creditPackage.credits}
                  </td>
                  <td className="px-[var(--space-md)] py-[var(--space-sm)] text-muted-foreground">
                    {creditPackage.expires}
                  </td>
                  <td className="px-[var(--space-md)] py-[var(--space-sm)] text-right">
                    <Button className="min-w-[110px]">{BUY_CREDITS_TABLE.actionLabel}</Button>
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
