import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_FILTERS,
  FEATURES,
  TREATMENTS,
  citiesByState,
  formatCost,
  states,
  type ClinicFilterState,
} from "./data";

type Props = {
  filters: ClinicFilterState;
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

export function ClinicFilters({ filters, onChange, onReset, onApply, resultCount }: Props) {
  const toggle = (key: "treatments" | "features", value: string) => {
    const list = filters[key];
    onChange({
      ...filters,
      [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

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
            >
              <SelectTrigger id="filter-state" className="h-11 rounded-xl">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                {states.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor="filter-city" className="sr-only">
              City
            </Label>
            <Select value={filters.city} onValueChange={(v) => onChange({ ...filters, city: v })}>
              <SelectTrigger id="filter-city" className="h-11 rounded-xl">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cities</SelectItem>
                {citiesByState(filters.state).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Section>

        <Section title="Treatments">
          <div className="space-y-2.5">
            {TREATMENTS.map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                <Checkbox
                  checked={filters.treatments.includes(t)}
                  onCheckedChange={() => toggle("treatments", t)}
                  aria-label={t}
                />
                {t}
              </label>
            ))}
          </div>
        </Section>

        <Section title={`Success rate — ${filters.minSuccess}%+`}>
          <Slider
            value={[filters.minSuccess]}
            onValueChange={([v]) => onChange({ ...filters, minSuccess: v })}
            max={70}
            step={5}
            aria-label="Minimum success rate"
          />
        </Section>

        <Section title={`Treatment cost — up to ${formatCost(filters.maxCost)}`}>
          <Slider
            value={[filters.maxCost]}
            onValueChange={([v]) => onChange({ ...filters, maxCost: v })}
            min={100000}
            max={400000}
            step={10000}
            aria-label="Maximum treatment cost"
          />
        </Section>

        <Section title="Clinic rating">
          <div className="flex flex-wrap gap-2">
            {[0, 4, 4.3, 4.5].map((r) => (
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
          <div className="space-y-2.5">
            {FEATURES.map((f) => (
              <label key={f} className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                <Checkbox
                  checked={filters.features.includes(f)}
                  onCheckedChange={() => toggle("features", f)}
                  aria-label={f}
                />
                {f}
              </label>
            ))}
          </div>
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
