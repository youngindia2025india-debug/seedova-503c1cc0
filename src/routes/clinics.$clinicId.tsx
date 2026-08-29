import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDirectoryClinic } from "@/lib/directory.functions";

export const Route = createFileRoute("/clinics/$clinicId")({
  loader: async ({ params }) => {
    const clinic = await getDirectoryClinic({ data: { id: params.clinicId } });
    if (!clinic) throw notFound();
    return clinic;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Clinic"} — Clinics Directory | Seedova` },
      {
        name: "description",
        content: loaderData
          ? `${loaderData.name}${loaderData.isVerified ? " — verified" : ""}, ${loaderData.state}. ${loaderData.artRegistered ? "ART Registered for IVF." : ""}`
          : "Clinic details on Seedova.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Clinic"} | Seedova` },
      {
        property: "og:description",
        content: loaderData
          ? `${loaderData.name}, ${loaderData.state}.`
          : "Clinic details on Seedova.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  notFoundComponent: ClinicNotFound,
  component: ClinicDetailPage,
});

function ClinicDetailPage() {
  const clinic = Route.useLoaderData();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <Button asChild variant="ghost" size="sm" className="-ml-2 rounded-xl">
        <Link to="/clinics" search={{ q: "", state: "all" }}>
          <ArrowLeft className="h-4 w-4" />
          Back to directory
        </Link>
      </Button>

      <article className="mt-6 rounded-[24px] border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)] sm:p-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold italic text-foreground sm:text-4xl">
            {clinic.name}
          </h1>
        </div>
        {clinic.artRegistered ? (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            ART Registered for IVF
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {clinic.isVerified ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <BadgeCheck className="h-3.5 w-3.5" />
              Verified
            </span>
          ) : null}
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            State: {clinic.state}
          </span>
        </div>

        <div className="mt-8 border-t border-border/70 pt-6">
          <p className="text-sm text-muted-foreground">
            For more information, please refer to the ART Registry.
          </p>
          {clinic.artRegistryLink ? (
            <Button asChild className="mt-4 rounded-xl">
              <a href={clinic.artRegistryLink} target="_blank" rel="noopener noreferrer">
                Get more information
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </article>
    </main>
  );
}

function ClinicNotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold italic text-foreground">
        Clinic not found
      </h1>
      <p className="mt-3 text-muted-foreground">
        This clinic may have been removed from the directory.
      </p>
      <Button asChild className="mt-6 rounded-xl">
        <Link to="/clinics" search={{ q: "", state: "all" }}>
          Browse the directory
        </Link>
      </Button>
    </main>
  );
}
