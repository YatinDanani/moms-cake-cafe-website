"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { submitNetlifyForm } from "@/lib/netlifyForms";
import { UploadIcon, CloseIcon } from "./Icons";

const fieldClass =
  "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-coffee";
const labelClass = "block text-sm font-semibold mb-1.5";
const MIN_LEAD_DAYS = 2;
type Status = "idle" | "sending" | "sent" | "error";

function formatLocalDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CustomCakeForm() {
  const [status, setStatus] = useState<Status>("idle");
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const date = String(formData.get("date") ?? "");
    const minDate = minDateRef.current;
    if (date && minDate && date < minDate) {
      setDateError(`Please choose a date at least ${MIN_LEAD_DAYS} days out.`);
      return;
    }
    setDateError("");

    // The hidden file input is cleared after every pick (so the same file
    // can be re-selected), so its native value is stale at submit time —
    // drop it and attach the real selection from `files` state instead.
    formData.delete("photos");
    files.forEach((file) => formData.append("photos", file));

    setStatus("sending");
    try {
      await submitNetlifyForm(formData);
      setStatus("sent");
      form.reset();
      setFiles([]);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      name="custom-cake-order"
      data-netlify="true"
      netlify-honeypot="bot-field"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <input type="hidden" name="form-name" value="custom-cake-order" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out: <input name="bot-field" />
        </label>
      </p>

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
        <div>
          <label htmlFor="pickupTime" className={labelClass}>Pickup time</label>
          <input id="pickupTime" name="pickupTime" type="time" className={fieldClass} />
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
          name="photos"
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
        disabled={status === "sending"}
        className="inline-flex items-center rounded-full bg-coffee px-6 py-3 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send order request"}
      </button>
      {status === "sent" && (
        <p className="text-sm text-coffee font-medium">
          Order request sent. We&apos;ll follow up to confirm details and pricing.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-coffee font-medium">
          Something went wrong sending that. Try again, or email us directly.
        </p>
      )}
    </form>
  );
}
