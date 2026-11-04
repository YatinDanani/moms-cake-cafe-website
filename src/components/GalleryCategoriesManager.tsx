"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "saving" | "saved" | "error";
type Row = { id: string; original: string; value: string };

let nextId = 0;
function newRowId() {
  nextId += 1;
  return `new-${nextId}`;
}

export function GalleryCategoriesManager({ initialCategories }: { initialCategories: string[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(
    initialCategories.map((c, i) => ({ id: `initial-${i}`, original: c, value: c }))
  );
  const [status, setStatus] = useState<Status>("idle");

  function updateRow(id: string, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { id: newRowId(), original: "", value: "" }]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleSave() {
    setStatus("saving");
    try {
      const categories = rows.map((r) => r.value);
      // A row whose text changed from its original (and wasn't just added)
      // is a rename — carry its photos along to the new name server-side.
      const renames = rows
        .filter((r) => r.original.trim() && r.value.trim() && r.original.trim() !== r.value.trim())
        .map((r) => ({ from: r.original, to: r.value.trim() }));

      const res = await fetch("/api/admin/gallery-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories, renames }),
      });
      if (!res.ok) throw new Error();
      // Reset the rename baseline so a second rename in this same session
      // diffs against what's now actually saved, not the original page load.
      setRows((prev) => prev.map((r) => ({ ...r, original: r.value })));
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-cocoa mb-1">Gallery categories</h2>
      <p className="text-sm text-cocoa/60 mb-4">
        These are the albums photos get filed under below. Renaming one keeps its photos with
        it — only deleting a category leaves its photos behind.
      </p>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-3">
            <input
              type="text"
              value={row.value}
              onChange={(e) => updateRow(row.id, e.target.value)}
              placeholder="Category name"
              className="flex-1 rounded-lg border border-cocoa/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
            />
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="text-xs text-coffee hover:text-coffee-dark shrink-0 whitespace-nowrap"
            >
              Remove
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-cocoa/60">No categories yet. Add at least one below.</p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={addRow}
          className="text-sm font-semibold text-coffee hover:text-coffee-dark"
        >
          + Add category
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save categories"}
        </button>
        {status === "saved" && <span className="text-sm text-coffee font-medium">Saved.</span>}
        {status === "error" && (
          <span className="text-sm text-coffee font-medium">Couldn&apos;t save. Try again.</span>
        )}
      </div>
    </section>
  );
}
