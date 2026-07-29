import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-foreground">Seedova</p>
            <p className="mt-1 text-xs text-muted-foreground">
              India's trusted IVF clinic discovery & anonymous patient community.
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/community" className="hover:text-foreground">Community</Link>
            <Link to="/auth" search={{ mode: "signin" }} className="hover:text-foreground">Sign in</Link>
          </nav>
        </div>
        <p className="mt-8 text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} Seedova. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
