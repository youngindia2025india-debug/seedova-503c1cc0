import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { BadgeCheck, ChevronRight, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { searchDirectoryClinics } from "@/lib/directory.functions";

const clinicsSearchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  state: fallback(z.string(), "all").default("all"),
});

export const Route = createFileRoute("/clinics")({
  validateSearch: zodValidator(clinicsSearchSchema),
  head: () => ({
    meta: [
      { title: "Clinics Directory — Verified IVF Clinics in India | Seedova" },
      {
        name: "description",
        content:
          "Browse a simple, searchable directory of IVF and fertility clinics across India. Search by clinic name or state and see verified, ART-registered centres.",
      },
      { property: "og:title", content: "Clinics Directory — Verified IVF Clinics in India | Seedova" },
      {
        property: "og:description",
        content:
          "Browse a simple, searchable directory of IVF and fertility clinics across India. Search by clinic name or state.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ClinicsDirectoryPage,
});

function ClinicsDirectoryPage() {
  const { q, state } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [input, setInput] = useState(q);

  const { data, isLoading } = useQuery({
    queryKey: ["clinic-directory", q, state],
    queryFn: () => searchDirectoryClinics({ data: { query: q, state } }),
  });

  const submit = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, q: value.trim() }) });
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="max-w-xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold italic text-foreground sm:text-5xl">
          Clinics
        </h1>
        <p className="mt-3 text-muted-foreground">
          A simple directory of IVF and fertility clinics across India.
        </p>
      </header>

      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => {
              const value = e.target.value;
              setInput(value);
              // live search
              navigate({ search: (prev) => ({ ...prev, q: value.trim() }) });
            }}
            aria-label="Search clinics"
            placeholder="Search by clinic or state"
            className="h-13 rounded-2xl border-border/70 bg-card pl-11 pr-9 text-base shadow-[var(--shadow-soft)]"
          />
          {input ? (
            <button
              type="button"
              onClick={() => {
                setInput("");
                submit("");
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <Select
          value={state}
          onValueChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, state: value }) })
          }
        >
          <SelectTrigger
            aria-label="Filter by state"
            className="h-13 w-full rounded-2xl border-border/70 bg-card shadow-[var(--shadow-soft)] sm:w-56"
          >
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {(data?.states ?? []).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>

      <section aria-label="Clinic directory" className="mt-8">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            icon={Search}
            title={q || state !== "all" ? "No clinics match your search" : "No clinics listed yet"}
            description={
              q || state !== "all"
                ? "Try a different clinic name or clear the state filter."
                : "The clinic directory is being prepared. Please check back soon."
            }
          />
        ) : (
          <ul className="space-y-3">
            {data.items.map((clinic) => (
              <li key={clinic.id}>
                <Link
                  to="/clinics/$clinicId"
                  params={{ clinicId: clinic.id }}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_oklch(0.4_0.06_175_/_0.4)]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h2 className="truncate text-base font-semibold text-foreground">
                        {clinic.name}
                      </h2>
                      {clinic.isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          <BadgeCheck className="h-3 w-3" />
                          Verified
                        </span>
                      ) : null}
                    </div>
                    {clinic.artRegistered ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        ART Registered for IVF
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm text-muted-foreground">
                      State: {clinic.state}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
