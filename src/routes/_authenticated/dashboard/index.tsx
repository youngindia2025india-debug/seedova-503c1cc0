import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  GitCompare,
  Heart,
  MapPin,
  MessageCircle,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useAuth } from "@/lib/auth-context";
import { getLandingOverview } from "@/lib/landing.functions";
import { getMyProfile, getMySavedClinics, getMyTreatmentJourney } from "@/lib/dashboard.functions";
import dashboardCouple from "@/assets/dashboard-couple.png";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({ meta: [{ title: "Your Seedova dashboard" }, { name: "robots", content: "noindex" }] }),
  component: DashboardHome,
});

const stages = [
  "Getting Started",
  "Consultation & Evaluation",
  "Tests & Diagnosis",
  "Treatment Planning",
  "Treatment",
  "Follow-up",
] as const;

const quickActions = [
  {
    title: "Find a Clinic",
    description: "Discover fertility clinics that fit your needs.",
    to: "/find-clinics",
    icon: Search,
  },
  {
    title: "Compare Clinics",
    description: "Compare clinics before making a decision.",
    to: "/find-clinics",
    icon: GitCompare,
  },
  {
    title: "Read Reviews",
    description: "See what other patients experienced.",
    to: "/dashboard/my-reviews",
    icon: Star,
  },
  {
    title: "Ask the Community",
    description: "Ask questions anonymously and learn from others.",
    to: "/community",
    icon: MessageCircle,
  },
] as const;

const resources = [
  { title: "Understanding IVF", to: "/resources" },
  { title: "Questions to ask your fertility doctor", to: "/resources" },
  { title: "How to compare fertility clinics", to: "/find-clinics" },
] as const;

function firstNameFromValue(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const firstName = value.trim().split(/\s+/)[0];
  return firstName || null;
}

function firstNameFromUser(user: ReturnType<typeof useAuth>["user"]): string | null {
  const metadata = user?.user_metadata;
  const firstName = firstNameFromValue(metadata?.full_name) ??
    firstNameFromValue(metadata?.name) ??
    firstNameFromValue(metadata?.display_name) ??
    firstNameFromValue(metadata?.first_name);
  return firstName || null;
}

