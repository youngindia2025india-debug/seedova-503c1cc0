import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const filters = ["City", "State", "Treatment Type"];

export function SearchSection() {
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  return (
    <section id="find-clinics" aria-labelledby="search-heading" className="mx-auto max-w-4xl px-4 sm:px-6">
      <h2 id="search-heading" className="sr-only">
        Search IVF clinics
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.info("Clinic search is coming soon", {
            description: query ? `We'll show results for “${query}”.` : undefined,
          });
        }}
        className="rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-6"
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search by clinic name, city or state"
              placeholder="Search by clinic name, city or state"
              className="h-12 rounded-xl pl-9 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 shrink-0 rounded-xl">
            Search
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Quick filters:</span>
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={active === f}
              onClick={() => setActive(active === f ? null : f)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
