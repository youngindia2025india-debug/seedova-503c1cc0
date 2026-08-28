import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";

const TITLE = "IVF resources & guides — Seedova";
const DESCRIPTION =
  "Plain-language guides on IVF treatment steps, costs and questions to ask a clinic. Published as verified resources become available.";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-14 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground">
          Resources
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Plain-language guidance to help you understand your options and ask better questions.
        </p>
        <div className="mt-10">
          <EmptyState
            icon={BookOpen}
            title="Guides are being prepared"
            description="Resources will appear here once reviewed and published."
            action={
              <Button asChild variant="outline">
                <Link to="/find-clinics">Explore clinics</Link>
              </Button>
            }
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
