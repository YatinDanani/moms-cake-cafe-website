"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Testimonial } from "@/lib/siteOverrides";

type Status = "idle" | "saving" | "saved" | "error";
const inputClass =
  "w-full rounded-lg border border-cocoa/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-coffee";

export function TestimonialsManager({ initialItems }: { initialItems: Testimonial[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState<Status>("idle");

  function updateField(idx: number, field: keyof Testimonial, value: string) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { quote: "", name: "" }]);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-cocoa mb-4">Reviews</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-cocoa/10 p-4 space-y-2">
            <div className="flex items-start gap-3">
              <textarea
                value={item.quote}
                onChange={(e) => updateField(i, "quote", e.target.value)}
                placeholder="What the customer said"
                rows={2}
                className={`${inputClass} flex-1 resize-y`}
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-xs text-coffee hover:text-coffee-dark shrink-0 mt-1.5 whitespace-nowrap"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateField(i, "name", e.target.value)}
              placeholder="Customer name"
              className={inputClass}
            />
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-cocoa/60">No reviews yet.</p>}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={addItem}
          className="text-sm font-semibold text-coffee hover:text-coffee-dark"
        >
          + Add review
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save reviews"}
        </button>
        {status === "saved" && <span className="text-sm text-coffee font-medium">Saved.</span>}
        {status === "error" && (
          <span className="text-sm text-coffee font-medium">Couldn&apos;t save. Try again.</span>
        )}
      </div>
    </section>
  );
}
