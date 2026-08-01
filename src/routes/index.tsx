import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star, BadgeCheck, MapPin, IndianRupee, TrendingUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { SearchSection } from "@/components/landing/SearchSection";
import {
  metrics,
  whySeedova,
  steps,
  featuredClinics,
  stories,
  communityQuestions,
} from "@/components/landing/data";
import heroImage from "@/assets/hero-ivf.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seedova — Find the Right IVF Clinic with Confidence" },
      {
        name: "description",
        content:
          "Compare IVF clinics across India, explore transparent treatment costs and success rates, and learn from anonymous patient experiences.",
      },
      { property: "og:title", content: "Seedova — Find the Right IVF Clinic with Confidence" },
      {
        property: "og:description",
        content:
          "Compare IVF clinics across India, explore transparent treatment information and read anonymous patient experiences.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://seedova.lovable.app/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://seedova.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Seedova",
          url: "https://seedova.lovable.app/",
          description:
            "Discover and compare IVF clinics in India with transparent information and anonymous patient experiences.",
        }),
      },
    ],
  }),
  component: HomePage,
});

function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`h-3.5 w-3.5 ${i <= Math.round(value) ? "fill-accent text-accent" : "text-border"}`}
        />
      ))}
    </span>
  );
}

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-70"
            style={{
              background:
                "radial-gradient(1100px 420px at 50% -120px, oklch(0.95 0.03 175 / 0.9), transparent 70%)",
            }}
          />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-14 sm:px-6 sm:pt-24 lg:grid-cols-2">
            <div className="animate-fade-in text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> India's trusted IVF community
              </span>
              <h1
                id="hero-heading"
                className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                Find the Right IVF Clinic with Confidence
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg lg:mx-0">
                Compare IVF clinics, explore transparent treatment information, and learn from
                anonymous patient experiences.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Button asChild size="lg" className="transition-transform hover:-translate-y-0.5">
                  <a href="#find-clinics">
                    Explore Clinics <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="transition-transform hover:-translate-y-0.5">
                  <Link to="/community">Join Community</Link>
                </Button>
              </div>
            </div>
            <div className="animate-scale-in">
              <img
                src={heroImage}
                alt="Illustration of a couple supported by fertility care, with a growing seedling"
                width={1200}
                height={1008}
                className="mx-auto w-full max-w-lg rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]"
              />
            </div>
          </div>
        </section>

        <SearchSection />

        {/* Trust metrics */}
        <section aria-labelledby="metrics-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 id="metrics-heading" className="sr-only">
            Seedova in numbers
          </h2>
          <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col-reverse rounded-2xl border border-border bg-card p-6 text-center shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-1"
              >
                <dt className="mt-1 text-xs text-muted-foreground sm:text-sm">{m.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl">{m.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Why Seedova */}
        <section id="about" aria-labelledby="why-heading" className="bg-secondary/40 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 id="why-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Why Seedova
              </h2>
              <p className="mt-3 text-muted-foreground">
                A calmer, clearer way to navigate fertility treatment in India.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {whySeedova.map((f) => (
                <article
                  key={f.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                    <f.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-heading" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 id="how-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <ol className="relative mt-10 space-y-8 border-l border-border pl-8">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute -left-[3.05rem] grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-primary shadow-[var(--shadow-soft)]">
                  <s.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Featured clinics */}
        <section aria-labelledby="clinics-heading" className="bg-secondary/40 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 id="clinics-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Featured IVF clinics
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Sample listings showing the information you'll see on every clinic profile.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredClinics.map((c) => (
                <article
                  key={c.name}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <div
                    className="grid h-36 place-items-center"
                    style={{ background: "var(--gradient-primary)" }}
                    aria-hidden="true"
                  >
                    <span className="text-3xl font-semibold text-primary-foreground/90">
                      {c.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-base font-semibold text-foreground">{c.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {c.city}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-secondary px-3 py-2">
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <IndianRupee className="h-3 w-3" aria-hidden="true" /> Est. cost
                        </p>
                        <p className="mt-0.5 font-semibold text-foreground">{c.cost}</p>
                      </div>
                      <div className="rounded-xl bg-secondary px-3 py-2">
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp className="h-3 w-3" aria-hidden="true" /> Success rate
                        </p>
                        <p className="mt-0.5 font-semibold text-foreground">{c.success}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <Rating value={c.rating} />
                      <span className="text-xs text-muted-foreground">
                        {c.rating} · {c.reviews} reviews
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
                    <Button asChild variant="outline" className="mt-5 w-full">
                      <a href="#find-clinics" aria-label={`View details for ${c.name}`}>
                        View Details
                      </a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Patient stories */}
        <section aria-labelledby="stories-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <h2 id="stories-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Anonymous patient stories
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Real-world style experiences shared without names, photos or identities.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {stories.map((s) => (
              <figure
                key={s.text}
                className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{s.handle}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.treatment} · {s.city}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 gap-1">
                    <BadgeCheck className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> Verified
                  </Badge>
                </div>
                <div className="mt-3">
                  <Rating value={s.rating} />
                </div>
                <blockquote className="mt-3 flex-1 text-sm text-muted-foreground">“{s.text}”</blockquote>
              </figure>
            ))}
          </div>
        </section>

        {/* Community preview */}
        <section aria-labelledby="community-heading" className="bg-secondary/40 py-16 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 id="community-heading" className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              From the community
            </h2>
            <p className="mt-3 text-muted-foreground">Latest anonymous questions from patients like you.</p>
            {isPending ? (
              <ul className="mt-8 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i}>
                    <Skeleton className="h-[4.5rem] w-full rounded-2xl" />
                  </li>
                ))}
              </ul>
            ) : questions.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  icon={MessageCircle}
                  title="No questions yet"
                  description="Be the first to ask something anonymously — the community is just getting started."
                />
              </div>
            ) : (
              <ul className="mt-8 space-y-3">
                {questions.map((q) => (
                  <li key={q.id}>
                    <Link
                      to="/community"
                      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-colors hover:bg-card/80"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">{q.title}</span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {q.tag} · {q.answers} answers
                        </span>
                      </span>
                      <MessageCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/community">View Community</Link>
              </Button>
            </div>
          </div>
        </section>


        {/* CTA */}
        <section aria-labelledby="cta-heading" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div
            className="rounded-3xl px-6 py-14 text-center shadow-[var(--shadow-soft)]"
            style={{ background: "var(--gradient-primary)" }}
          >
            <h2
              id="cta-heading"
              className="text-balance text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl"
            >
              Start Your Fertility Journey with Confidence
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <a href="#find-clinics">Find Clinics</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-primary-foreground">
                <Link to="/community">Join Community</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
