"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/lib/siteOverrides";
import { CloseIcon } from "./Icons";

type Section = { category: string; photos: GalleryPhoto[] };

export function GalleryBrowser({ sections }: { sections: Section[] }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const open = sections.find((s) => s.category === openCategory) ?? null;
  const photos = open?.photos ?? [];

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ left: 0 });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      const el = scrollRef.current;
      if (e.key === "Escape") setOpenCategory(null);
      if (e.key === "ArrowLeft" && el) el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
      if (e.key === "ArrowRight" && el) el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el || el.clientWidth === 0) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {sections.map((section) => (
          <button
            key={section.category}
            type="button"
            onClick={() => setOpenCategory(section.category)}
            className="group text-left"
          >
            <div className="relative aspect-[3/4]">
              {/* Stacked pages behind the cover */}
              <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-r-xl rounded-l-sm bg-cocoa/10" />
              <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-r-xl rounded-l-sm bg-cocoa/15" />
              <div className="relative h-full w-full overflow-hidden rounded-r-xl rounded-l-sm shadow-md transition-shadow group-hover:shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element -- variable aspect ratio cover photo */}
                <img
                  src={`/api/photos/${section.photos[0].key}`}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/85 via-cocoa/10 to-transparent" />
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-coffee" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-display text-lg font-semibold text-cream leading-tight">
                    {section.category}
                  </p>
                  <p className="mt-0.5 text-xs text-cream/70">{section.photos.length} photos</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-cocoa/95">
          <div className="flex items-center justify-between px-5 py-4 shrink-0">
            <div>
              <p className="font-display text-lg font-semibold text-cream">{open.category}</p>
              <p className="text-xs text-cream/60">
                {activeIndex + 1} / {photos.length}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpenCategory(null)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 transition-colors"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 flex overflow-x-auto snap-x snap-mandatory"
          >
            {photos.map((photo) => (
              <div
                key={photo.key}
                className="w-full shrink-0 snap-center flex flex-col items-center justify-center gap-3 px-6 pb-8"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- full-size carousel view */}
                <img
                  src={`/api/photos/${photo.key}`}
                  alt={photo.caption || "A cake from Mom's Cake Café"}
                  className="max-h-[75vh] max-w-full rounded-xl object-contain"
                />
                {photo.caption && <p className="text-sm text-cream/80">{photo.caption}</p>}
              </div>
            ))}
          </div>

          {photos.length > 1 && (
            <p className="pb-5 text-center text-xs text-cream/50 shrink-0">
              Scroll or swipe sideways for more
            </p>
          )}
        </div>
      )}
    </div>
  );
}
