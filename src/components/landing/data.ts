import {
  ShieldCheck,
  Users,
  GitCompare,
  HeartHandshake,
  Search,
  Scale,
  MessagesSquare,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export const whySeedova: { icon: LucideIcon; title: string; body: string }[] = [

  {
    icon: ShieldCheck,
    title: "Transparent Clinic Information",
    body: "Verified details on services, success rates and realistic cost ranges — no hidden surprises.",
  },
  {
    icon: Users,
    title: "Anonymous Community",
    body: "Ask sensitive questions and share your story without ever revealing who you are.",
  },
  {
    icon: GitCompare,
    title: "Compare Clinics Easily",
    body: "Put shortlisted clinics side by side on cost, outcomes and patient feedback.",
  },
  {
    icon: HeartHandshake,
    title: "Patient-first Experience",
    body: "Built around your journey, not advertising. Clinics can't pay for better placement.",
  },
];

export const steps: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Search, title: "Search Clinics", body: "Find IVF clinics by city, state or treatment type." },
  { icon: Scale, title: "Compare Clinics", body: "Weigh cost ranges, success rates and services side by side." },
  { icon: MessagesSquare, title: "Read Anonymous Experiences", body: "Learn from patients who walked the same path." },
  { icon: CheckCircle2, title: "Make an Informed Decision", body: "Choose a clinic with clarity and confidence." },
];

export const featuredClinics = [
  {
    name: "Nova Fertility Centre",
    city: "Bengaluru, Karnataka",
    cost: "₹1.6L – ₹2.4L",
    success: "62%",
    rating: 4.7,
    reviews: 412,
    description: "Full-service IVF and ICSI centre with an in-house embryology lab and genetic counselling.",
  },
  {
    name: "Aster Bloom IVF",
    city: "Mumbai, Maharashtra",
    cost: "₹1.9L – ₹3.1L",
    success: "58%",
    rating: 4.5,
    reviews: 306,
    description: "Personalised fertility protocols, donor programmes and dedicated patient counsellors.",
  },
  {
    name: "Sanjeevani Fertility Hospital",
    city: "Hyderabad, Telangana",
    cost: "₹1.3L – ₹2.0L",
    success: "55%",
    rating: 4.4,
    reviews: 258,
    description: "Affordable IVF packages with transparent billing and structured follow-up care.",
  },
];

export const stories = [
  {
    handle: "Anonymous · 34",
    treatment: "IVF with ICSI",
    city: "Pune",
    rating: 5,
    text: "The cost breakdown here matched what I actually paid. Knowing that in advance took away so much anxiety.",
  },
  {
    handle: "Anonymous · 29",
    treatment: "IUI then IVF",
    city: "Delhi",
    rating: 4,
    text: "Reading other people's second-cycle stories helped me stay hopeful when my first cycle failed.",
  },
  {
    handle: "Anonymous · 38",
    treatment: "Frozen Embryo Transfer",
    city: "Chennai",
    rating: 5,
    text: "I compared four clinics in one evening. The success-rate context made the choice much clearer.",
  },
];

export const communityQuestions = [
  { q: "Is IVF painful?", answers: 42, tag: "Treatment" },
  { q: "How much does IVF cost in Bangalore?", answers: 67, tag: "Cost" },
  { q: "Anyone had success after second IVF cycle?", answers: 128, tag: "Experiences" },
  { q: "How do I choose between ICSI and conventional IVF?", answers: 35, tag: "Treatment" },
];
