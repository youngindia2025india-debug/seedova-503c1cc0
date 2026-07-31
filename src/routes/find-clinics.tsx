import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, LayoutGrid, Rows3, SlidersHorizontal, SearchX } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { ClinicCardSkeleton } from "@/components/clinics/ClinicCardSkeleton";
import { ClinicFilters } from "@/components/clinics/ClinicFilters";
import { ClinicSearchBar } from "@/components/clinics/ClinicSearchBar";
import { CompareBar } from "@/components/clinics/CompareBar";
import {
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  activeFilterCount,
  clinics,
  filterClinics,
  sortClinics,
  type Clinic,
  type ClinicFilterState,
  type SortKey,
} from "@/components/clinics/data";
import { toast } from "sonner";

const TITLE = "Find IVF Clinics in India — Compare Cost & Success Rates | Seedova";
const DESCRIPTION =
  "Search and compare verified IVF clinics across India by city, treatment, cost, success rate and patient rating. Save favourites and compare up to three clinics side by side.";
const URL = "https://seedova.lovable.app/find-clinics";

export const Route = createFileRoute("/find-clinics")({
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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "IVF clinics in India",
          description: DESCRIPTION,
          url: URL,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: clinics.slice(0, 10).map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "MedicalClinic",
                name: c.name,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: c.city,
                  addressRegion: c.state,
                  addressCountry: "IN",
                },
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: c.rating,
                  reviewCount: c.reviews,
                },
              },
            })),
          },
        }),
      },
    ],
  }),
  component: FindClinicsPage,
});

const PAGE_SIZE = 6;
const MAX_COMPARE = 3;

function FindClinicsPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [filters, setFilters] = useState<ClinicFilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("rating");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [submitted, filters, sort]);

  useEffect(() => {
    setPage(1);
  }, [submitted, filters, sort]);

  const results = useMemo(
    () => sortClinics(filterClinics(clinics, submitted, filters), sort),
    [submitted, filters, sort],
  );

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const filterCount = activeFilterCount(filters);

  const toggleSave = (clinic: Clinic) => {
    const isSaved = saved.includes(clinic.id);
    setSaved(isSaved ? saved.filter((id) => id !== clinic.id) : [...saved, clinic.id]);
    if (isSaved) toast.success(`Removed ${clinic.name}`);
    else
      toast.success(`Saved ${clinic.name}`, {
        description: "Find it later in your saved clinics.",
      });
  };

  const toggleCompare = (clinic: Clinic) => {
    if (compare.includes(clinic.id)) {
      setCompare(compare.filter((id) => id !== clinic.id));
      return;
    }
    if (compare.length >= MAX_COMPARE) {
      toast.warning("You can compare up to 3 clinics", {
        description: "Remove one from the comparison bar to add another.",
      });
      return;
    }
    setCompare([...compare, clinic.id]);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.info("Filters reset");
  };

  const filterPanel = (onApply?: () => void) => (
    <ClinicFilters
      filters={filters}
      onChange={setFilters}
      onReset={resetFilters}
      onApply={onApply}
      resultCount={results.length}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 pb-28">
        {/* Hero search */}
        <section className="relative overflow-hidden border-b border-border/60 bg-secondary/40">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[image:var(--gradient-primary)] opacity-15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-[image:var(--gradient-primary)] opacity-10 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
            <Badge variant="secondary" className="rounded-full bg-card px-3 py-1 text-xs">
              {clinics.length} verified clinics · transparent pricing
            </Badge>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Find the right IVF clinic,
              <span className="block bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                with nothing hidden.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Compare real cost ranges, success rates and patient ratings across India — then shortlist
              the clinics that fit your journey.
            </p>
            <div className="mt-8 max-w-3xl">
              <ClinicSearchBar query={query} onQueryChange={setQuery} onSubmit={setSubmitted} />
            </div>
          </div>
        </section>

        {/* Sticky compact search */}
        <div className="sticky top-16 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <ClinicSearchBar query={query} onQueryChange={setQuery} onSubmit={setSubmitted} sticky />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          {/* Desktop / tablet sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-36 rounded-[24px] border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
              {filterPanel()}
            </div>
          </aside>

          <section aria-labelledby="results-heading">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
              <div className="min-w-0">
                <h2 id="results-heading" className="truncate text-lg font-semibold tracking-tight">
                  {results.length} clinics {submitted ? `for “${submitted}”` : "available"}
                </h2>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-11 rounded-xl lg:hidden">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {filterCount > 0 ? (
                        <span className="ml-2 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
                          {filterCount}
                        </span>
                      ) : null}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="max-h-[85vh] overflow-y-auto rounded-t-[24px] sm:max-w-none"
                  >
                    <SheetHeader className="text-left">
                      <SheetTitle>Refine your search</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">{filterPanel(() => setDrawerOpen(false))}</div>
                  </SheetContent>
                </Sheet>

                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="h-11 w-[9.5rem] rounded-xl" aria-label="Sort clinics">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden items-center rounded-xl border border-border bg-card p-1 sm:flex">
                  <button
                    type="button"
                    aria-label="Grid view"
                    aria-pressed={view === "grid"}
                    onClick={() => setView("grid")}
                    className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                      view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="List view"
                    aria-pressed={view === "list"}
                    onClick={() => setView("list")}
                    className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${
                      view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Rows3 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {error ? (
                <div className="rounded-[24px] border border-destructive/30 bg-card p-10 text-center shadow-[var(--shadow-soft)]">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">We couldn't load clinics</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Something went wrong on our end. Please try again.
                  </p>
                  <Button className="mt-5 h-11 rounded-xl" onClick={() => setError(false)}>
                    Retry
                  </Button>
                </div>
              ) : loading ? (
                <div
                  className={
                    view === "grid" ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-2" : "flex flex-col gap-6"
                  }
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ClinicCardSkeleton key={i} />
                  ))}
                </div>
              ) : pageItems.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="No clinics found"
                  description="Try changing your filters, widening the cost range or searching for a different city."
                  action={
                    <Button className="h-11 rounded-xl" onClick={resetFilters}>
                      Reset filters
                    </Button>
                  }
                />
              ) : (
                <div
                  key={view}
                  className={`animate-[fade-in_0.35s_ease-out] ${
                    view === "grid" ? "grid gap-6 sm:grid-cols-2" : "flex flex-col gap-6"
                  }`}
                >
                  {pageItems.map((c) => (
                    <ClinicCard
                      key={c.id}
                      clinic={c}
                      view={view}
                      saved={saved.includes(c.id)}
                      compared={compare.includes(c.id)}
                      onToggleSave={toggleSave}
                      onToggleCompare={toggleCompare}
                    />
                  ))}
                </div>
              )}
            </div>

            {!loading && !error && totalPages > 1 ? (
              <Pagination className="mt-10">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      aria-disabled={currentPage === 1}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.max(1, currentPage - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      aria-disabled={currentPage === totalPages}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Math.min(totalPages, currentPage + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </section>
        </div>
      </main>

      <CompareBar
        clinics={compare
          .map((id) => clinics.find((c) => c.id === id))
          .filter((c): c is Clinic => Boolean(c))}
        onRemove={(id) => setCompare((prev) => prev.filter((c) => c !== id))}
        onClear={() => setCompare([])}
      />

      <Footer />
    </div>
  );
}
