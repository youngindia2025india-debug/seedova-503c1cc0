import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionError({
  message = "Something went wrong while loading this section.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-2 text-sm">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        <span className="text-foreground">{message}</span>
      </div>
      <Button size="sm" variant="outline" onClick={onRetry} aria-label="Retry loading section">
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2" aria-hidden>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3 rounded-md border border-border/60 bg-card p-3">
          {Array.from({ length: cols }).map((__, c) => (
            <Skeleton key={c} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function WidgetSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
  );
}
