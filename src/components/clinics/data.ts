/**
 * Clinic domain types, filter contracts and pure helpers.
 * No business data lives here — every clinic value comes from the database.
 */

export type Clinic = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  city: string;
  state: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  verified: boolean;
  rating: number;
  reviews: number;
  costMin: number | null;
  costMax: number | null;
  successRate: number | null;
  treatments: string[];
  facilities: string[];
  highlights: string[];
  establishedYear: number | null;
};

/** Distinct filter values derived from the database, not hardcoded. */
export type ClinicFacets = {
  states: string[];
  citiesByState: Record<string, string[]>;
  cities: string[];
  treatments: string[];
  facilities: string[];
};

export const EMPTY_FACETS: ClinicFacets = {
  states: [],
  citiesByState: {},
  cities: [],
  treatments: [],
  facilities: [],
};

export type SortKey = "rating" | "cost" | "success" | "newest" | "reviews";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "rating", label: "Highest Rated" },
  { value: "cost", label: "Lowest Cost" },
  { value: "success", label: "Highest Success Rate" },
  { value: "newest", label: "Newest" },
  { value: "reviews", label: "Most Reviewed" },
];

export type ClinicFilterState = {
  state: string;
  city: string;
  treatments: string[];
  facilities: string[];
  minSuccess: number;
  maxCost: number;
  minRating: number;
};

export const COST_FLOOR = 0;
export const COST_CEILING = 1000000;

export const DEFAULT_FILTERS: ClinicFilterState = {
  state: "all",
  city: "all",
  treatments: [],
  facilities: [],
  minSuccess: 0,
  maxCost: COST_CEILING,
  minRating: 0,
};

export const RATING_STEPS = [0, 3.5, 4, 4.5] as const;

export const PAGE_SIZE = 6;
export const MAX_COMPARE = 3;

export const formatCost = (value: number | null | undefined) =>
  value == null ? "—" : `₹${(value / 100000).toFixed(1)}L`;

export const formatCostRange = (min: number | null, max: number | null) => {
  if (min == null && max == null) return "Not published";
  if (min != null && max != null) return `${formatCost(min)} – ${formatCost(max)}`;
  return formatCost(min ?? max);
};

export const activeFilterCount = (f: ClinicFilterState) =>
  (f.state !== "all" ? 1 : 0) +
  (f.city !== "all" ? 1 : 0) +
  f.treatments.length +
  f.facilities.length +
  (f.minSuccess > 0 ? 1 : 0) +
  (f.maxCost < DEFAULT_FILTERS.maxCost ? 1 : 0) +
  (f.minRating > 0 ? 1 : 0);

export const citiesForState = (facets: ClinicFacets, state: string) =>
  state === "all" ? facets.cities : (facets.citiesByState[state] ?? []);

export type ClinicSearchParams = {
  query: string;
  filters: ClinicFilterState;
  sort: SortKey;
  page: number;
  pageSize: number;
};

export type ClinicSearchResult = {
  items: Clinic[];
  total: number;
  page: number;
  pageSize: number;
};
