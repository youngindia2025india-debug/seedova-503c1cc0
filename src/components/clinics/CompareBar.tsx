import { GitCompare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Clinic } from "./data";

export function CompareBar({
  clinics,
  onRemove,
  onClear,
}: {
  clinics: Clinic[];
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  if (clinics.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
      <div className="pointer-events-auto w-full max-w-3xl animate-[fade-in_0.3s_ease-out] rounded-[24px] border border-border/70 bg-card/90 p-3 shadow-[0_18px_50px_-18px_oklch(0.4_0.06_175_/_0.45)] backdrop-blur-xl sm:p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
            <span className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground sm:inline-flex">
              <GitCompare className="h-4 w-4 text-primary" />
              Compare
            </span>
            {clinics.map((c) => (
              <span
                key={c.id}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
              >
                {c.name}
                <button
                  type="button"
                  onClick={() => onRemove(c.id)}
                  aria-label={`Remove ${c.name} from comparison`}
                  className="rounded-full p-0.5 transition-colors hover:bg-background"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClear} className="rounded-lg">
              Clear
            </Button>
            <Button size="sm" disabled={clinics.length < 2} className="h-10 rounded-xl px-4">
              Compare {clinics.length}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
