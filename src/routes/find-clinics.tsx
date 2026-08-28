import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertTriangle,
  Building2,
  LayoutGrid,
  Rows3,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
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
  EMPTY_FACETS,
  MAX_COMPARE,
  PAGE_SIZE,
  SORT_OPTIONS,
  activeFilterCount,
  type Clinic,
  type ClinicFilterState,
  type SortKey,
} from "@/components/clinics/data";
import {
  getClinicFacets,
  getSearchSuggestions,
  listSavedClinicIds,
  searchClinics,
  toggleSavedClinic,
} from "@/lib/clinics.functions";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const TITLE = "Find IVF Clinics in India — Compare Cost & Success Rates | Seedova";
const DESCRIPTION =
  "Search verified IVF clinics across India by city, treatment, cost, success rate and patient rating. Save favourites and compare up to three clinics side by side.";
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
        }),
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { q?: string } =>
    typeof search.q === "string" && search.q ? { q: search.q } : {},
  component: FindClinicsPage,
});

function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function FindClinicsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const search = useServerFn(searchClinics);
  const facetsFn = useServerFn(getClinicFacets);
  const suggestFn = useServerFn(getSearchSuggestions);
  const savedIdsFn = useServerFn(listSavedClinicIds);
  const toggleSaveFn = useServerFn(toggleSavedClinic);

  const { q: initialQuery } = Route.useSearch();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [submitted, setSubmitted] = useState(initialQuery ?? "");
  const [filters, setFilters] = useState<ClinicFilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("rating");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [compare, setCompare] = useState<Clinic[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [submitted, filters, sort]);

  const facetsQuery = useQuery({
    queryKey: ["clinic-facets"],
    queryFn: () => facetsFn(),
    staleTime: 5 * 60_000,
  });

  const resultsQuery = useQuery({
    queryKey: ["clinics", submitted, filters, sort, page],
    queryFn: () => search({ data: { query: submitted, filters, sort, page, pageSize: PAGE_SIZE } }),
    placeholderData: (prev) => prev,
  });

  const debouncedQuery = useDebounced(query);
  const suggestionsQuery = useQuery({
    queryKey: ["clinic-suggestions", debouncedQuery],
    queryFn: () => suggestFn({ data: { query: debouncedQuery } }),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60_000,
  });

  const savedQuery = useQuery({
    queryKey: ["saved-clinic-ids", user?.id],
    queryFn: () => savedIdsFn(),
    enabled: Boolean(user),
    staleTime: 60_000,
  });
  const savedIds = savedQuery.data ?? [];

  const saveMutation = useMutation({
    mutationFn: (clinic: Clinic) => toggleSaveFn({ data: { clinicId: clinic.id } }),
    onSuccess: (result, clinic) => {
      queryClient.invalidateQueries({ queryKey: ["saved-clinic-ids"] });
      if (result.saved) {
        toast.success(`Saved ${clinic.name}`, {
          description: "Find it later in your saved clinics.",
        });
      } else {
        toast.success(`Removed ${clinic.name}`);
      }
    },
    onError: () => toast.error("Couldn't update your saved clinics. Please try again."),
  });

  const results = resultsQuery.data?.items ?? [];
  const total = resultsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const filterCount = activeFilterCount(filters);
  const hasSearchContext = Boolean(submitted) || filterCount > 0;
  const facets = facetsQuery.data ?? EMPTY_FACETS;

  const loading = resultsQuery.isPending;
  const error = resultsQuery.isError;

  const toggleSave = (clinic: Clinic) => {
    if (!user) {
      toast.info("Sign in to save clinics", {
        description: "Saved clinics sync to your Seedova account.",
      });
      return;
    }
    saveMutation.mutate(clinic);
  };

  const toggleCompare = (clinic: Clinic) => {
    setCompare((prev) => {
      if (prev.some((c) => c.id === clinic.id)) return prev.filter((c) => c.id !== clinic.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, clinic];
    });
    if (!compare.some((c) => c.id === clinic.id) && compare.length >= MAX_COMPARE) {
      toast.warning(`You can compare up to ${MAX_COMPARE} clinics`, {
        description: "Remove one from the comparison bar to add another.",
      });
    }
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    toast.info("Filters reset");
  };

  const compareIds = useMemo(() => compare.map((c) => c.id), [compare]);

  const filterPanel = (onApply?: () => void) => (
    <ClinicFilters
      filters={filters}
      facets={facets}
      facetsLoading={facetsQuery.isPending}
      onChange={setFilters}
      onReset={resetFilters}
      onApply={onApply}
      resultCount={total}
    />
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 pb-28">
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
              Verified listings · transparent pricing
            </Badge>
            <h1 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Find the right IVF clinic,
              <span className="block bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                with nothing hidden.
              </span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Compare cost ranges, success rates and patient ratings across India — then shortlist the
              clinics that fit your journey.
            </p>
            <div className="mt-8 max-w-3xl">
              <ClinicSearchBar
                query={query}
                onQueryChange={setQuery}
                onSubmit={setSubmitted}
                suggestions={suggestionsQuery.data ?? []}
                suggestionsLoading={suggestionsQuery.isFetching}
              />
            </div>
          </div>
        </section>

        <div className="sticky top-16 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <ClinicSearchBar
              query={query}
              onQueryChange={setQuery}
              onSubmit={setSubmitted}
              suggestions={suggestionsQuery.data ?? []}
              suggestionsLoading={suggestionsQuery.isFetching}
              sticky
            />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-36 rounded-[24px] border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
              {filterPanel()}
            </div>
          </aside>

          <section aria-labelledby="results-heading">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 id="results-heading" className="truncate text-lg font-semibold tracking-tight">
                  {loading
                    ? "Loading clinics…"
                    : `${total} ${total === 1 ? "clinic" : "clinics"} ${submitted ? `for “${submitted}”` : "available"}`}
                </h2>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-11 rounded-xl lg:hidden">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {filterCount > 0 ? (
                        <span className="ml-2 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                          {filterCount}
                        </span>
                      ) : null}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-[24px]">
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
                    Check your connection and try again.
                  </p>
                  <Button
                    className="mt-5 h-11 rounded-xl"
                    onClick={() => resultsQuery.refetch()}
                    disabled={resultsQuery.isFetching}
                  >
                    {resultsQuery.isFetching ? "Retrying…" : "Retry"}
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
              ) : results.length === 0 ? (
                hasSearchContext ? (
                  <EmptyState
                    icon={SearchX}
                    title="No clinics match your search"
                    description="Try a different city or treatment, widen the cost range, or clear a few filters."
                    action={
                      <Button className="h-11 rounded-xl" onClick={resetFilters}>
                        Reset filters
                      </Button>
                    }
                  />
                ) : (
                  <EmptyState
                    icon={Building2}
                    title="Clinic listings are on the way"
                    description="We're verifying IVF clinics across India before they appear here. Join the community in the meantime — you'll be first to know when listings go live."
                    action={
                      <Button asChild className="h-11 rounded-xl">
                        <Link to="/community">Explore the community</Link>
                      </Button>
                    }
                  />
                )
              ) : (
                <div
                  key={view}
                  className={`animate-[fade-in_0.35s_ease-out] ${
                    view === "grid" ? "grid gap-6 sm:grid-cols-2" : "flex flex-col gap-6"
                  }`}
                >
                  {results.map((c) => (
                    <ClinicCard
                      key={c.id}
                      clinic={c}
                      view={view}
                      saved={savedIds.includes(c.id)}
                      compared={compareIds.includes(c.id)}
                      savePending={saveMutation.isPending && saveMutation.variables?.id === c.id}
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
        clinics={compare}
        onRemove={(id) => setCompare((prev) => prev.filter((c) => c.id !== id))}
        onClear={() => setCompare([])}
      />

      <Footer />
    </div>
  );
}
