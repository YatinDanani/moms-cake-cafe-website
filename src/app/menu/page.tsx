import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMenu } from "@/lib/siteOverrides";

export const metadata: Metadata = {
  title: "Menu | Mom's Cake Café",
  description: "Signature cakes, cupcakes, sansrival, coffee, and homemade meals at Mom's Cake Café.",
};

const bandColors = ["bg-coffee", "bg-caramel", "bg-mocha", "bg-latte", "bg-coffee"];

export default async function MenuPage() {
  const cakeMenu = await getMenu();
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 pt-16 pb-10 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">The menu</h1>
          <p className="mt-4 text-cocoa/75">
            Everything below is baked in-house. Prices are a guide. Call or
            email to confirm availability for the day you need.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-20 space-y-14">
        {cakeMenu.map((section, i) => (
          <section key={section.category}>
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${bandColors[i % bandColors.length]}`} />
              <h2 className="font-display text-2xl font-semibold">{section.category}</h2>
            </div>
            {section.note && (
              <p className="mt-2 text-sm text-cocoa/60 max-w-md">{section.note}</p>
            )}
            <ul className="mt-5 divide-y divide-cocoa/10 border-t border-b border-cocoa/10">
              {section.items.map((item) => (
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
          </section>
        ))}
      </div>

      <section className="bg-tan text-center">
        <div className="mx-auto max-w-xl px-5 sm:px-8 py-16">
          <h2 className="font-display text-3xl font-semibold">Need something custom?</h2>
          <p className="mt-3 text-cocoa/75">
            Wedding tiers, themed birthday cakes, and flavor combinations
            outside the menu are what the custom order form is for. These
            prices are for the standard menu. Custom designs are quoted
            once we&apos;ve seen what you have in mind.
          </p>
          <Link
            href="/custom-cakes"
            className="mt-6 inline-flex items-center rounded-full bg-coffee px-6 py-3.5 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors"
          >
            Start a custom order
          </Link>
        </div>
      </section>
    </>
  );
}
