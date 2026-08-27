import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  BadgeCheck,
  GitCompare,
  Lock,
  MessageCircleQuestion,
  MessagesSquare,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { EmptyState } from "@/components/common/EmptyState";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { ClinicCardSkeleton } from "@/components/clinics/ClinicCardSkeleton";
import { getClinicFacets, searchClinics } from "@/lib/clinics.functions";
import { getLandingOverview } from "@/lib/landing.functions";
import { journeySteps, trustStrip } from "@/components/landing/data";
import heroCouple from "@/assets/hero-couple.jpg.asset.json";

const TITLE = "Seedova — Find the IVF clinic that's right for you";
const DESCRIPTION =
  "Search verified IVF clinics across India, compare the information that matters and learn from anonymous patient experiences before you decide.";
const URL = "https://seedova.lovable.app/";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const overviewFn = useServerFn(getLandingOverview);
  const clinicsFn = useServerFn(searchClinics);
  const facetsFn = useServerFn(getClinicFacets);
  const [query, setQuery] = useState("");

  const overview = useQuery({ queryKey: ["landing-overview"], queryFn: () => overviewFn() });
  const clinics = useQuery({
    queryKey: ["landing-clinics"],
    queryFn: () => clinicsFn({ data: { page: 1, pageSize: 3, sort: "rating" } }),
  });
  const facets = useQuery({ queryKey: ["landing-facets"], queryFn: () => facetsFn() });

  const popular = (facets.data?.cities ?? []).slice(0, 5);

  const goSearch = (value: string) => {
    const q = value.trim();
    navigate({ to: "/find-clinics", search: q ? { q } : {} });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* ---------------- HERO ---------------- */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_85%_0%,var(--brand-purple-soft),transparent_60%)]"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-20 lg:pt-20">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-1.5 text-xs font-medium tracking-wide text-secondary-foreground shadow-[var(--shadow-soft)]">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden />
                Trusted. Verified. Patient-first.
              </span>

              <h1 className="mt-6 text-balance font-[family-name:var(--font-display)] text-[2.75rem] leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-[4.25rem]">
                Find the IVF clinic{" "}
                <span className="text-[color:var(--brand-purple)]">that's right for you.</span>
              </h1>

              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Search verified clinics, compare your options, and learn from anonymous patient
                experiences.
              </p>

              <form
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  goSearch(query);
                }}
                className="mt-8 flex items-center gap-2 rounded-[22px] border border-border/70 bg-card p-2 shadow-[var(--shadow-soft)] transition-shadow focus-within:shadow-[0_18px_50px_-20px_oklch(0.45_0.19_295_/_0.35)]"
              >
                <div className="relative min-w-0 flex-1">
                  <Search
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search by clinic, city or treatment"
                    placeholder="Search by clinic, city or treatment"
                    className="h-12 rounded-2xl border-0 bg-transparent pl-11 text-base shadow-none focus-visible:ring-0 sm:h-14"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 shrink-0 rounded-2xl px-6 transition-transform hover:-translate-y-0.5 sm:h-14"
                >
                  <Search className="h-4 w-4 sm:hidden" aria-hidden />
                  <span className="hidden sm:inline">Search</span>
                  <span className="sr-only sm:hidden">Search</span>
                </Button>
              </form>

              {popular.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">Popular searches:</span>
                  {popular.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => goSearch(city)}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <HeroImage />
          </div>
        </section>

        {/* ---------------- TRUST STRIP ---------------- */}
        <section aria-labelledby="trust-heading" className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
          <h2 id="trust-heading" className="sr-only">
            What Seedova gives you
          </h2>
          <div className="grid gap-px overflow-hidden rounded-[24px] border border-border/70 bg-border/60 shadow-[var(--shadow-soft)] sm:grid-cols-2 lg:grid-cols-4">
            {trustStrip.map((t) => (
              <div key={t.title} className="flex items-start gap-3 bg-card p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <t.icon className="h-4.5 w-4.5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- JOURNEY ---------------- */}
        <section aria-labelledby="journey-heading" className="border-y border-border/60 bg-secondary/40 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2
              id="journey-heading"
              className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground sm:text-4xl"
            >
              From search to decision.
            </h2>
            <div className="mt-10 -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-6 lg:gap-0">
              {journeySteps.map((s, i) => (
                <div
                  key={s.title}
                  className="group relative w-[70%] shrink-0 snap-start rounded-[20px] border border-border/70 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] sm:w-auto lg:rounded-none lg:border-0 lg:border-l lg:bg-transparent lg:px-5 lg:py-1 lg:hover:translate-y-0"
                >
                  <span className="font-mono-plex text-xs tracking-widest text-[color:var(--brand-purple)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <s.icon
                    className="mt-3 h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110"
                    aria-hidden
                  />
                  <h3 className="mt-3 text-base font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- CLINIC DISCOVERY ---------------- */}
        <section aria-labelledby="clinics-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
            <div className="min-w-0 max-w-xl">
              <h2
                id="clinics-heading"
                className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground sm:text-4xl"
              >
                Explore IVF clinics
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Discover clinics using transparent information that helps you compare your options.
              </p>
            </div>
            <Button asChild variant="ghost" className="shrink-0 rounded-xl">
              <Link to="/find-clinics">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-8">
            {clinics.isPending ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <ClinicCardSkeleton key={i} />
                ))}
              </div>
            ) : clinics.isError ? (
              <EmptyState
                icon={Sparkles}
                title="Clinics couldn't be loaded"
                description="Something went wrong while fetching clinic information. Please try again."
                action={
                  <Button variant="outline" onClick={() => clinics.refetch()}>
                    Try again
                  </Button>
                }
              />
            ) : (clinics.data?.items.length ?? 0) === 0 ? (
              <EmptyState
                icon={BadgeCheck}
                title="Clinic profiles are on the way"
                description="Clinic profiles will appear here once verified data is available."
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {clinics.data!.items.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    view="grid"
                    saved={false}
                    compared={false}
                    onToggleSave={() => navigate({ to: "/find-clinics", search: {} })}
                    onToggleCompare={() => navigate({ to: "/find-clinics", search: {} })}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---------------- REVIEWS ---------------- */}
        <section aria-labelledby="reviews-heading" className="border-y border-border/60 bg-secondary/40 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-xl">
              <h2
                id="reviews-heading"
                className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground sm:text-4xl"
              >
                Real experiences. No names attached.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Learn from anonymous patient experiences before making an important decision.
              </p>
            </div>

            <div className="mt-8">
              {overview.isPending ? (
                <div className="grid gap-5 md:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-40 animate-pulse rounded-[22px] border border-border/70 bg-card" />
                  ))}
                </div>
              ) : (overview.data?.stories.length ?? 0) === 0 ? (
                <EmptyState
                  icon={Quote}
                  title="No reviews published yet"
                  description="Anonymous patient experiences will appear here once they are shared and verified."
                />
              ) : (
                <div className="grid gap-5 md:grid-cols-3">
                  {overview.data!.stories.map((s) => (
                    <article
                      key={s.id}
                      className="rounded-[22px] border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]"
                    >
                      <div className="flex items-center gap-1 text-primary">
                        {Array.from({ length: s.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden />
                        ))}
                        <span className="sr-only">{s.rating} out of 5</span>
                      </div>
                      <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-foreground">{s.text}</p>
                      <p className="mt-4 text-xs text-muted-foreground">
                        {s.handle}
                        {s.context ? ` · ${s.context}` : ""}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8">
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/reviews">
                  Explore reviews <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ---------------- COMMUNITY ---------------- */}
        <section aria-labelledby="community-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="max-w-xl">
            <h2
              id="community-heading"
              className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground sm:text-4xl"
            >
              Questions are easier when you don't ask alone.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              Ask anonymously and learn from people going through the same journey.
            </p>
          </div>

          <div className="mt-8">
            {overview.isPending ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-[18px] border border-border/70 bg-card" />
                ))}
              </div>
            ) : (overview.data?.questions.length ?? 0) === 0 ? (
              <EmptyState
                icon={MessageCircleQuestion}
                title="No questions yet"
                description="Community questions and answers will appear here as members start the conversation."
              />
            ) : (
              <ul className="divide-y divide-border/70 overflow-hidden rounded-[22px] border border-border/70 bg-card">
                {overview.data!.questions.slice(0, 3).map((q) => (
                  <li key={q.id}>
                    <Link
                      to="/community"
                      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5 transition-colors hover:bg-secondary/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{q.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{q.tag}</p>
                      </div>
                      <span className="font-mono-plex shrink-0 text-xs text-muted-foreground">
                        {q.answers} {q.answers === 1 ? "reply" : "replies"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-8">
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/community">
                Explore community <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="overflow-hidden rounded-[28px] border border-border/70 bg-card px-6 py-14 text-center shadow-[var(--shadow-soft)] sm:px-10">
            <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-foreground sm:text-4xl">
              Choose your IVF clinic with confidence.
            </h2>
            <p className="font-mono-plex mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Search. Verify. Compare. Learn. Decide.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-2xl px-8 transition-transform hover:-translate-y-0.5">
              <Link to="/find-clinics">
                Find IVF clinics <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/** Hero visual — swap the asset pointer to replace the image without touching layout. */
function HeroImage() {
  return (
    <div className="animate-fade-in relative">
      <div
        aria-hidden
        className="absolute -inset-3 rounded-[36px] bg-[image:var(--gradient-primary)] opacity-[0.06]"
      />
      <img
        src={heroCouple.url}
        alt="A couple looking at a laptop together while researching fertility clinics at home"
        width={768}
        height={793}
        className="relative aspect-[4/3.6] w-full rounded-[28px] object-cover shadow-[0_30px_80px_-40px_oklch(0.3_0.02_161_/_0.55)] transition-transform duration-700 hover:scale-[1.01] lg:aspect-auto"
      />
    </div>
  );
}

export { Users, GitCompare, MessagesSquare, Lock };
