import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl italic text-primary">Seedova</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
              India's IVF clinic discovery and anonymous patient community.
            </p>
          </div>

          <nav aria-label="Explore" className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Explore</p>
            <Link to="/find-clinics" className="hover:text-foreground">Find Clinics</Link>
            <Link to="/find-clinics" className="hover:text-foreground">Compare</Link>
            <Link to="/reviews" className="hover:text-foreground">Reviews</Link>
            <Link to="/community" className="hover:text-foreground">Community</Link>
            <Link to="/resources" className="hover:text-foreground">Resources</Link>
          </nav>

          <nav aria-label="Account" className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Account</p>
            <Link to="/auth" search={{ mode: "signin" }} className="hover:text-foreground">Sign in</Link>
            <Link to="/auth" search={{ mode: "signup" }} className="hover:text-foreground">Create account</Link>
          </nav>

          <nav aria-label="Legal" className="flex flex-col gap-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Legal</p>
            <Link to="/legal" hash="privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/legal" hash="terms" className="hover:text-foreground">Terms</Link>
            <Link to="/legal" hash="disclaimer" className="hover:text-foreground">Disclaimer</Link>
          </nav>
        </div>

        <p className="mt-10 max-w-2xl text-[11px] leading-relaxed text-muted-foreground">
          Seedova provides information to help users make informed decisions. It does not provide
          medical advice.
        </p>
        <p className="mt-3 text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Seedova. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
