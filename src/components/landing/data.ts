import {
  BadgeCheck,
  CheckCircle2,
  Eye,
  GitCompare,
  Lock,
  MessagesSquare,
  Search,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

/** Platform capabilities — not claims about individual clinics. */
export const trustStrip: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: "ART registration checks",
    body: "We record registration details clinics provide, where available.",
  },
  {
    icon: Users,
    title: "Anonymous reviews",
    body: "Real experiences shared without names attached.",
  },
  {
    icon: Eye,
    title: "Transparent information",
    body: "Only information that is published and sourced.",
  },
  {
    icon: Lock,
    title: "Privacy first",
    body: "Your identity stays yours. Always.",
  },
];

export const journeySteps: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Search, title: "Search", body: "Find clinics that match your needs." },
  { icon: BadgeCheck, title: "Verified clinics", body: "Identify verified clinic information." },
  { icon: GitCompare, title: "Compare", body: "Compare the information that matters." },
  { icon: Star, title: "Reviews", body: "Learn from anonymous experiences." },
  { icon: MessagesSquare, title: "Community", body: "Ask questions and learn from others." },
  { icon: CheckCircle2, title: "Decide", body: "Choose with greater confidence." },
];
