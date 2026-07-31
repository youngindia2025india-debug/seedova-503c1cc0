import { Skeleton } from "@/components/ui/skeleton";

export function ClinicCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-[var(--shadow-soft)]">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="w-full space-y-2">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-11 w-11 rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-2">
          <Skeleton className="h-11 flex-1 rounded-xl" />
          <Skeleton className="h-11 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
