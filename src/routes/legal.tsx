import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

const TITLE = "Privacy, terms & medical disclaimer — Seedova";
const DESCRIPTION =
  "How Seedova protects your privacy, the terms of using the platform, and our medical disclaimer.";

export const Route = createFileRoute("/legal")({
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
  component: LegalPage,
});

const sections = [
  {
    id: "privacy",
    title: "Privacy",
    body: "Seedova is built around anonymity. Reviews and community posts are published without names. We collect only the information needed to run your account and never sell personal data.",
  },
  {
    id: "terms",
    title: "Terms",
    body: "By using Seedova you agree to use the platform respectfully and truthfully. Clinics cannot pay for better placement, and content that is misleading or identifies other patients may be removed.",
  },
  {
    id: "disclaimer",
    title: "Medical disclaimer",
    body: "Seedova provides information to help users make informed decisions. It does not provide medical advice. Always consult a qualified medical professional about your treatment.",
  },
];

function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
        <h1 className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-foreground">
          Privacy, terms & disclaimer
        </h1>
        <div className="mt-10 space-y-10">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
