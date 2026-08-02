import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminClinic, AdminClinicInput } from "@/lib/admin.functions";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const emptyForm = {
  slug: "",
  name: "",
  description: "",
  city: "",
  state: "",
  logoUrl: "",
  coverImageUrl: "",
  verified: false,
  published: true,
  costMin: "",
  costMax: "",
  successRate: "",
  treatments: "",
  facilities: "",
  highlights: "",
  establishedYear: "",
};

type FormState = typeof emptyForm;

function toForm(clinic: AdminClinic | null): FormState {
  if (!clinic) return { ...emptyForm };
  return {
    slug: clinic.slug,
    name: clinic.name,
    description: clinic.description ?? "",
    city: clinic.city,
    state: clinic.state ?? "",
    logoUrl: clinic.logoUrl ?? "",
    coverImageUrl: clinic.coverImageUrl ?? "",
    verified: clinic.verified,
    published: clinic.published,
    costMin: clinic.costMin == null ? "" : String(clinic.costMin),
    costMax: clinic.costMax == null ? "" : String(clinic.costMax),
    successRate: clinic.successRate == null ? "" : String(clinic.successRate),
    treatments: clinic.treatments.join(", "),
    facilities: clinic.facilities.join(", "),
    highlights: clinic.highlights.join(", "),
    establishedYear: clinic.establishedYear == null ? "" : String(clinic.establishedYear),
  };
}

const list = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const numOrNull = (value: string) => (value.trim() === "" ? null : Number(value));

export function ClinicFormDialog({
  open,
  onOpenChange,
  clinic,
  pending,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinic: AdminClinic | null;
  pending: boolean;
  onSubmit: (input: AdminClinicInput) => void;
}) {
  const [form, setForm] = useState<FormState>(() => toForm(clinic));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setForm(toForm(clinic));
      setError(null);
    }
  }, [open, clinic]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    if (!form.city.trim()) return setError("City is required.");
    const successRate = numOrNull(form.successRate);
    if (successRate != null && (Number.isNaN(successRate) || successRate < 0 || successRate > 100))
      return setError("Success rate must be between 0 and 100.");
    setError(null);
    onSubmit({
      ...(clinic ? { id: clinic.id } : {}),
      slug: form.slug.trim() || slugify(form.name),
      name: form.name,
      description: form.description.trim() || null,
      city: form.city,
      state: form.state.trim() || null,
      logoUrl: form.logoUrl.trim() || null,
      coverImageUrl: form.coverImageUrl.trim() || null,
      verified: form.verified,
      published: form.published,
      costMin: numOrNull(form.costMin),
      costMax: numOrNull(form.costMax),
      successRate,
      treatments: list(form.treatments),
      facilities: list(form.facilities),
      highlights: list(form.highlights),
      establishedYear: numOrNull(form.establishedYear),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{clinic ? "Edit clinic" : "New clinic"}</DialogTitle>
          <DialogDescription>
            Fields map to the clinic record used across search, compare and clinic profiles.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="clinic-name">Name *</Label>
              <Input
                id="clinic-name"
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-slug">Slug</Label>
              <Input
                id="clinic-slug"
                value={form.slug}
                placeholder={slugify(form.name) || "auto-generated"}
                onChange={(e) => set("slug", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-city">City *</Label>
              <Input
                id="clinic-city"
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-state">State</Label>
              <Input
                id="clinic-state"
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-logo">Logo URL</Label>
              <Input
                id="clinic-logo"
                value={form.logoUrl}
                onChange={(e) => set("logoUrl", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-cover">Cover image URL</Label>
              <Input
                id="clinic-cover"
                value={form.coverImageUrl}
                onChange={(e) => set("coverImageUrl", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-cost-min">Estimated cost min (₹)</Label>
              <Input
                id="clinic-cost-min"
                inputMode="numeric"
                value={form.costMin}
                onChange={(e) => set("costMin", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-cost-max">Estimated cost max (₹)</Label>
              <Input
                id="clinic-cost-max"
                inputMode="numeric"
                value={form.costMax}
                onChange={(e) => set("costMax", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-success">Success rate (%)</Label>
              <Input
                id="clinic-success"
                inputMode="decimal"
                value={form.successRate}
                onChange={(e) => set("successRate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-year">Established year</Label>
              <Input
                id="clinic-year"
                inputMode="numeric"
                value={form.establishedYear}
                onChange={(e) => set("establishedYear", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clinic-description">Description</Label>
            <Textarea
              id="clinic-description"
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="clinic-treatments">Treatments (comma separated)</Label>
              <Input
                id="clinic-treatments"
                value={form.treatments}
                onChange={(e) => set("treatments", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-facilities">Facilities (comma separated)</Label>
              <Input
                id="clinic-facilities"
                value={form.facilities}
                onChange={(e) => set("facilities", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clinic-highlights">Highlights (comma separated)</Label>
              <Input
                id="clinic-highlights"
                value={form.highlights}
                onChange={(e) => set("highlights", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="clinic-verified"
                checked={form.verified}
                onCheckedChange={(v) => set("verified", v)}
              />
              <Label htmlFor="clinic-verified">Verified</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="clinic-published"
                checked={form.published}
                onCheckedChange={(v) => set("published", v)}
              />
              <Label htmlFor="clinic-published">Published</Label>
            </div>
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <p className="text-xs text-muted-foreground">
            Rating and review counts are derived from patient reviews and cannot be edited here.
          </p>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : clinic ? "Save changes" : "Create clinic"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
