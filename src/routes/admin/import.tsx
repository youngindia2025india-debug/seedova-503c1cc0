import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminLayout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminImportClinics, type AdminClinicInput } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/import")({
  component: AdminImportPage,
});

const FIELDS = [
  { key: "name", label: "Name *", required: true },
  { key: "slug", label: "Slug" },
  { key: "city", label: "City *", required: true },
  { key: "state", label: "State" },
  { key: "description", label: "Description" },
  { key: "logoUrl", label: "Logo URL" },
  { key: "coverImageUrl", label: "Cover image URL" },
  { key: "costMin", label: "Cost min" },
  { key: "costMax", label: "Cost max" },
  { key: "successRate", label: "Success rate" },
  { key: "treatments", label: "Treatments" },
  { key: "facilities", label: "Facilities" },
  { key: "highlights", label: "Highlights" },
  { key: "establishedYear", label: "Established year" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((v) => v.trim() !== "")) rows.push(row);
      row = [];
    } else cell += char;
  }
  row.push(cell);
  if (row.some((v) => v.trim() !== "")) rows.push(row);
  const headers = (rows.shift() ?? []).map((h) => h.trim());
  return { headers, rows };
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const NONE = "__none__";

function AdminImportPage() {
  const importClinics = useServerFn(adminImportClinics);
  const [fileName, setFileName] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Partial<Record<FieldKey, string>>>({});
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = parseCsv(text);
      if (!parsed.headers.length || !parsed.rows.length) {
        setParseError("The file has no header row or no data rows.");
        return;
      }
      setParseError(null);
      setFileName(file.name);
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      const auto: Partial<Record<FieldKey, string>> = {};
      for (const field of FIELDS) {
        const match = parsed.headers.find(
          (h) => h.toLowerCase().replace(/[^a-z]/g, "") === field.key.toLowerCase(),
        );
        if (match) auto[field.key] = match;
      }
      setMapping(auto);
    } catch {
      setParseError("Could not read this file. Upload a UTF-8 encoded CSV.");
    }
  };

  const value = (row: string[], key: FieldKey) => {
    const header = mapping[key];
    if (!header) return "";
    const index = headers.indexOf(header);
    return index === -1 ? "" : (row[index] ?? "").trim();
  };

  const mapped: AdminClinicInput[] = useMemo(
    () =>
      rows.map((row) => {
        const name = value(row, "name");
        const list = (key: FieldKey) =>
          value(row, key)
            .split(/[;|]/)
            .map((v) => v.trim())
            .filter(Boolean);
        const num = (key: FieldKey) => {
          const raw = value(row, key);
          const parsed = raw === "" ? null : Number(raw);
          return parsed == null || Number.isNaN(parsed) ? null : parsed;
        };
        return {
          slug: value(row, "slug") || slugify(name),
          name,
          description: value(row, "description") || null,
          city: value(row, "city"),
          state: value(row, "state") || null,
          logoUrl: value(row, "logoUrl") || null,
          coverImageUrl: value(row, "coverImageUrl") || null,
          verified: false,
          published: false,
          costMin: num("costMin"),
          costMax: num("costMax"),
          successRate: num("successRate"),
          treatments: list("treatments"),
          facilities: list("facilities"),
          highlights: list("highlights"),
          establishedYear: num("establishedYear"),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, headers, mapping],
  );

  const invalidRows = mapped.filter((r) => !r.name || !r.city).length;

  const importMutation = useMutation({
    mutationFn: () => importClinics({ data: { rows: mapped } }),
    onSuccess: (result) => toast.info(result.message),
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <AdminPageHeader
        title="Import clinic data"
        description="Upload a CSV, map its columns to clinic fields, and preview the result before importing."
      />

      <Alert className="mb-4">
        <Upload className="h-4 w-4" />
        <AlertTitle>Import pipeline not connected yet</AlertTitle>
        <AlertDescription>
          Mapping and preview work end to end, but the backend ingestion job is a placeholder — no
          rows are written to the database yet.
        </AlertDescription>
      </Alert>

      <div className="space-y-1.5">
        <Label htmlFor="csv-file">CSV file</Label>
        <Input
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          className="max-w-sm"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        {fileName ? (
          <p className="text-xs text-muted-foreground">
            {fileName} · {rows.length} data row{rows.length === 1 ? "" : "s"}
          </p>
        ) : null}
        {parseError ? (
          <p role="alert" className="text-sm text-destructive">
            {parseError}
          </p>
        ) : null}
      </div>

      {headers.length > 0 ? (
        <>
          <h2 className="mt-6 mb-2 text-sm font-semibold">Column mapping</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {FIELDS.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label htmlFor={`map-${field.key}`}>{field.label}</Label>
                <Select
                  value={mapping[field.key] ?? NONE}
                  onValueChange={(header) =>
                    setMapping((prev) => ({
                      ...prev,
                      [field.key]: header === NONE ? undefined : header,
                    }))
                  }
                >
                  <SelectTrigger id={`map-${field.key}`} className="h-9">
                    <SelectValue placeholder="Not mapped" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Not mapped</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <h2 className="mt-6 mb-2 text-sm font-semibold">Preview (first 10 rows)</h2>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <Table>
              <caption className="sr-only">Preview of mapped clinic rows</caption>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Name</TableHead>
                  <TableHead scope="col">City</TableHead>
                  <TableHead scope="col">State</TableHead>
                  <TableHead scope="col">Treatments</TableHead>
                  <TableHead scope="col">Cost</TableHead>
                  <TableHead scope="col">Success</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mapped.slice(0, 10).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className={row.name ? "" : "text-destructive"}>
                      {row.name || "Missing"}
                    </TableCell>
                    <TableCell className={row.city ? "" : "text-destructive"}>
                      {row.city || "Missing"}
                    </TableCell>
                    <TableCell>{row.state ?? "—"}</TableCell>
                    <TableCell>{row.treatments.join(", ") || "—"}</TableCell>
                    <TableCell className="tabular-nums">
                      {row.costMin ?? "—"} – {row.costMax ?? "—"}
                    </TableCell>
                    <TableCell className="tabular-nums">{row.successRate ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button
              disabled={importMutation.isPending || invalidRows > 0 || mapped.length === 0}
              onClick={() => importMutation.mutate()}
            >
              {importMutation.isPending ? "Importing…" : `Import ${mapped.length} row(s)`}
            </Button>
            {invalidRows > 0 ? (
              <p role="alert" className="text-sm text-destructive">
                {invalidRows} row(s) are missing a name or city. Fix the mapping or the file.
              </p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
