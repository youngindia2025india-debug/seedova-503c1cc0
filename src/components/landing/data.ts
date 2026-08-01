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
