import type { ComponentType } from "react"
import Link from "next/link"
import {
  Activity,
  CheckCircle2,
  LineChart,
  Rocket,
  Star,
  StarHalf,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NEXTQ_ABOUT,
  NEXTQ_ACTIONS,
  NEXTQ_BRAND,
  NEXTQ_CONTACT,
  NEXTQ_COPYRIGHT,
  NEXTQ_FEATURES,
  NEXTQ_FOOTER_LINKS,
  NEXTQ_HERO,
  NEXTQ_NAV_ITEMS,
  NEXTQ_PRICING_PLANS,
  NEXTQ_PRODUCTS,
  NEXTQ_SECTION_IDS,
  NEXTQ_SECTION_LABELS,
  NEXTQ_SOCIAL_LINKS,
  NEXTQ_TESTIMONIALS,
  type NextQFeature,
  type NextQTestimonial,
} from "@/constants/nextq-landing"

const FEATURE_ICONS: Record<NextQFeature["icon"], ComponentType<{ className?: string }>> = {
  analytics: LineChart,
  adaptive: Activity,
  community: Users,
}

function TestimonialRating({ rating }: { rating: NextQTestimonial["rating"] }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 !== 0

  return (
    <div className="flex items-center gap-[var(--space-2xs)] text-primary">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`star-${index}`} className="size-5 fill-primary" />
      ))}
      {hasHalf ? <StarHalf className="size-5 fill-primary" /> : null}
    </div>
  )
}

