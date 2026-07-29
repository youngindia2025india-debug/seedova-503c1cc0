import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, Users, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Seedova — Discover trusted IVF clinics in India" },
      {
        name: "description",
        content:
          "Compare IVF clinics, read anonymous patient experiences and privately track your treatment journey with Seedova.",
      },
      { property: "og:title", content: "Seedova — Discover trusted IVF clinics in India" },
      {
        property: "og:description",
        content:
          "Compare IVF clinics, read anonymous patient experiences and privately track your treatment journey with Seedova.",
      },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: Search, title: "Discover clinics", body: "Find IVF clinics near you with verified details, images and services." },
  { icon: Users, title: "Anonymous community", body: "Ask questions and read real experiences from patients — always anonymous." },
  { icon: RouteIcon, title: "Track your journey", body: "Log each stage of your IVF journey privately, only you can see it." },
  { icon: ShieldCheck, title: "Privacy first", body: "Row-level security, verified reviews and optional identity — you stay in control." },
];

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-70"
            style={{
              background:
                "radial-gradient(1200px 400px at 50% -100px, oklch(0.95 0.03 175 / 0.9), transparent 70%)",
            }}
          />
          <div className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> India's trusted IVF community
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Choose your IVF clinic with confidence.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Seedova helps you discover clinics, compare options, read anonymous patient stories
              and privately track every step of your treatment journey.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Get started free <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/community">Explore community</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
