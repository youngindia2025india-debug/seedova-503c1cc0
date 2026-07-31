import clinic1 from "@/assets/clinic-1.jpg";
import clinic2 from "@/assets/clinic-2.jpg";
import clinic3 from "@/assets/clinic-3.jpg";
import clinic4 from "@/assets/clinic-4.jpg";

export const TREATMENTS = ["IVF", "ICSI", "IUI", "Egg Freezing", "Embryo Freezing"] as const;
export type Treatment = (typeof TREATMENTS)[number];

export const FEATURES = ["In-house Lab", "Donor Program", "Cryopreservation"] as const;
export type Feature = (typeof FEATURES)[number];

export type Clinic = {
  id: string;
  name: string;
  city: string;
  state: string;
  image: string;
  verified: boolean;
  rating: number;
  reviews: number;
  costMin: number;
  costMax: number;
  successRate: number;
  treatments: Treatment[];
  features: Feature[];
  highlights: string[];
  description: string;
  establishedYear: number;
};

const covers = [clinic1, clinic2, clinic3, clinic4];
const cover = (i: number) => covers[i % covers.length];

export const clinics: Clinic[] = [
  {
    id: "nova-bengaluru",
    name: "Nova Fertility Centre",
    city: "Bengaluru",
    state: "Karnataka",
    image: cover(0),
    verified: true,
    rating: 4.7,
    reviews: 412,
    costMin: 160000,
    costMax: 240000,
    successRate: 62,
    treatments: ["IVF", "ICSI", "IUI", "Egg Freezing"],
    features: ["In-house Lab", "Donor Program", "Cryopreservation"],
    highlights: ["Advanced Lab", "Transparent Pricing", "Experienced Team"],
    description:
      "Full-service IVF and ICSI centre with an in-house embryology lab and dedicated genetic counselling.",
    establishedYear: 2011,
  },
  {
    id: "aster-bloom-mumbai",
    name: "Aster Bloom IVF",
    city: "Mumbai",
    state: "Maharashtra",
    image: cover(1),
    verified: true,
    rating: 4.5,
    reviews: 306,
    costMin: 190000,
    costMax: 310000,
    successRate: 58,
    treatments: ["IVF", "ICSI", "Embryo Freezing"],
    features: ["In-house Lab", "Donor Program"],
    highlights: ["Personalised Protocols", "Counsellor Support", "Advanced Lab"],
    description:
      "Personalised fertility protocols, donor programmes and dedicated patient counsellors through every cycle.",
    establishedYear: 2014,
  },
  {
    id: "sanjeevani-hyderabad",
    name: "Sanjeevani Fertility Hospital",
    city: "Hyderabad",
    state: "Telangana",
    image: cover(2),
    verified: true,
    rating: 4.4,
    reviews: 258,
    costMin: 130000,
    costMax: 200000,
    successRate: 55,
    treatments: ["IVF", "IUI"],
    features: ["In-house Lab"],
    highlights: ["Transparent Pricing", "Structured Follow-up", "Experienced Team"],
    description:
      "Affordable IVF packages with transparent billing, structured follow-up care and no hidden charges.",
    establishedYear: 2009,
  },
  {
    id: "lotus-delhi",
    name: "Lotus Reproductive Medicine",
    city: "New Delhi",
    state: "Delhi",
    image: cover(3),
    verified: true,
    rating: 4.8,
    reviews: 521,
    costMin: 210000,
    costMax: 340000,
    successRate: 66,
    treatments: ["IVF", "ICSI", "Egg Freezing", "Embryo Freezing"],
    features: ["In-house Lab", "Cryopreservation", "Donor Program"],
    highlights: ["Advanced Lab", "Highest Success Rate", "Experienced Team"],
    description:
      "Research-led reproductive medicine centre with time-lapse incubation and PGT-A genetic screening.",
    establishedYear: 2007,
  },
  {
    id: "harmony-pune",
    name: "Harmony IVF Studio",
    city: "Pune",
    state: "Maharashtra",
    image: cover(0),
    verified: false,
    rating: 4.2,
    reviews: 147,
    costMin: 120000,
    costMax: 185000,
    successRate: 51,
    treatments: ["IVF", "IUI"],
    features: ["In-house Lab"],
    highlights: ["Transparent Pricing", "Boutique Care"],
    description:
      "Boutique fertility studio focused on low-stress cycles, gentle stimulation and calm clinical spaces.",
    establishedYear: 2018,
  },
  {
    id: "sunrise-chennai",
    name: "Sunrise Fertility Institute",
    city: "Chennai",
    state: "Tamil Nadu",
    image: cover(1),
    verified: true,
    rating: 4.6,
    reviews: 389,
    costMin: 150000,
    costMax: 245000,
    successRate: 60,
    treatments: ["IVF", "ICSI", "IUI", "Embryo Freezing"],
    features: ["In-house Lab", "Cryopreservation"],
    highlights: ["Advanced Lab", "Experienced Team", "Transparent Pricing"],
    description:
      "South India's long-standing fertility institute with a dedicated andrology and cryopreservation unit.",
    establishedYear: 2005,
  },
  {
    id: "meraki-ahmedabad",
    name: "Meraki Fertility Clinic",
    city: "Ahmedabad",
    state: "Gujarat",
    image: cover(2),
    verified: false,
    rating: 4.1,
    reviews: 96,
    costMin: 110000,
    costMax: 170000,
    successRate: 49,
    treatments: ["IUI", "IVF"],
    features: ["Donor Program"],
    highlights: ["Affordable Packages", "Flexible Scheduling"],
    description:
      "Community-focused clinic offering affordable IUI and IVF packages with flexible appointment slots.",
    establishedYear: 2019,
  },
  {
    id: "arya-jaipur",
    name: "Arya Women & Fertility",
    city: "Jaipur",
    state: "Rajasthan",
    image: cover(3),
    verified: true,
    rating: 4.3,
    reviews: 183,
    costMin: 140000,
    costMax: 215000,
    successRate: 54,
    treatments: ["IVF", "ICSI", "Egg Freezing"],
    features: ["In-house Lab", "Cryopreservation"],
    highlights: ["Advanced Lab", "Women-led Team"],
    description:
      "Women-led fertility team combining reproductive endocrinology with holistic pre-cycle preparation.",
    establishedYear: 2013,
  },
  {
    id: "genesis-kolkata",
    name: "Genesis Reproductive Care",
    city: "Kolkata",
    state: "West Bengal",
    image: cover(0),
    verified: true,
    rating: 4.5,
    reviews: 274,
    costMin: 125000,
    costMax: 195000,
    successRate: 57,
    treatments: ["IVF", "ICSI", "IUI", "Embryo Freezing"],
    features: ["In-house Lab", "Donor Program", "Cryopreservation"],
    highlights: ["Transparent Pricing", "Advanced Lab", "Experienced Team"],
    description:
      "Eastern India's referral centre for complex fertility cases, recurrent implantation failure and donor cycles.",
    establishedYear: 2010,
  },
  {
    id: "vitalis-kochi",
    name: "Vitalis IVF & Genetics",
    city: "Kochi",
    state: "Kerala",
    image: cover(1),
    verified: true,
    rating: 4.6,
    reviews: 221,
    costMin: 170000,
    costMax: 260000,
    successRate: 61,
    treatments: ["IVF", "ICSI", "Egg Freezing", "Embryo Freezing"],
    features: ["In-house Lab", "Cryopreservation"],
    highlights: ["Genetics Lab", "Advanced Lab", "Transparent Pricing"],
    description:
      "Integrated IVF and genetics practice offering embryo screening, fertility preservation and second opinions.",
    establishedYear: 2016,
  },
  {
    id: "anandam-lucknow",
    name: "Anandam Fertility Home",
    city: "Lucknow",
    state: "Uttar Pradesh",
    image: cover(2),
    verified: false,
    rating: 4.0,
    reviews: 78,
    costMin: 100000,
    costMax: 155000,
    successRate: 47,
    treatments: ["IUI", "IVF"],
    features: ["Donor Program"],
    highlights: ["Affordable Packages", "Local Support Groups"],
    description:
      "Neighbourhood fertility home with counsellor-led support groups and budget-conscious treatment plans.",
    establishedYear: 2020,
  },
  {
    id: "clarity-chandigarh",
    name: "Clarity Fertility Collective",
    city: "Chandigarh",
    state: "Punjab",
    image: cover(3),
    verified: true,
    rating: 4.4,
    reviews: 164,
    costMin: 155000,
    costMax: 230000,
    successRate: 56,
    treatments: ["IVF", "ICSI", "IUI", "Egg Freezing"],
    features: ["In-house Lab", "Cryopreservation", "Donor Program"],
    highlights: ["Transparent Pricing", "Advanced Lab", "Experienced Team"],
    description:
      "Upfront cost estimates before every cycle, with a shared decision-making model between doctor and patient.",
    establishedYear: 2015,
  },
];

