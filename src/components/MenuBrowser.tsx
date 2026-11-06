"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Menu, MenuItem } from "@/lib/siteOverrides";
import { CakeSliceIcon } from "./Icons";

const FEATURED_CATEGORY = "Signature Cakes";
// Categories with an "Order this" link to /order-cake, alongside the
// featured category (which gets its own card-grid treatment below).
const ORDERABLE_CATEGORIES = ["Cupcakes"];

// If every item in a category shares the same ordered, non-empty set of
// size labels (e.g. every drink has Small/Medium/Large), those labels can
// be shown once as column headers instead of repeated on every row. Mixed
// categories (some items with different or no labels) fall back to the
// simpler inline "price · label" list.
function getUniformSizeLabels(items: MenuItem[]): string[] | null {
  const first = items[0]?.sizes.map((s) => s.label) ?? [];
  if (first.length === 0 || first.some((label) => !label)) return null;
  const allMatch = items.every(
    (item) =>
      item.sizes.length === first.length && item.sizes.every((s, i) => s.label === first[i])
  );
  return allMatch ? first : null;
}

export function MenuBrowser({ menu }: { menu: Menu }) {
  const [activeCategory, setActiveCategory] = useState(
    menu.find((c) => c.category === FEATURED_CATEGORY)?.category ?? menu[0]?.category ?? ""
  );

  const active = menu.find((c) => c.category === activeCategory) ?? menu[0];
  if (!active) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {menu.map((section) => (
          <div key={section.category} className="contents">
            <button
              type="button"
              onClick={() => setActiveCategory(section.category)}
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                section.category === activeCategory
                  ? "bg-coffee text-cream"
                  : "border-2 border-cocoa/15 text-cocoa hover:border-coffee hover:text-coffee"
              }`}
            >
              {section.category}
            </button>
            {section.category === FEATURED_CATEGORY && (
              <Link
                href="/custom-cakes"
                className="inline-flex items-center rounded-full border-2 border-coffee px-4 py-2 text-sm font-semibold text-coffee hover:bg-coffee hover:text-cream transition-colors"
              >
                Custom Cake
              </Link>
            )}
          </div>
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
                  <Link
                    href={`/order-cake?cake=${encodeURIComponent(item.name)}`}
                    className="mt-4 inline-flex items-center rounded-full border-2 border-cocoa/15 px-4 py-2 text-sm font-semibold text-cocoa hover:border-coffee hover:text-coffee transition-colors"
                  >
                    Order this cake
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          (() => {
            const columnLabels = getUniformSizeLabels(active.items);

            if (columnLabels) {
              return (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full border-b border-cocoa/10">
                    <thead>
                      <tr className="border-b border-cocoa/10">
                        <th className="text-left font-medium text-xs uppercase tracking-wide text-cocoa/50 pb-2 pt-3" />
                        {columnLabels.map((label) => (
                          <th
                            key={label}
                            className="text-right font-medium text-xs uppercase tracking-wide text-cocoa/50 pb-2 pt-3 pl-4 whitespace-nowrap"
                          >
                            {label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cocoa/10">
                      {active.items.map((item) => (
                        <tr key={item.name}>
                          <td className="py-3.5 pr-4 align-top">
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="mt-0.5 text-sm text-cocoa/60 max-w-sm">
                                {item.description}
                              </p>
                            )}
                          </td>
                          {item.sizes.map((size) => (
                            <td
                              key={size.label}
                              className="py-3.5 pl-4 align-top text-right text-cocoa/70 whitespace-nowrap text-sm"
                            >
                              {size.price}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }

            return (
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
                          <p className="mt-0.5 text-sm text-cocoa/60 max-w-sm">
                            {item.description}
                          </p>
                        )}
                        {ORDERABLE_CATEGORIES.includes(active.category) && (
                          <Link
                            href={`/order-cake?cake=${encodeURIComponent(item.name)}`}
                            className="mt-1 inline-block text-xs font-semibold text-coffee hover:text-coffee-dark"
                          >
                            Order this
                          </Link>
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
            );
          })()
        )}
      </div>
    </div>
  );
}
