import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Quote, Star } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { getLandingOverview } from "@/lib/landing.functions";

const TITLE = "Anonymous IVF patient reviews — Seedova";
const DESCRIPTION =
  "Read anonymous experiences from IVF patients in India. Real experiences, no names attached.";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const overviewFn = useServerFn(getLandingOverview);
  const overview = useQuery({ queryKey: ["landing-overview"], queryFn: () => overviewFn() });
  const stories = overview.data?.stories ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-14 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground">
          Real experiences. No names attached.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Learn from anonymous patient experiences before making an important decision.
        </p>

        <div className="mt-10">
          {overview.isPending ? (
            <div className="grid gap-5 md:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-40 animate-pulse rounded-[22px] border border-border/70 bg-card" />
              ))}
            </div>
          ) : overview.isError ? (
            <EmptyState
              icon={Quote}
              title="Reviews couldn't be loaded"
              description="Something went wrong. Please try again."
              action={
                <Button variant="outline" onClick={() => overview.refetch()}>
                  Try again
                </Button>
              }
            />
          ) : stories.length === 0 ? (
            <EmptyState
              icon={Quote}
              title="No reviews published yet"
              description="Anonymous patient experiences will appear here once they are shared and verified."
              action={
                <Button asChild variant="outline">
                  <Link to="/find-clinics">Explore clinics</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {stories.map((s) => (
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
                  <p className="mt-4 text-sm leading-relaxed text-foreground">{s.text}</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    {s.handle}
                    {s.context ? ` · ${s.context}` : ""}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
