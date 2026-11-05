import type { Metadata } from "next";
import Link from "next/link";
import { getMenu } from "@/lib/siteOverrides";
import { MenuBrowser } from "@/components/MenuBrowser";

export const metadata: Metadata = {
  title: "Menu | Mom's Cake Café",
  description:
    "Signature cakes, cupcakes, pastries, coffee, breakfast, and Mom's Meal sandwiches at Mom's Cake Café.",
};

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

      <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-20">
        <MenuBrowser menu={cakeMenu} />
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
