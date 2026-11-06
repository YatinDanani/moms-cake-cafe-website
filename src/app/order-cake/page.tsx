import type { Metadata } from "next";
import Link from "next/link";
import { getMenu } from "@/lib/siteOverrides";
import { MenuOrderForm } from "@/components/MenuOrderForm";

// Categories orderable from this page without a custom design consultation.
const ORDERABLE_CATEGORIES = ["Signature Cakes", "Cupcakes"];

export const metadata: Metadata = {
  title: "Order a Cake or Cupcakes | Mom's Cake Café",
  description: "Order a signature cake or cupcakes for pickup, no custom design needed.",
};

// Reads searchParams to preselect an item from the menu's "Order this" links
// — that's runtime data, so this page can't be statically prerendered.
export const instant = false;

export default async function OrderCakePage({
  searchParams,
}: {
  searchParams: Promise<{ cake?: string }>;
}) {
  const [menu, params] = await Promise.all([getMenu(), searchParams]);
  const sections = menu
    .filter((section) => ORDERABLE_CATEGORIES.includes(section.category))
    .filter((section) => section.items.length > 0);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-2xl px-5 sm:px-8 pt-16 pb-20">
        <div className="text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold">Order from the Menu</h1>
          <p className="mt-4 text-cocoa/75">
            Pick a signature cake or cupcakes for pickup, exactly as they&apos;re made every day.
            Want something custom instead?{" "}
            <Link href="/custom-cakes" className="text-coffee font-semibold hover:text-coffee-dark">
              Start a custom order
            </Link>
            .
          </p>
        </div>
        <div className="mt-10">
          <MenuOrderForm sections={sections} initialItem={params.cake} />
        </div>
      </div>
    </section>
  );
}