export const states = Array.from(new Set(clinics.map((c) => c.state))).sort();
export const citiesByState = (state: string) =>
  Array.from(
    new Set(clinics.filter((c) => (state === "all" ? true : c.state === state)).map((c) => c.city)),
  ).sort();

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
  features: string[];
  minSuccess: number;
  maxCost: number;
  minRating: number;
};

export const DEFAULT_FILTERS: ClinicFilterState = {
  state: "all",
  city: "all",
  treatments: [],
  features: [],
  minSuccess: 0,
  maxCost: 400000,
  minRating: 0,
};

export const formatCost = (value: number) => `₹${(value / 100000).toFixed(1)}L`;

export function filterClinics(
  list: Clinic[],
  query: string,
  filters: ClinicFilterState,
): Clinic[] {
  const q = query.trim().toLowerCase();
  return list.filter((c) => {
    if (q && !`${c.name} ${c.city} ${c.state}`.toLowerCase().includes(q)) return false;
    if (filters.state !== "all" && c.state !== filters.state) return false;
    if (filters.city !== "all" && c.city !== filters.city) return false;
    if (filters.treatments.length && !filters.treatments.every((t) => c.treatments.includes(t as Treatment)))
      return false;
    if (filters.features.length && !filters.features.every((f) => c.features.includes(f as Feature)))
      return false;
    if (c.successRate < filters.minSuccess) return false;
    if (c.costMin > filters.maxCost) return false;
    if (c.rating < filters.minRating) return false;
    return true;
  });
}

export function sortClinics(list: Clinic[], sort: SortKey): Clinic[] {
  const copy = [...list];
  switch (sort) {
    case "cost":
      return copy.sort((a, b) => a.costMin - b.costMin);
    case "success":
      return copy.sort((a, b) => b.successRate - a.successRate);
    case "newest":
      return copy.sort((a, b) => b.establishedYear - a.establishedYear);
    case "reviews":
      return copy.sort((a, b) => b.reviews - a.reviews);
    case "rating":
    default:
      return copy.sort((a, b) => b.rating - a.rating);
  }
}

export const activeFilterCount = (f: ClinicFilterState) =>
  (f.state !== "all" ? 1 : 0) +
  (f.city !== "all" ? 1 : 0) +
  f.treatments.length +
  f.features.length +
  (f.minSuccess > 0 ? 1 : 0) +
  (f.maxCost < DEFAULT_FILTERS.maxCost ? 1 : 0) +
  (f.minRating > 0 ? 1 : 0);
