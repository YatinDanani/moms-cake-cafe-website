"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryPhoto } from "@/lib/siteOverrides";
import { compressImage } from "@/lib/compressImage";
import { CloseIcon } from "./Icons";

type Status = "idle" | "uploading" | "saved" | "error";

export function GalleryManager({
  initialPhotos,
  categories,
}: {
  initialPhotos: GalleryPhoto[];
  categories: string[];
}) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState<string>(categories[0] ?? "");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadOne(file: File) {
    const compressed = await compressImage(file);
    const formData = new FormData();
    formData.append("file", compressed);
    formData.append("caption", caption);
    formData.append("category", category);
    const res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ? `${file.name}: ${body.error}` : `${file.name}: upload failed`);
    }
    const { key } = await res.json();
    setPhotos((prev) => [...prev, { key, caption, category }]);
  }

  async function handleUpload(files: File[]) {
    setStatus("uploading");
    setErrorMessage(null);
    setProgress({ done: 0, total: files.length });
    try {
      // One at a time: each save reads-then-writes the full gallery list, so
      // parallel uploads could overwrite each other's additions.
      for (let i = 0; i < files.length; i++) {
        await uploadOne(files[i]);
        setProgress({ done: i + 1, total: files.length });
      }
      setCaption("");
      setStatus("saved");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setProgress(null);
    }
  }

  async function handleRemove(key: string) {
    if (!window.confirm("Remove this photo from the gallery?")) return;
    setRemovingKey(key);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!res.ok) throw new Error();
      setPhotos((prev) => prev.filter((p) => p.key !== key));
      setErrorMessage(null);
      setStatus("saved");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMessage("Couldn't remove that photo. Try again.");
    } finally {
      setRemovingKey(null);
    }
  }

  const visiblePhotos = filterCategory ? photos.filter((p) => p.category === filterCategory) : photos;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-display text-xl font-semibold text-cocoa">Gallery</h2>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-lg border border-cocoa/15 bg-white px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
        >
          <option value="">All categories ({photos.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c} ({photos.filter((p) => p.category === c).length})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
        {visiblePhotos.map((photo) => (
          <div key={photo.key} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin-only, dynamic uploaded content */}
            <img
              src={`/api/photos/${photo.key}`}
              alt={photo.caption || "Gallery photo"}
              className="w-full aspect-square object-cover rounded-xl border border-cocoa/10"
            />
            <button
              type="button"
              onClick={() => handleRemove(photo.key)}
              disabled={removingKey === photo.key}
              aria-label="Remove photo"
              className="absolute top-1.5 right-1.5 h-7 w-7 flex items-center justify-center rounded-full bg-cocoa/70 text-cream hover:bg-coffee"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <p className="mt-1 text-xs font-medium text-coffee truncate">{photo.category}</p>
            {photo.caption && (
              <p className="text-xs text-cocoa/60 truncate">{photo.caption}</p>
            )}
          </div>
        ))}
        {visiblePhotos.length === 0 && (
          <p className="col-span-full text-sm text-cocoa/60">
            {photos.length === 0 ? "No photos yet. Add the first one below." : "No photos in this category yet."}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-cocoa/60">
          Upload to
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-cocoa/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (optional, applies to all selected)"
          className="rounded-lg border border-cocoa/15 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coffee"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            if (files.length) handleUpload(files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={status === "uploading"}
          className="inline-flex items-center rounded-full border-2 border-cocoa/15 px-4 py-2 text-sm font-semibold text-cocoa hover:border-coffee hover:text-coffee transition-colors disabled:opacity-60"
        >
          {status === "uploading"
            ? `Uploading ${progress ? `${progress.done}/${progress.total}` : "…"}`
            : "Add photos"}
        </button>
        {status === "saved" && <span className="text-sm text-coffee font-medium">Saved.</span>}
        {status === "error" && (
          <span className="text-sm text-coffee font-medium">
            {errorMessage || "Something went wrong. Try again."}
          </span>
        )}
      </div>
    </section>
  );
}
