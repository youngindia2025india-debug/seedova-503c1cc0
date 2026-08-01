import { useEffect, useRef, useState } from "react";
import { Clock, Loader2, Mic, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const RECENT_KEY = "seedova.recent-clinic-searches";

export function ClinicSearchBar({
  query,
  onQueryChange,
  onSubmit,
  suggestions = [],
  suggestionsLoading = false,
  sticky = false,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (value: string) => void;
  suggestions?: string[];
  suggestionsLoading?: boolean;
  sticky?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const commit = (value: string) => {
    onQueryChange(value);
    onSubmit(value);
    setOpen(false);
    const trimmed = value.trim();
    if (!trimmed) return;
    const next = [trimmed, ...recent.filter((r) => r !== trimmed)].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const hasQuery = query.trim().length > 0;
  const showPanel = open && (hasQuery ? suggestions.length > 0 || suggestionsLoading : recent.length > 0);

  return (
    <div ref={wrapRef} className="relative">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          commit(query);
        }}
        className={
          sticky
            ? "flex items-center gap-2 rounded-2xl border border-border/70 bg-card/80 p-2 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            : "flex items-center gap-2 rounded-[24px] border border-border/70 bg-card p-2.5 shadow-[0_18px_50px_-24px_oklch(0.4_0.06_175_/_0.45)] sm:p-3"
        }
      >
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            aria-label="Search clinics by name, city or treatment"
            placeholder="Search clinic, city or treatment"
            className={`rounded-2xl border-0 bg-transparent pl-11 pr-9 shadow-none focus-visible:ring-0 ${
              sticky ? "h-11 text-sm" : "h-14 text-base"
            }`}
          />
          {query ? (
            <button
              type="button"
              onClick={() => commit("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Voice search (coming soon)"
          onClick={() => toast.info("Voice search is coming soon")}
          className={sticky ? "h-11 w-11 shrink-0 rounded-xl" : "hidden h-12 w-12 shrink-0 rounded-2xl sm:inline-flex"}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          className={`shrink-0 rounded-2xl ${sticky ? "h-11 px-5" : "h-12 px-7 text-base"}`}
        >
          Search
        </Button>
      </form>

      {showPanel ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-border/70 bg-popover p-2 shadow-[0_18px_50px_-18px_oklch(0.4_0.06_175_/_0.35)]">
          {hasQuery ? (
            suggestionsLoading && suggestions.length === 0 ? (
              <p className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Searching…
              </p>
            ) : (
              <ul className="space-y-0.5">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => commit(s)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-secondary"
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <div>
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent searches
              </p>
              <ul className="space-y-0.5">
                {recent.map((r) => (
                  <li key={r}>
                    <button
                      type="button"
                      onClick={() => commit(r)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-secondary"
                    >
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {r}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
