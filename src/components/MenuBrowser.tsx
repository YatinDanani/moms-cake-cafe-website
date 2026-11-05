"use client";

import { useState } from "react";
import Image from "next/image";
import type { Menu } from "@/lib/siteOverrides";
import { CakeSliceIcon } from "./Icons";

const FEATURED_CATEGORY = "Signature Cakes";

export function MenuBrowser({ menu }: { menu: Menu }) {
  const [activeCategory, setActiveCategory] = useState(
    menu.find((c) => c.category === FEATURED_CATEGORY)?.category ?? menu[0]?.category ?? ""
  );

  const active = menu.find((c) => c.category === activeCategory) ?? menu[0];
  if (!active) return null;

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {menu.map((section) => (
          <button
            key={section.category}
            type="button"
            onClick={() => setActiveCategory(section.category)}
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              section.category === activeCategory
                ? "bg-coffee text-cream"
                : "border-2 border-cocoa/15 text-cocoa hover:border-coffee hover:text-coffee"
            }`}
          >
            {section.category}
            <span className="ml-1.5 opacity-70">{section.items.length}</span>
          </button>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-center sm:text-left">
          {active.category}
        </h2>
        {active.note && <p className="mt-2 text-sm text-cocoa/60 max-w-md">{active.note}</p>}

        {active.category === FEATURED_CATEGORY ? (
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {active.items.map((item) => (
              <div
                key={item.name}
                className="rounded-2xl border border-cocoa/10 bg-white overflow-hidden"
              >
                <div className="relative aspect-[4/3] bg-tan/40">
                  {item.photo ? (
                    <Image
                      src={`/api/photos/${item.photo}`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <CakeSliceIcon className="h-10 w-10 text-cocoa/20" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-lg">{item.name}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-cocoa/60">{item.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                    {item.sizes.map((size) => (
                      <span key={size.label} className="text-sm font-medium text-coffee">
                        {size.price}
                        {size.label && <span className="text-cocoa/45"> · {size.label}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="mt-6 divide-y divide-cocoa/10 border-t border-b border-cocoa/10">
            {active.items.map((item) => (
              <li key={item.name} className="flex items-start justify-between py-3.5 gap-4">
                <div className="flex items-start gap-3">
                  {item.photo && (
                    <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={`/api/photos/${item.photo}`}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.description && (
                      <p className="mt-0.5 text-sm text-cocoa/60 max-w-sm">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {item.sizes.map((size) => (
                    <p key={size.label} className="text-cocoa/70 whitespace-nowrap text-sm">
                      {size.price}
                      {size.label && <span className="text-cocoa/45"> · {size.label}</span>}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
