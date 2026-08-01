import { BadgeCheck, GitCompare, Heart, ImageOff, MapPin, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatCostRange, type Clinic } from "./data";

type Props = {
  clinic: Clinic;
  view: "grid" | "list";
  saved: boolean;
  compared: boolean;
  savePending?: boolean;
  onToggleSave: (clinic: Clinic) => void;
  onToggleCompare: (clinic: Clinic) => void;
};

export function ClinicCard({
  clinic,
  view,
  saved,
  compared,
  savePending = false,
  onToggleSave,
  onToggleCompare,
}: Props) {
  const isList = view === "list";
  const location = [clinic.city, clinic.state].filter(Boolean).join(", ");
  const initials = clinic.name.slice(0, 2).toUpperCase();

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-18px_oklch(0.4_0.06_175_/_0.35)]",
        isList && "sm:flex-row",
      )}
    >
      <div className={cn("relative overflow-hidden", isList ? "sm:w-72 sm:shrink-0" : "")}>
        {clinic.coverImageUrl ? (
          <img
            src={clinic.coverImageUrl}
            alt={`${clinic.name}${location ? ` in ${location}` : ""}`}
            width={1024}
            height={640}
            loading="lazy"
            className={cn(
              "h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105",
              isList && "sm:h-full sm:min-h-[13rem]",
            )}
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              "grid h-48 w-full place-items-center bg-[image:var(--gradient-primary)] text-primary-foreground/80",
              isList && "sm:h-full sm:min-h-[13rem]",
            )}
          >
            <ImageOff className="h-6 w-6" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-foreground/45 to-transparent" />
        {clinic.verified ? (
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
              <BadgeCheck className="h-3.5 w-3.5" /> Verified
            </span>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => onToggleSave(clinic)}
          disabled={savePending}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${clinic.name} from saved` : `Save ${clinic.name}`}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-90 disabled:opacity-60"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-all duration-300",
              saved ? "scale-110 fill-destructive text-destructive" : "text-muted-foreground",
            )}
          />
        </button>
        {clinic.reviews > 0 ? (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-[var(--accent)] text-[var(--accent)]" />
            {clinic.rating.toFixed(1)}
            <span className="font-normal text-muted-foreground">({clinic.reviews})</span>
          </div>
        ) : (
          <div className="absolute bottom-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            No reviews yet
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">
              {clinic.name}
            </h3>
            {location ? (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{location}</span>
              </p>
            ) : null}
          </div>
          {clinic.logoUrl ? (
            <img
              src={clinic.logoUrl}
              alt=""
              width={44}
              height={44}
              loading="lazy"
              className="h-11 w-11 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground">
              {initials}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary/70 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Est. cost</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {formatCostRange(clinic.costMin, clinic.costMax)}
            </p>
          </div>
          <div className="rounded-2xl bg-secondary/70 px-3 py-2.5">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Success rate</p>
            <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold text-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-[var(--accent)]" />
              {clinic.successRate == null ? "Not published" : `${clinic.successRate}%`}
            </p>
          </div>
        </div>

        {clinic.description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{clinic.description}</p>
        ) : null}

        {clinic.treatments.length ? (
          <div className="flex flex-wrap gap-1.5">
            {clinic.treatments.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full font-medium">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}

        {clinic.highlights.length ? (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {clinic.highlights.map((h) => (
              <li key={h} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {h}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Button className="h-11 flex-1 rounded-xl">View Profile</Button>
          <Button
            type="button"
            variant={compared ? "default" : "outline"}
            onClick={() => onToggleCompare(clinic)}
            aria-pressed={compared}
            className="h-11 rounded-xl"
          >
            <GitCompare className="mr-2 h-4 w-4" />
            {compared ? "Added" : "Compare"}
          </Button>
        </div>
      </div>
    </article>
  );
}
