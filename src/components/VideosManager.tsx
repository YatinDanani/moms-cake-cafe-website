"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { VideoItem } from "@/lib/siteOverrides";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

type Status = "idle" | "saving" | "saved" | "error";
const inputClass =
  "w-full rounded-lg border border-cocoa/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-coffee";

export function VideosManager({ initialItems }: { initialItems: VideoItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState<Status>("idle");

  function updateField(idx: number, field: keyof VideoItem, value: string) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { title: "", url: "" }]);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/videos", {
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
      <h2 className="font-display text-xl font-semibold text-cocoa mb-4">Videos</h2>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-cocoa/10 p-4 space-y-2">
            <div className="flex items-start gap-3">
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateField(i, "title", e.target.value)}
                placeholder="Video title (optional)"
                className={`${inputClass} flex-1`}
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
              type="url"
              value={item.url}
              onChange={(e) => updateField(i, "url", e.target.value)}
              placeholder="YouTube link"
              className={inputClass}
            />
            {item.url.trim() && (
              getYouTubeEmbedUrl(item.url) ? (
                <p className="text-xs text-coffee">Looks good, this will embed.</p>
              ) : (
                <p className="text-xs text-cocoa/60">
                  Couldn&apos;t read this as a YouTube link. It&apos;ll still show as a plain link on the site.
                </p>
              )
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-cocoa/60">No videos yet.</p>}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={addItem}
          className="text-sm font-semibold text-coffee hover:text-coffee-dark"
        >
          + Add video
        </button>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save videos"}
        </button>
        {status === "saved" && <span className="text-sm text-coffee font-medium">Saved.</span>}
        {status === "error" && (
          <span className="text-sm text-coffee font-medium">Couldn&apos;t save. Try again.</span>
        )}
      </div>
    </section>
  );
}
