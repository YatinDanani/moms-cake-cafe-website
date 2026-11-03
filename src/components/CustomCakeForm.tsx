"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { business } from "@/lib/content";
import { UploadIcon, CloseIcon } from "./Icons";

const fieldClass =
  "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee";
const labelClass = "block text-sm font-semibold mb-1.5";
const MIN_LEAD_DAYS = 3;

function formatLocalDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CustomCakeForm() {
  const [sent, setSent] = useState(false);
  const [dateError, setDateError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const minDateRef = useRef("");

  // Computed client-side (not during render) so the server-rendered HTML
  // never bakes in "today" — the date input gets its floor after mount.
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + MIN_LEAD_DAYS);
    const minDate = formatLocalDate(d);
    minDateRef.current = minDate;
    if (dateInputRef.current) dateInputRef.current.min = minDate;
  }, []);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  function addFiles(selected: FileList | null) {
    if (!selected) return;
    setFiles((prev) => [...prev, ...Array.from(selected)]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const get = (key: string) => String(form.get(key) ?? "").trim();

    const date = get("date");
    const minDate = minDateRef.current;
    if (date && minDate && date < minDate) {
      setDateError(`Please choose a date at least ${MIN_LEAD_DAYS} days out.`);
      return;
    }
    setDateError("");

    const lines = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      `Occasion: ${get("occasion")}`,
      `Date needed: ${date}`,
      `Servings: ${get("servings")}`,
      `Flavor ideas: ${get("flavor")}`,
      `Budget (optional): ${get("budget")}`,
      `Reference photos: ${
        files.length ? `${files.length} selected — please attach before sending (see note below)` : "none"
      }`,
      "",
      "Design notes:",
      get("notes"),
    ];

    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(
      `Custom cake order — ${get("occasion") || "new request"}`
    )}&body=${encodeURIComponent(lines.join("\n"))}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" type="text" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required className={fieldClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone</label>
          <input id="phone" name="phone" type="tel" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="date" className={labelClass}>Date needed</label>
          <input
            ref={dateInputRef}
            id="date"
            name="date"
            type="date"
            onChange={() => setDateError("")}
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-cocoa/60">
            Orders need at least {MIN_LEAD_DAYS} days&apos; notice.
          </p>
          {dateError && (
            <p className="mt-1 text-xs text-coffee font-medium">{dateError}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="occasion" className={labelClass}>Occasion</label>
          <select id="occasion" name="occasion" className={fieldClass} defaultValue="Birthday">
            <option>Birthday</option>
            <option>Wedding</option>
            <option>Anniversary</option>
            <option>Baby shower</option>
            <option>Graduation</option>
            <option>Other celebration</option>
          </select>
        </div>
        <div>
          <label htmlFor="servings" className={labelClass}>Servings needed</label>
          <input
            id="servings"
            name="servings"
            type="text"
            placeholder="e.g. 20 guests"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="flavor" className={labelClass}>Flavor ideas</label>
        <input
          id="flavor"
          name="flavor"
          type="text"
          placeholder="e.g. ube & coconut, or something citrusy"
          className={fieldClass}
        />
      </div>

      <div>
        <label htmlFor="budget" className={labelClass}>Budget (optional)</label>
        <input
          id="budget"
          name="budget"
          type="text"
          placeholder="e.g. $80–120"
          className={fieldClass}
        />
        <p className="mt-1.5 text-xs text-cocoa/60">
          This helps us suggest options — we confirm final pricing after reviewing your design.
        </p>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Design notes & inspiration
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          placeholder="Colors, themes, writing on the cake, anything you've seen and liked..."
          className={fieldClass}
        />
      </div>

      <div>
        <span className={labelClass}>Design photos (optional)</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-cocoa/20 bg-tan/40 px-4 py-4 text-sm font-semibold text-cocoa hover:border-coffee hover:text-coffee transition-colors"
        >
          <UploadIcon className="h-5 w-5" />
          Upload design photos
        </button>

        {previews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {previews.map((url, i) => (
              <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-cocoa/10">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not an optimizable asset */}
                <img src={url} alt={files[i].name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`Remove ${files[i].name}`}
                  className="absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full bg-cocoa/70 text-cream hover:bg-coffee"
                >
                  <CloseIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors"
      >
        Send order request
      </button>
      {sent && (
        <p className="text-sm text-coffee font-medium">
          Opening your email app with this order filled in
          {files.length > 0 && " — attach your selected photo(s) to that email before sending, mailto links can't carry them automatically"}
          . We&apos;ll follow up to confirm details and pricing.
        </p>
      )}
    </form>
  );
}
