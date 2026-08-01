import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COST_CEILING,
  COST_FLOOR,
  RATING_STEPS,
  citiesForState,
  formatCost,
  type ClinicFacets,
  type ClinicFilterState,
} from "./data";

type Props = {
  filters: ClinicFilterState;
  facets: ClinicFacets;
  facetsLoading?: boolean;
  onChange: (next: ClinicFilterState) => void;
  onReset: () => void;
  onApply?: () => void;
  resultCount: number;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function OptionList({
  options,
  selected,
  loading,
  emptyLabel,
  onToggle,
}: {
  options: string[];
  selected: string[];
  loading?: boolean;
  emptyLabel: string;
  onToggle: (value: string) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-2/3" />
        ))}
      </div>
    );
  }
  if (options.length === 0) {
    return <p className="text-xs text-muted-foreground">{emptyLabel}</p>;
  }
  return (
    <div className="space-y-2.5">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
          <Checkbox
            checked={selected.includes(option)}
            onCheckedChange={() => onToggle(option)}
            aria-label={option}
          />
          {option}
        </label>
      ))}
    </div>
  );
}

export function ClinicFilters({
  filters,
  facets,
  facetsLoading = false,
  onChange,
  onReset,
  onApply,
  resultCount,
}: Props) {
  const toggle = (key: "treatments" | "facilities", value: string) => {
    const list = filters[key];
    onChange({
      ...filters,
      [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

  const cities = citiesForState(facets, filters.state);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold tracking-tight text-foreground">Filters</p>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 rounded-lg text-xs">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
        </Button>
      </div>

      <div className="space-y-6 overflow-y-auto pr-1">
        <Section title="Location">
          <div className="space-y-2">
            <Label htmlFor="filter-state" className="sr-only">
              State
            </Label>
            <Select
              value={filters.state}
              onValueChange={(v) => onChange({ ...filters, state: v, city: "all" })}
              disabled={facetsLoading || facets.states.length === 0}
            >
              <SelectTrigger id="filter-state" className="h-11 rounded-xl">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                {facets.states.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor="filter-city" className="sr-only">
              City
            </Label>
            <Select
              value={filters.city}
              onValueChange={(v) => onChange({ ...filters, city: v })}
              disabled={facetsLoading || cities.length === 0}
            >
              <SelectTrigger id="filter-city" className="h-11 rounded-xl">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Treatments">
          <OptionList
            options={facets.treatments}
            selected={filters.treatments}
            loading={facetsLoading}
            emptyLabel="Treatments appear once clinics are listed."
            onToggle={(v) => toggle("treatments", v)}
          />
        </Section>

        <Section title={`Success rate — ${filters.minSuccess}%+`}>
          <Slider
            value={[filters.minSuccess]}
            onValueChange={([v]) => onChange({ ...filters, minSuccess: v ?? 0 })}
            max={100}
            step={5}
            aria-label="Minimum success rate"
          />
        </Section>

        <Section title={`Treatment cost — up to ${formatCost(filters.maxCost)}`}>
          <Slider
            value={[filters.maxCost]}
            onValueChange={([v]) => onChange({ ...filters, maxCost: v ?? COST_CEILING })}
            min={COST_FLOOR}
            max={COST_CEILING}
            step={25000}
            aria-label="Maximum treatment cost"
          />
        </Section>

        <Section title="Clinic rating">
          <div className="flex flex-wrap gap-2">
            {RATING_STEPS.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={filters.minRating === r}
                onClick={() => onChange({ ...filters, minRating: r })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  filters.minRating === r
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {r === 0 ? "Any" : `${r}+`}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Facilities">
          <OptionList
            options={facets.facilities}
            selected={filters.facilities}
            loading={facetsLoading}
            emptyLabel="Facilities appear once clinics are listed."
            onToggle={(v) => toggle("facilities", v)}
          />
        </Section>
      </div>

      {onApply ? (
        <Button onClick={onApply} className="h-12 w-full rounded-xl">
          Apply filters · {resultCount} clinics
        </Button>
      ) : (
        <p className="rounded-xl bg-secondary/70 px-3 py-2 text-center text-xs text-muted-foreground">
          {resultCount} clinics match your filters
        </p>
      )}
    </div>
  );
}