export default function NextQLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-[var(--space-xl)] py-[var(--space-sm)] md:px-[var(--space-2xl)]">
          <div className="flex items-center gap-[var(--space-sm)]">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <div className="size-3 rounded-full bg-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{NEXTQ_BRAND.name}</p>
              <p className="text-xs text-muted-foreground">{NEXTQ_BRAND.tagline}</p>
            </div>
          </div>
          <nav className="hidden items-center gap-[var(--space-lg)] text-sm md:flex">
            {NEXTQ_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-[var(--space-sm)]">
            <Button size="sm">
              {NEXTQ_ACTIONS.signUpLabel}
            </Button>
           <Link href="/login">
            <Button size="sm" variant="secondary">
             {NEXTQ_ACTIONS.loginLabel}
            </Button>
          </Link>
          </div>
        </div>
      </header>

      <main>
        <section
          className="relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${NEXTQ_HERO.backgroundImageUrl}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-background/60" />
          <div className="relative mx-auto flex min-h-[600px] w-full max-w-6xl flex-col justify-center gap-[var(--space-xl)] px-[var(--space-xl)] py-[var(--space-3xl)] md:px-[var(--space-2xl)]">
            <div className="flex max-w-2xl flex-col gap-[var(--space-md)]">
              <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
                {NEXTQ_HERO.title}{" "}
                <span className="text-primary">{NEXTQ_HERO.highlight}</span>{" "}
                {NEXTQ_HERO.titleSuffix}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {NEXTQ_HERO.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-[var(--space-sm)]">
              <Button size="lg">{NEXTQ_HERO.ctaLabel}</Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`#${NEXTQ_SECTION_IDS.pricing}`}>{NEXTQ_ACTIONS.viewPricingLabel}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id={NEXTQ_SECTION_IDS.products} className="bg-background py-[var(--space-3xl)]">
          <div className="mx-auto w-full max-w-6xl px-[var(--space-xl)] md:px-[var(--space-2xl)]">
            <div className="flex flex-col gap-[var(--space-md)]">
              <h2 className="text-3xl font-semibold">{NEXTQ_SECTION_LABELS.productsHeading}</h2>
              <p className="text-muted-foreground">{NEXTQ_SECTION_LABELS.productsSubheading}</p>
            </div>
            <div className="mt-[var(--space-xl)] grid gap-[var(--space-xl)] md:grid-cols-3">
              {NEXTQ_PRODUCTS.map((product) => (
                <article
                  key={product.title}
                  className="flex h-full flex-col gap-[var(--space-md)] rounded-2xl border border-border bg-card p-[var(--space-xl)] shadow-sm transition hover:shadow-md"
                >
                  <div
                    className="aspect-video w-full rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url("${product.imageUrl}")` }}
                  />
                  <div className="flex flex-col gap-[var(--space-2xs)]">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted py-[var(--space-3xl)]">
          <div className="mx-auto w-full max-w-4xl px-[var(--space-xl)] text-center md:px-[var(--space-2xl)]">
            <h2 className="text-3xl font-semibold">{NEXTQ_ABOUT.heading}</h2>
            <div className="prose prose-slate mx-auto mt-[var(--space-md)] text-muted-foreground">
              <p>{NEXTQ_ABOUT.description}</p>
            </div>
          </div>
        </section>

        <section id={NEXTQ_SECTION_IDS.features} className="bg-background py-[var(--space-3xl)]">
          <div className="mx-auto w-full max-w-6xl px-[var(--space-xl)] md:px-[var(--space-2xl)]">
            <div className="flex flex-col gap-[var(--space-sm)]">
              <h2 className="text-3xl font-semibold">{NEXTQ_SECTION_LABELS.featuresHeading}</h2>
              <p className="text-muted-foreground">{NEXTQ_SECTION_LABELS.featuresSubheading}</p>
            </div>
            <div className="mt-[var(--space-xl)] grid gap-[var(--space-lg)] md:grid-cols-3">
              {NEXTQ_FEATURES.map((feature) => {
                const Icon = FEATURE_ICONS[feature.icon]
                return (
                  <article
                    key={feature.title}
                    className="flex h-full flex-col gap-[var(--space-md)] rounded-2xl border border-border bg-card p-[var(--space-xl)] transition hover:border-primary"
                  >
                    <Icon className="size-8 text-primary" />
                    <div className="flex flex-col gap-[var(--space-2xs)]">
                      <h3 className="text-lg font-semibold">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section id={NEXTQ_SECTION_IDS.pricing} className="bg-muted py-[var(--space-3xl)]">
          <div className="mx-auto w-full max-w-6xl px-[var(--space-xl)] md:px-[var(--space-2xl)]">
            <h2 className="text-center text-3xl font-semibold">
              {NEXTQ_SECTION_LABELS.pricingHeading}
            </h2>
            <div className="mt-[var(--space-xl)] grid gap-[var(--space-xl)] md:grid-cols-3">
              {NEXTQ_PRICING_PLANS.map((plan) => (
                <article
                  key={plan.name}
                  className={`flex h-full flex-col gap-[var(--space-lg)] rounded-2xl border bg-card p-[var(--space-xl)] shadow-sm ${
                    plan.isPopular ? "border-primary shadow-md" : "border-border"
                  }`}
                >
                  <div className="flex flex-col gap-[var(--space-2xs)]">
                    {plan.isPopular ? (
                      <Badge className="w-fit bg-primary text-primary-foreground">
                        {NEXTQ_SECTION_LABELS.popularBadge}
                      </Badge>
                    ) : null}
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {plan.name}
                    </p>
                    <div className="flex items-baseline gap-[var(--space-2xs)]">
                      <span className="text-3xl font-semibold">{plan.price}</span>
                      {plan.period ? (
                        <span className="text-sm text-muted-foreground">{plan.period}</span>
                      ) : null}
                    </div>
                  </div>
                  <Button variant={plan.isPopular ? "default" : "secondary"}>
                    {plan.ctaLabel}
                  </Button>
                  <ul className="flex flex-col gap-[var(--space-sm)] text-sm text-muted-foreground">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-[var(--space-sm)]">
                        <CheckCircle2 className="mt-[var(--space-2xs)] size-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id={NEXTQ_SECTION_IDS.testimonials} className="bg-background py-[var(--space-3xl)]">
          <div className="mx-auto w-full max-w-6xl px-[var(--space-xl)] md:px-[var(--space-2xl)]">
            <h2 className="text-3xl font-semibold">{NEXTQ_SECTION_LABELS.testimonialsHeading}</h2>
            <div className="mt-[var(--space-xl)] grid gap-[var(--space-xl)] md:grid-cols-3">
              {NEXTQ_TESTIMONIALS.map((testimonial) => (
                <article
                  key={testimonial.name}
                  className="flex h-full flex-col gap-[var(--space-lg)] rounded-2xl border border-border bg-muted p-[var(--space-xl)]"
                >
                  <div className="flex items-center gap-[var(--space-md)]">
                    <div
                      className="size-12 rounded-full border border-background bg-cover bg-center shadow-sm"
                      style={{ backgroundImage: `url("${testimonial.avatarUrl}")` }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <TestimonialRating rating={testimonial.rating} />
                  <p className="text-sm italic text-muted-foreground">"{testimonial.quote}"</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id={NEXTQ_SECTION_IDS.contact} className="bg-muted py-[var(--space-3xl)]">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-[var(--space-xl)] px-[var(--space-xl)] md:flex-row md:items-center md:px-[var(--space-2xl)]">
            <div className="flex flex-1 flex-col gap-[var(--space-md)]">
              <h2 className="text-3xl font-semibold">{NEXTQ_CONTACT.heading}</h2>
              <p className="text-muted-foreground">{NEXTQ_CONTACT.description}</p>
              <div className="flex flex-col gap-[var(--space-sm)]">
                <div className="flex flex-col gap-[var(--space-sm)] md:flex-row">
                  <Input
                    type="email"
                    placeholder={NEXTQ_CONTACT.inputPlaceholder}
                    aria-label={NEXTQ_CONTACT.inputPlaceholder}
                    className="h-11"
                  />
                  <Button className="h-11">{NEXTQ_CONTACT.ctaLabel}</Button>
                </div>
                <p className="text-xs text-muted-foreground">{NEXTQ_CONTACT.helperText}</p>
              </div>
            </div>
            <div className="hidden flex-1 items-center justify-center md:flex">
              <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-accent/20">
                <Rocket className="size-24 text-primary/40" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-[var(--space-3xl)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-[var(--space-xl)] px-[var(--space-xl)] md:px-[var(--space-2xl)]">
          <div className="flex flex-wrap justify-center gap-[var(--space-lg)] text-sm text-muted-foreground">
            {NEXTQ_FOOTER_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-[var(--space-md)] text-muted-foreground">
            {NEXTQ_SOCIAL_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-primary">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{NEXTQ_COPYRIGHT}</p>
        </div>
      </footer>
    </div>
  )
}



