"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DeliveryLinks } from "@/lib/siteOverrides";

type Status = "idle" | "saving" | "saved" | "error";
const inputClass =
  "w-full rounded-lg border border-cocoa/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-coffee";

export function DeliveryLinksEditor({ initialLinks }: { initialLinks: DeliveryLinks }) {
  const router = useRouter();
  const [links, setLinks] = useState(initialLinks);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links),
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
      <h2 className="font-display text-xl font-semibold text-cocoa mb-4">Delivery links</h2>
      <div className="bg-white rounded-xl border border-cocoa/10 p-4 space-y-3 max-w-md">
        <div>
          <label htmlFor="doordash" className="block text-sm font-semibold mb-1.5">DoorDash</label>
          <input
            id="doordash"
            type="url"
            value={links.doordash}
            onChange={(e) => setLinks((l) => ({ ...l, doordash: e.target.value }))}
            placeholder="https://www.doordash.com/store/..."
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ubereats" className="block text-sm font-semibold mb-1.5">Uber Eats</label>
          <input
            id="ubereats"
            type="url"
            value={links.ubereats}
            onChange={(e) => setLinks((l) => ({ ...l, ubereats: e.target.value }))}
            placeholder="https://www.ubereats.com/store/..."
            className={inputClass}
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-cocoa/60 max-w-md">
        Each link only shows up on the site once it&apos;s filled in.
      </p>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save delivery links"}
        </button>
        {status === "saved" && <span className="text-sm text-coffee font-medium">Saved.</span>}
        {status === "error" && (
          <span className="text-sm text-coffee font-medium">Couldn&apos;t save. Try again.</span>
        )}
      </div>
    </section>
  );
}
