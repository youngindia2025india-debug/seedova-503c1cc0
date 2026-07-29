import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { EmptyState } from "@/components/common/EmptyState";
import { Users } from "lucide-react";

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
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Community</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask anonymous questions and read stories from patients who've been on the same journey.
        </p>
        <div className="mt-10">
          <EmptyState
            icon={Users}
            title="Community is coming soon"
            description="Questions, answers and shared experiences will live here. Stay tuned."
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
