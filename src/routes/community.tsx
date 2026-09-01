import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, MessageCircle, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const topics = [
  "All",
  "Costs & insurance",
  "Dealing with family pressure",
  "Egg retrieval",
  "Embryo transfer",
  "Male factor",
  "Second opinions",
  "Donor eggs",
  "Tier-2 city clinics",
] as const;

type CommunityPost = {
  id: number;
  city: string;
  context: string;
  topic: (typeof topics)[number];
  title: string;
  body: string;
  replies: number;
  views: number;
  posted: string;
  helpfulReply?: string;
};

const posts: CommunityPost[] = [
  {
    id: 1,
    city: "Pune",
    context: "trying for 14 months",
    topic: "Costs & insurance",
    title: "Clinic quoted ₹1.8L for IVF but the bill came to ₹3.1L — is this normal?",
    body: "Our insurance isn't covering any of it, and every scan and medicine seems to add another line to the bill. I wish we had known what to ask before starting.",
    replies: 18,
    views: 426,
    posted: "2h ago",
    helpfulReply:
      "Ask for an itemised quote before the next cycle. Some employers in Pune and Bangalore also offer fertility riders that are easy to miss in the benefits portal.",
  },
  {
    id: 2,
    city: "Delhi NCR",
    context: "in a joint family",
    topic: "Dealing with family pressure",
    title: "How do you answer relatives at every shaadi and puja without lying or breaking down?",
    body: "Someone asks ‘koi khushkhabri?’ at every family function. I want to protect our privacy without making my parents feel like they have to explain us.",
    replies: 31,
    views: 781,
    posted: "5h ago",
    helpfulReply:
      "A calm, repeated line can help: ‘We’ll share when there’s something to share — for now, please keep us in your prayers.’ You don't owe anyone more detail.",
  },
  {
    id: 3,
    city: "Bengaluru",
    context: "after a first failed transfer",
    topic: "Embryo transfer",
    title: "How long did you wait between a failed transfer and trying again?",
    body: "My doctor says we can review the cycle soon, but I am also stressed about taking more leave without pay. How did you decide when your body and mind were ready?",
    replies: 14,
    views: 308,
    posted: "Yesterday",
  },
  {
    id: 4,
    city: "Coimbatore",
    context: "comparing first clinics",
    topic: "Tier-2 city clinics",
    title: "Worth travelling to Chennai or Bangalore, or are local clinics catching up?",
    body: "We would rather stay close to home if the care is good, but we keep hearing that bigger cities have more lab experience. What made you choose?",
    replies: 22,
    views: 512,
    posted: "Yesterday",
  },
  {
    id: 5,
    city: "Hyderabad",
    context: "starting our first consult",
    topic: "Male factor",
    title: "Low sperm count diagnosis — where do we even start?",
    body: "We received the report yesterday and feel completely out of our depth. Is a repeat test and an andrologist the usual first step?",
    replies: 9,
    views: 196,
    posted: "2d ago",
  },
];

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community — Seedova" },
      { name: "description", content: "Anonymous IVF community: ask questions, share experiences and support each other." },
      { property: "og:title", content: "Seedova Community" },
      { property: "og:description", content: "Ask anonymous questions and read real IVF experiences from other patients." },
    ],
  }),
  component: CommunityPage,
});

function CommunityPage() {
  const [selectedTopic, setSelectedTopic] = useState<(typeof topics)[number]>("All");
  const [showMoreMessage, setShowMoreMessage] = useState(false);
  const filteredPosts = useMemo(
    () =>
      selectedTopic === "All"
        ? posts
        : posts.filter((post) => post.topic === selectedTopic),
    [selectedTopic],
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <header>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Community
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            From Mumbai to Coimbatore, every question here comes from someone mid-cycle,
            mid-decision, or fielding &quot;any good news?&quot; at every family function. Ask
            anything. Read what others learned the hard way.
          </p>
        </header>

        <section className="mt-9 flex flex-col gap-5 rounded-lg bg-secondary-foreground p-5 text-secondary sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-base font-semibold text-secondary sm:text-lg">
              Have a question no one around you can answer?
            </p>
            <p className="mt-1 text-xs text-secondary/75">Posts are anonymous by default</p>
          </div>
          <Button asChild className="shrink-0 bg-card text-card-foreground hover:bg-card/90">
            <Link to="/auth" search={{ mode: "signup" }}>
              Ask the community
            </Link>
          </Button>
        </section>

        <section className="mt-8" aria-label="Filter questions by topic">
          <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {topics.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <Button
                  key={topic}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setShowMoreMessage(false);
                  }}
                  className="h-9 shrink-0 rounded-full px-3.5 text-xs"
                >
                  {topic}
                </Button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 space-y-4" aria-label="Anonymous questions">
          {filteredPosts.map((post) => (
            <article key={post.id} className="rounded-md border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      Anonymous <span className="px-1">·</span> {post.city}{" "}
                      <span className="px-1">·</span> {post.context}
                    </p>
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-medium text-accent-foreground">
                      {post.topic}
                    </span>
                  </div>
                  <h2 className="mt-4 font-sans text-base font-semibold leading-6 text-foreground sm:text-lg">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.body}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      {post.replies} replies
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      {post.views} views
                    </span>
                    <span>{post.posted}</span>
                  </div>
                  {post.helpfulReply ? (
                    <div className="mt-4 rounded-md bg-secondary/70 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary-foreground">
                        Most helpful reply
                      </p>
                      <p className="mt-2 text-sm leading-6 text-secondary-foreground/85">
                        {post.helpfulReply}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
          {filteredPosts.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-10 text-center">
              <p className="font-sans text-sm font-medium text-foreground">No questions in this topic yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">Be the first person to ask.</p>
            </div>
          ) : null}
        </section>

        <div className="mt-8 text-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMoreMessage(true)}
            className="rounded-full"
          >
            Show more questions
          </Button>
          {showMoreMessage ? (
            <p className="mt-3 text-xs text-muted-foreground">You&apos;re all caught up for now.</p>
          ) : null}
          <p className="mx-auto mt-5 max-w-xl text-xs leading-5 text-muted-foreground">
            <ShieldCheck className="mr-1 inline-block h-3.5 w-3.5 align-[-2px]" aria-hidden="true" />
            Names, clinics, and identifying details are never public. Only you can see your own posts.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
