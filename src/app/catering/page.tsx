import type { Metadata } from "next";
import Link from "next/link";
import { business, cateringPackages } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catering & Events — Mom's Cake Café",
  description: "Dessert tables, event cakes, and coffee service for weddings and gatherings around Victoria.",
};

const packageColors = ["bg-coffee text-cream", "bg-caramel text-cocoa", "bg-mocha text-cream"];

export default function CateringPage() {
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-16 pb-10 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">Catering & events</h1>
          <p className="mt-4 text-cocoa/75">
            Showers, office parties, weddings — if there&apos;s a table to fill,
            we&apos;ll fill it. Most events book 3–6 weeks out, sooner for peak
            wedding season.
          </p>
        </div>
      </section>

      <section className="bg-tan">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 grid sm:grid-cols-3 gap-6">
          {cateringPackages.map((pkg, i) => (
            <div key={pkg.name} className={`${packageColors[i % packageColors.length]} rounded-3xl p-7`}>
              <p className="font-display text-xl font-semibold">{pkg.name}</p>
              <p className="mt-1 text-sm opacity-80">{pkg.serves}</p>
              <p className="mt-4 text-sm opacity-90">{pkg.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream text-center">
        <div className="mx-auto max-w-xl px-5 sm:px-8 py-16">
          <h2 className="font-display text-3xl font-semibold">Planning an event?</h2>
          <p className="mt-3 text-cocoa/75">
            Email us the date, guest count, and what you have in mind, and
            we&apos;ll put together options and pricing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${business.email}?subject=${encodeURIComponent("Catering inquiry")}`}
              className="inline-flex items-center rounded-full bg-coffee px-6 py-3.5 text-base font-semibold text-cream hover:bg-coffee-dark transition-colors"
            >
              Email us about your event
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border-2 border-cocoa/15 px-6 py-3.5 text-base font-semibold text-cocoa hover:border-cocoa/30 transition-colors"
            >
              Contact details
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
