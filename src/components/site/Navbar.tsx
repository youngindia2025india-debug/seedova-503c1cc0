import { Link } from "@tanstack/react-router";
import { Sprout, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { to: "/find-clinics", label: "Find Clinics" },
  { to: "/find-clinics", label: "Compare" },
  { to: "/reviews", label: "Reviews" },
  { to: "/community", label: "Community" },
  { to: "/resources", label: "Resources" },
] as const;

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 md:grid-cols-[auto_1fr_auto]">
        <Link to="/" className="flex min-w-0 items-center gap-2 text-foreground">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sprout className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-[family-name:var(--font-display)] text-2xl font-semibold italic leading-none text-primary">
              Seedova
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
              Trusted IVF discovery
            </span>
          </span>
        </Link>

        <nav className="hidden items-center justify-center gap-7 md:flex">
          {nav.map((n) => (
            <Link
              key={n.label}
              to={n.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-medium" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Button asChild size="sm" className="rounded-xl">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-xl">
                <Link to="/auth" search={{ mode: "signin" }}>
                  Sign in
                </Link>
              </Button>
              <Button asChild size="sm" className="rounded-xl">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Create free account
                </Link>
              </Button>
            </>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="justify-self-end md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>Seedova</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-1">
              {nav.map((n) => (
                <Link
                  key={n.label}
                  to={n.to}
                  className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-4 border-t pt-4">
                {user ? (
                  <Button asChild className="w-full">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline">
                      <Link to="/auth" search={{ mode: "signin" }}>
                        Sign in
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link to="/auth" search={{ mode: "signup" }}>
                        Create free account
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