function relativeTime(date: string) {
  const elapsed = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(elapsed / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function DashboardHome() {
  const { user } = useAuth();
  const overviewFn = useServerFn(getLandingOverview);
  const profileFn = useServerFn(getMyProfile);
  const savedClinicsFn = useServerFn(getMySavedClinics);
  const journeyFn = useServerFn(getMyTreatmentJourney);
  const overview = useQuery({ queryKey: ["dashboard-community"], queryFn: () => overviewFn() });
  const profile = useQuery({ queryKey: ["dashboard-profile"], queryFn: () => profileFn() });
  const savedClinics = useQuery({ queryKey: ["dashboard-saved-clinics"], queryFn: () => savedClinicsFn() });
  const journey = useQuery({ queryKey: ["dashboard-treatment-journey"], queryFn: () => journeyFn() });

  const completedStages = useMemo(() => {
    const stageNames = new Set(journey.data?.map((entry) => entry.stage.trim().toLowerCase()));
    return stages.reduce((count, stage) => count + (stageNames.has(stage.toLowerCase()) ? 1 : 0), 0);
  }, [journey.data]);
  const currentStage = stages[Math.min(completedStages, stages.length - 1)];
  const name = firstNameFromUser(user) ?? firstNameFromValue(profile.data?.displayName);

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-8 lg:space-y-12">
      <section className="relative overflow-hidden rounded-[24px] border border-border/70 bg-card shadow-[var(--shadow-soft)]">
        <div className="grid items-center lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Your private Seedova space
            </p>
            <h1 className="mt-5 max-w-xl text-balance font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-tight text-foreground sm:text-6xl">
              {name ? `Welcome back, ${name}` : "Welcome back 👋"}
            </h1>
            <p className="mt-5 max-w-lg text-xl font-medium leading-snug text-foreground sm:text-2xl">
              Your fertility journey, all in one place.
            </p>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              Discover trusted care, keep track of your journey, and make informed decisions at your own pace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-11 rounded-xl px-5">
                <Link to="/dashboard/treatment-journey">
                  Continue your journey <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-xl px-5">
                <Link to="/find-clinics">Explore clinics</Link>
              </Button>
            </div>
          </div>
          <DashboardIllustration />
        </div>
      </section>

      <section aria-labelledby="journey-heading">
        <SectionHeading eyebrow="Discover · Decide · Track · Connect" title="Your Journey" />
        <Card className="mt-5 overflow-hidden rounded-[18px] border-border/70 shadow-none">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Current stage
              </div>
              <p className="mt-3 text-xl font-semibold text-foreground">{currentStage}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {journey.isPending ? "Loading your progress…" : `${completedStages} of ${stages.length} steps completed`}
              </p>
              <Button asChild variant="link" className="mt-5 h-auto px-0 text-primary">
                <Link to="/dashboard/treatment-journey">
                  View treatment journey <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Progress</span>
                <span className="font-mono-plex text-foreground">{Math.round((completedStages / stages.length) * 100)}%</span>
              </div>
              <Progress value={(completedStages / stages.length) * 100} className="mt-3 h-2.5" />
              <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stages.map((stage, index) => {
                  const isComplete = index < completedStages;
                  const isCurrent = index === completedStages;
                  return (
                    <li key={stage} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] ${isComplete ? "border-primary bg-primary text-primary-foreground" : isCurrent ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                        {isComplete ? "✓" : index + 1}
                      </span>
                      <span className={isCurrent ? "font-semibold text-foreground" : "text-muted-foreground"}>
                        {stage}{isCurrent ? " · Current" : ""}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </Card>
      </section>

      <section aria-labelledby="actions-heading">
        <SectionHeading title="Where would you like to start?" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.to} className="group rounded-[16px] border border-border/70 bg-card p-5 shadow-none transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-soft)]">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-sans text-base font-semibold text-foreground">{action.title}</h3>
                <p className="mt-2 text-sm leading-5 text-muted-foreground">{action.description}</p>
                <ChevronRight className="mt-4 h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="saved-heading">
        <SectionHeading title="Your Saved Clinics" action={<Button asChild variant="ghost" size="sm" className="rounded-xl"><Link to="/find-clinics">Explore clinics <ArrowRight className="h-4 w-4" /></Link></Button>} />
        <div className="mt-5">
          {savedClinics.isPending ? (
            <div className="grid gap-3 md:grid-cols-2">
              {[0, 1].map((item) => <Skeleton key={item} className="h-32 rounded-[16px]" />)}
            </div>
          ) : savedClinics.isError ? (
            <EmptyState icon={Heart} title="Saved clinics couldn't be loaded" description="Please try again in a moment." action={<Button variant="outline" onClick={() => savedClinics.refetch()}>Try again</Button>} />
          ) : savedClinics.data.length === 0 ? (
            <Card className="rounded-[16px] border-dashed border-border/80 bg-secondary/40 p-7 shadow-none">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-sans font-semibold text-foreground">Your saved clinics will appear here.</p>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Save clinics you’re considering so you can easily compare and revisit them later.</p>
                </div>
                <Button asChild variant="outline" className="shrink-0 rounded-xl"><Link to="/find-clinics">Explore clinics</Link></Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {savedClinics.data.map((clinic) => <SavedClinicCard key={clinic.id} clinic={clinic} />)}
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="community-heading" className="rounded-[20px] border border-border/70 bg-secondary/45 p-6 sm:p-8">
        <SectionHeading title="From the Seedova Community" action={<Button asChild variant="ghost" size="sm" className="rounded-xl"><Link to="/community">View community <ArrowRight className="h-4 w-4" /></Link></Button>} />
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {overview.isPending ? [0, 1, 2].map((item) => <Skeleton key={item} className="h-40 rounded-[16px]" />) : overview.data?.questions.slice(0, 3).map((question) => (
            <Link key={question.id} to="/community" className="group rounded-[16px] border border-border/70 bg-card p-5 transition-colors hover:border-primary/40">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><CircleHelp className="h-3.5 w-3.5 text-primary" aria-hidden="true" />Anonymous</span>
                <span>{relativeTime(question.createdAt)}</span>
              </div>
              <p className="mt-4 line-clamp-3 font-sans text-base font-semibold leading-6 text-foreground">{question.title}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />{question.answers} {question.answers === 1 ? "reply" : "replies"}</span>
                <span className="inline-flex items-center gap-1 text-primary">View discussion <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
          {!overview.isPending && (overview.data?.questions.length ?? 0) === 0 ? <div className="lg:col-span-3"><EmptyState icon={MessageCircle} title="The community is just getting started" description="Questions from Seedova members will appear here as the conversation grows." action={<Button asChild variant="outline"><Link to="/community">Visit community</Link></Button>} /></div> : null}
        </div>
      </section>

      <section aria-labelledby="resources-heading">
        <SectionHeading title="Helpful for your journey" />
        <div className="mt-4 divide-y divide-border/70 rounded-[16px] border border-border/70 bg-card">
          {resources.map((resource) => <Link key={resource.title} to={resource.to} className="group flex items-center justify-between gap-4 p-4 text-sm transition-colors first:rounded-t-[16px] last:rounded-b-[16px] hover:bg-secondary/50 sm:px-5"><span className="inline-flex items-center gap-3 font-medium text-foreground"><BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />{resource.title}</span><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" /></Link>)}
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: React.ReactNode }) {
  return <div className="flex items-end justify-between gap-4"><div>{eyebrow ? <p className="font-mono-plex text-[10px] uppercase tracking-[0.16em] text-primary">{eyebrow}</p> : null}<h2 className="mt-1 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h2></div>{action}</div>;
}

function SavedClinicCard({ clinic }: { clinic: { id: string; name: string; city: string; state: string | null; verified: boolean; rating: number; reviews: number } }) {
  return <Card className="flex items-center justify-between gap-4 rounded-[16px] border-border/70 p-5 shadow-none"><div className="min-w-0"><h3 className="truncate font-sans text-base font-semibold text-foreground">{clinic.name}</h3><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{[clinic.city, clinic.state].filter(Boolean).join(", ")}</p><div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">{clinic.verified ? <span className="inline-flex items-center gap-1 text-primary"><BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />Verified</span> : null}{clinic.reviews > 0 ? <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" aria-hidden="true" />{clinic.rating.toFixed(1)} ({clinic.reviews})</span> : <span>No reviews yet</span>}</div></div><Button asChild variant="outline" size="sm" className="shrink-0 rounded-xl"><Link to="/clinics/$clinicId" params={{ clinicId: clinic.id }}>View clinic</Link></Button></Card>;
}

function DashboardIllustration() {
  return <div className="relative min-h-[250px] overflow-hidden bg-secondary/70 lg:min-h-[390px]"><img src={dashboardCouple} alt="A couple researching fertility care together at home" width={886} height={850} className="h-full min-h-[250px] w-full object-cover object-center lg:min-h-[390px]" /></div>;
}